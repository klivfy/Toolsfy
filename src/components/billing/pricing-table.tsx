"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { PortalButton } from "@/components/billing/portal-button";

type BillingInterval = "monthly" | "annual";

const PREMIUM_PRICE: Record<BillingInterval, { price: string; period: string }> = {
  monthly: { price: "R$ 49", period: "/mês" },
  annual: { price: "R$ 470", period: "/ano" },
};

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
      <Check className="mx-auto h-4 w-4 text-emerald-600" strokeWidth={1.75} />
    );
  }
  if (value === false) {
    return <Minus className="mx-auto h-4 w-4 text-zinc-300" strokeWidth={1.75} />;
  }
  return <span className="text-xs font-medium text-zinc-950">{value}</span>;
}

export function PricingTable({
  isPremium,
  hasStripeCustomer,
  monthlyPriceId,
  annualPriceId,
}: {
  isPremium: boolean;
  hasStripeCustomer: boolean;
  monthlyPriceId: string;
  annualPriceId: string;
}) {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const premium = PREMIUM_PRICE[interval];
  const priceId = interval === "monthly" ? monthlyPriceId : annualPriceId;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-500">
          Planos disponíveis
        </h2>
        <div className="inline-flex items-center rounded-full border border-zinc-200 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setInterval("monthly")}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              interval === "monthly"
                ? "bg-zinc-950 text-white"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Mensal
          </button>
          <button
            type="button"
            onClick={() => setInterval("annual")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
              interval === "annual"
                ? "bg-zinc-950 text-white"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Anual
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                interval === "annual"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              2 meses grátis
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-1/3 border-b border-zinc-200 p-4 text-left align-bottom text-xs font-medium text-zinc-400">
                Recursos
              </th>
              <th className="border-b border-l border-zinc-200 p-4 text-left align-bottom">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-zinc-950">Free</span>
                  {!isPremium && <Badge tone="success">Seu plano</Badge>}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-semibold text-zinc-950">
                    R$ 0
                  </span>
                  <span className="text-xs text-zinc-400">/mês</span>
                </div>
              </th>
              <th className="border-b border-l border-zinc-200 p-4 text-left align-bottom">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-zinc-950">
                    Premium
                  </span>
                  {isPremium && <Badge tone="success">Seu plano</Badge>}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-semibold text-zinc-950">
                    {premium.price}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {premium.period}
                  </span>
                </div>
              </th>
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
                  hasStripeCustomer && <PortalButton />
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
    </div>
  );
}
