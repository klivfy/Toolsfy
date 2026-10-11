import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";

type AdminClient = ReturnType<typeof createAdminClient>;

/** Thrown on any database failure so the route answers 500 and Stripe retries. */
class WebhookDbError extends Error {}

function idOf(value: string | { id: string } | null | undefined) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

async function resolveUserId(
  supabase: AdminClient,
  customerId: string | null,
  metadataUserId?: string | null,
) {
  if (metadataUserId) return metadataUserId;
  if (!customerId) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (error) throw new WebhookDbError(`lookup by customer failed: ${error.message}`);
  return (data?.user_id as string | undefined) ?? null;
}

async function applySubscriptionEvent(
  supabase: AdminClient,
  event: Stripe.Event,
  values: {
    userId: string;
    customerId: string | null;
    subscriptionId: string | null;
    status: string | null;
  },
) {
  const { data: applied, error } = await supabase.rpc("apply_stripe_subscription_event", {
    p_user_id: values.userId,
    p_customer_id: values.customerId,
    p_subscription_id: values.subscriptionId,
    p_status: values.status,
    p_event_created: new Date(event.created * 1000).toISOString(),
  });

  if (error) throw new WebhookDbError(`apply event failed: ${error.message}`);

  console.log(
    applied
      ? `[stripe-webhook] ${event.type} (${event.id}) applied for user ${values.userId}, status ${values.status ?? "unchanged"}`
      : `[stripe-webhook] ${event.type} (${event.id}) skipped: a newer event was already applied for user ${values.userId}`,
  );
}

async function handleCheckoutSession(
  supabase: AdminClient,
  event: Stripe.Event,
  session: Stripe.Checkout.Session,
) {
  const userId = session.metadata?.supabase_user_id ?? session.client_reference_id;

  if (!userId) {
    console.warn(`[stripe-webhook] ${event.type} (${event.id}) without a resolvable user_id`);
    return;
  }

  // Asynchronous methods (e.g. boleto) complete the session before the
  // money arrives: store the ids, activate only once it is paid.
  const isPaid = session.payment_status === "paid";

  await applySubscriptionEvent(supabase, event, {
    userId,
    customerId: idOf(session.customer),
    subscriptionId: idOf(session.subscription),
    status: isPaid ? "active" : null,
  });
}

async function processEvent(supabase: AdminClient, event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      await handleCheckoutSession(supabase, event, event.data.object);
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      const customerId = idOf(invoice.customer);
      const details = invoice.parent?.subscription_details;
      const userId = await resolveUserId(
        supabase,
        customerId,
        details?.metadata?.supabase_user_id ?? null,
      );

      if (!userId) {
        console.warn(
          `[stripe-webhook] invoice.payment_succeeded (${event.id}) for unresolved customer ${customerId}`,
        );
        break;
      }

      await applySubscriptionEvent(supabase, event, {
        userId,
        customerId,
        subscriptionId: idOf(details?.subscription),
        status: "active",
      });
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = idOf(subscription.customer);
      // Metadata set at checkout lets this work even when it arrives before
      // checkout.session.completed.
      const userId = await resolveUserId(
        supabase,
        customerId,
        subscription.metadata?.supabase_user_id ?? null,
      );

      if (!userId) {
        console.warn(
          `[stripe-webhook] ${event.type} (${event.id}) for unresolved customer ${customerId}`,
        );
        break;
      }

      await applySubscriptionEvent(supabase, event, {
        userId,
        customerId,
        subscriptionId: subscription.id,
        status: subscription.status,
      });
      break;
    }

    default:
      console.log(`[stripe-webhook] unhandled event type ${event.type} (${event.id})`);
      break;
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.warn(`[stripe-webhook] signature verification failed: ${message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[stripe-webhook] received event ${event.type} (${event.id})`);

  const supabase = createAdminClient();

  try {
    const { data: seen, error: seenError } = await supabase
      .from("stripe_events")
      .select("id")
      .eq("id", event.id)
      .maybeSingle();

    if (seenError) throw new WebhookDbError(`event lookup failed: ${seenError.message}`);

    if (seen) {
      console.log(`[stripe-webhook] event ${event.id} already processed, skipping`);
      return NextResponse.json({ received: true, duplicate: true });
    }

    await processEvent(supabase, event);

    // Recorded only after a successful apply, so a failed attempt is
    // retried by Stripe instead of being marked as done.
    const { error: recordError } = await supabase
      .from("stripe_events")
      .upsert({ id: event.id, type: event.type }, { onConflict: "id", ignoreDuplicates: true });

    if (recordError) throw new WebhookDbError(`event record failed: ${recordError.message}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[stripe-webhook] ${event.type} (${event.id}) failed: ${message}`);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
