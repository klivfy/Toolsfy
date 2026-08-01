import { Check, Minus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { PortalButton } from "@/components/billing/portal-button";

const PLAN_HEADERS = {
  free: { name: "Free", price: "R$ 0", period: "/mês" },
  premium: { name: "Premium", price: "R$ 49", period: "/mês" },
} as const;

const FEATURES: {
  label: string;
  free: boolean | string;
  premium: boolean | string;
}[] = [
  { label: "Ferramentas web nativas", free: true, premium: true },
  { label: "Créditos mensais", free: "100", premium: "Ilimitados" },
  { label: "Automações avançadas", free: false, premium: true },
  { label: "Suporte", free: "E-mail", premium: "Prioritário" },
  { label: "Acesso antecipado a novas ferramentas", free: false, premium: true },
];

function FeatureCell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <Check
        className="mx-auto h-4 w-4 text-emerald-600"
        strokeWidth={1.75}
      />
    );
  }
  if (value === false) {
    return <Minus className="mx-auto h-4 w-4 text-zinc-300" strokeWidth={1.75} />;
  }
  return <span className="text-xs font-medium text-zinc-950">{value}</span>;
}

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

  const isPremium = subscription?.status === "active";
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? "";

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

      <section>
        <h2 className="mb-4 text-sm font-medium text-zinc-500">
          Planos disponíveis
        </h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-1/3 border-b border-zinc-200 p-4 text-left align-bottom text-xs font-medium text-zinc-400">
                  Recursos
                </th>
                {(["free", "premium"] as const).map((key) => {
                  const header = PLAN_HEADERS[key];
                  const isCurrentPlan = (key === "premium") === isPremium;
                  return (
                    <th
                      key={key}
                      className="border-b border-l border-zinc-200 p-4 text-left align-bottom"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-950">
                          {header.name}
                        </span>
                        {isCurrentPlan && (
                          <Badge tone="success">Seu plano</Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-xl font-semibold text-zinc-950">
                          {header.price}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {header.period}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature) => (
                <tr key={feature.label}>
                  <td className="border-b border-zinc-200 p-4 text-xs text-zinc-600">
                    {feature.label}
                  </td>
                  <td className="border-b border-l border-zinc-200 p-4 text-center">
                    <FeatureCell value={feature.free} />
                  </td>
                  <td className="border-b border-l border-zinc-200 p-4 text-center">
                    <FeatureCell value={feature.premium} />
                  </td>
                </tr>
              ))}
              <tr>
                <td className="p-4" />
                <td className="border-l border-zinc-200 p-4 text-center">
                  {!isPremium ? (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-400 opacity-60"
                    >
                      Plano atual
                    </button>
                  ) : (
                    subscription?.stripe_customer_id && <PortalButton />
                  )}
                </td>
                <td className="border-l border-zinc-200 p-4 text-center">
                  {isPremium ? (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-400 opacity-60"
                    >
                      Plano atual
                    </button>
                  ) : (
                    priceId && <CheckoutButton priceId={priceId} />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Card className="p-6">
        <h2 className="text-sm font-medium text-zinc-500">Faturas</h2>
        <div className="mt-4 rounded-xl border border-dashed border-zinc-300 p-8 text-center text-xs text-zinc-500">
          Nenhuma fatura emitida ainda.
        </div>
      </Card>
    </div>
  );
}
