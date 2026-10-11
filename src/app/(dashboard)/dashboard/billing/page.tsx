import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { PortalButton } from "@/components/billing/portal-button";
import { PricingTable } from "@/components/billing/pricing-table";

export default async function BillingPage() {
  const [supabase, user] = await Promise.all([
    createClient(),
    getCurrentUser(),
  ]);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, stripe_customer_id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const isPremium = subscription?.status === "active";
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? "";
  const annualPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL ?? "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">Assinatura</h1>
        <p className="text-sm text-zinc-500">
          Gerencie seu plano e forma de pagamento.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Plano atual
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-lg font-semibold text-zinc-950">
                {isPremium ? "Premium" : "Free"}
              </span>
              <Badge tone={isPremium ? "premium" : "neutral"}>
                {isPremium ? "Ativo" : "Gratuito"}
              </Badge>
            </div>
          </div>

          {isPremium
            ? subscription?.stripe_customer_id && <PortalButton />
            : priceId && <CheckoutButton priceId={priceId} />}
        </div>
      </Card>

      <PricingTable
        isPremium={isPremium}
        hasStripeCustomer={Boolean(subscription?.stripe_customer_id)}
        monthlyPriceId={priceId}
        annualPriceId={annualPriceId}
      />

      <Card className="p-6">
        <h2 className="text-sm font-medium text-zinc-500">Faturas</h2>
        <div className="mt-4 rounded-xl border border-dashed border-zinc-300 p-8 text-center text-xs text-zinc-500">
          Nenhuma fatura emitida ainda.
        </div>
      </Card>
    </div>
  );
}
