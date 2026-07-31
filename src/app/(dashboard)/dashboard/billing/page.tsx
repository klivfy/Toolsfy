import { createClient } from "@/lib/supabase/server";
import { CheckoutButton } from "@/components/checkout-button";

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, stripe_customer_id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Billing</h1>
        <p className="text-sm text-neutral-500">
          Manage your subscription and payment details.
        </p>
      </div>

      <div className="max-w-md space-y-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <p className="text-sm text-neutral-500">Current plan</p>
          <p className="mt-1 text-sm font-medium">
            {subscription?.status === "active" ? "Pro" : "Free"}
          </p>
        </div>
        {priceId && <CheckoutButton priceId={priceId} />}
      </div>
    </div>
  );
}
