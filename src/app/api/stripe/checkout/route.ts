import { NextResponse } from "next/server";
import { getAllowedPriceIds, getSiteUrl, getStripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let priceId: unknown;
  try {
    ({ priceId } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (typeof priceId !== "string" || !getAllowedPriceIds().has(priceId)) {
    return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
  }

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("status, stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (subscriptionError) {
    console.error(
      `[stripe-checkout] subscription lookup failed for user ${user.id}: ${subscriptionError.message}`,
    );
    return NextResponse.json({ error: "Checkout unavailable" }, { status: 500 });
  }

  if (subscription?.status === "active") {
    return NextResponse.json(
      { error: "Você já tem uma assinatura ativa" },
      { status: 409 },
    );
  }

  try {
    const siteUrl = getSiteUrl();
    // Same user, price and minute → same Checkout Session, so a double
    // submit or two tabs cannot create two subscriptions.
    const minuteBucket = Math.floor(Date.now() / 60_000);

    const session = await getStripe().checkout.sessions.create(
      {
        mode: "subscription",
        ...(subscription?.stripe_customer_id
          ? { customer: subscription.stripe_customer_id }
          : { customer_email: user.email }),
        client_reference_id: user.id,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${siteUrl}/dashboard/billing/success`,
        cancel_url: `${siteUrl}/dashboard/billing?checkout=cancelled`,
        metadata: { supabase_user_id: user.id },
        subscription_data: { metadata: { supabase_user_id: user.id } },
      },
      { idempotencyKey: `checkout:${user.id}:${priceId}:${minuteBucket}` },
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[stripe-checkout] session create failed for user ${user.id}: ${message}`);
    return NextResponse.json({ error: "Checkout unavailable" }, { status: 502 });
  }
}
