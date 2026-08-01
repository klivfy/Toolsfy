import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function resolveUserId(
  supabase: ReturnType<typeof createAdminClient>,
  customerId: string,
  subscriptionMetadataUserId?: string | null,
) {
  if (subscriptionMetadataUserId) return subscriptionMetadataUserId;

  const { data } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  return data?.user_id ?? null;
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
    return NextResponse.json({ error: `Invalid signature: ${message}` }, { status: 400 });
  }

  console.log(`[stripe-webhook] received event ${event.type} (${event.id})`);

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id ?? session.client_reference_id;

      if (userId) {
        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: "active",
        });
        console.log(`[stripe-webhook] checkout completed for user ${userId}`);
      } else {
        console.warn("[stripe-webhook] checkout.session.completed without a resolvable user_id");
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const subscriptionId =
        typeof invoice.parent?.subscription_details?.subscription === "string"
          ? invoice.parent.subscription_details.subscription
          : (invoice.parent?.subscription_details?.subscription?.id ?? null);
      const subscriptionMetadataUserId =
        invoice.parent?.subscription_details?.metadata?.supabase_user_id ?? null;

      const userId = await resolveUserId(supabase, customerId, subscriptionMetadataUserId);

      if (userId) {
        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: customerId,
          ...(subscriptionId ? { stripe_subscription_id: subscriptionId } : {}),
          status: "active",
        });
        console.log(`[stripe-webhook] payment succeeded, plan set to premium for user ${userId}`);
      } else {
        console.warn(`[stripe-webhook] invoice.payment_succeeded for unresolved customer ${customerId}`);
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from("subscriptions")
        .update({ status: subscription.status })
        .eq("stripe_subscription_id", subscription.id);
      console.log(
        `[stripe-webhook] subscription ${subscription.id} status set to ${subscription.status}`,
      );
      break;
    }

    default:
      console.log(`[stripe-webhook] unhandled event type ${event.type}`);
      break;
  }

  return NextResponse.json({ received: true });
}
