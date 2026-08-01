import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { PortalButton } from "@/components/billing/portal-button";

const PLANS = [
  {
    key: "free",
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    description: "Para começar a explorar o Toolsfy.",
    features: [
      "Acesso às ferramentas web nativas",
      "Até 100 créditos por mês",
      "Suporte por e-mail",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    price: "R$ 49",
    period: "/mês",
    description: "Para quem usa o Toolsfy todos os dias.",
    features: [
      "Créditos ilimitados",
      "Automações avançadas",
      "Suporte prioritário",
      "Acesso antecipado a novas ferramentas",
    ],
  },
];

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PLANS.map((plan) => {
            const isCurrentPlan = (plan.key === "premium") === isPremium;

            return (
              <Card
                key={plan.key}
                className={`flex flex-col p-6 ${
                  plan.key === "premium" ? "ring-1 ring-zinc-950/5" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-zinc-950">
                    {plan.name}
                  </h3>
                  {isCurrentPlan && <Badge tone="success">Seu plano</Badge>}
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {plan.description}
                </p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-semibold text-zinc-950">
                    {plan.price}
                  </span>
                  <span className="text-xs text-zinc-400">{plan.period}</span>
                </div>

                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs text-zinc-600"
                    >
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400"
                        strokeWidth={1.75}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-5">
                  {plan.key === "premium" ? (
                    isPremium ? (
                      subscription?.stripe_customer_id && <PortalButton />
                    ) : (
                      priceId && <CheckoutButton priceId={priceId} />
                    )
                  ) : (
                    !isPremium && (
                      <span className="inline-flex items-center rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-400">
                        Plano atual
                      </span>
                    )
                  )}
                </div>
              </Card>
            );
          })}
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
