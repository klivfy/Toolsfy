import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getGreeting } from "@/lib/user-display";
import { formatRelativeTime } from "@/lib/format-time";
import {
  resolveToolIcon,
  getCreditsLimit,
  type MonthlyUsage,
  type ToolUsageRow,
} from "@/lib/tool-usage";
import { CreditsUsageBar } from "@/components/dashboard/credits-usage-bar";
import { TopToolsChart } from "@/components/dashboard/top-tools-chart";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ICONS } from "@/components/icons";
import {
  FileText,
  ImageIcon,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const QUICK_TOOLS = [
  {
    icon: FileText,
    title: "Gerador de Documentos",
    description: "Crie contratos e relatórios automaticamente.",
  },
  {
    icon: ImageIcon,
    title: "Editor de Imagens",
    description: "Edite e otimize imagens com um clique.",
  },
  {
    icon: MessageSquare,
    title: "Assistente de Texto",
    description: "Revise e melhore textos com IA.",
  },
  {
    icon: Sparkles,
    title: "Automações",
    description: "Configure fluxos automáticos de trabalho.",
  },
];

export default async function DashboardPage() {
  const [supabase, user] = await Promise.all([
    createClient(),
    getCurrentUser(),
  ]);

  // Independent queries run in parallel; sums and rankings are computed in
  // the database (see 0006_tool_usage_aggregates.sql).
  const [
    { data: subscription },
    { data: recentUsage },
    { data: monthlyUsage },
    { data: topTools },
  ] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user!.id)
      .maybeSingle(),
    supabase
      .from("tool_usage")
      .select("id, tool_id, tool_name, credits, status, created_at")
      .eq("user_id", user!.id)
      .is("hidden_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.rpc("get_monthly_usage").maybeSingle<MonthlyUsage>(),
    supabase.rpc("get_top_tools", { p_days: 30, p_limit: 8 }),
  ]);

  const isPremium = subscription?.status === "active";
  const creditsLimit = getCreditsLimit(isPremium);

  const recentHistory = (recentUsage ?? []) as ToolUsageRow[];

  const creditsUsed = Number(monthlyUsage?.credits_used ?? 0);

  const topToolsData = (
    (topTools ?? []) as { tool_name: string; uses: number }[]
  ).map((row) => ({
    name: row.tool_name,
    count: Number(row.uses),
  }));

  const displayName = user?.email?.split("@")[0] ?? "Usuário";
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const usagePercent = Math.round((creditsUsed / creditsLimit) * 100);
  const greeting = getGreeting();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-950 dark:text-white">
            {greeting}, {displayName}. Bem-vindo ao Toolsfy.
          </h1>
          <p className="mt-1 text-sm capitalize text-zinc-500 dark:text-neutral-400">
            {today}
          </p>
        </div>
        <Badge tone={isPremium ? "premium" : "neutral"}>
          {isPremium ? "Premium" : "Free"}
        </Badge>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-medium text-zinc-500 dark:text-neutral-400">
          Ferramentas rápidas
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.title} className="p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 dark:bg-neutral-800">
                  <Icon
                    className="h-4 w-4 text-zinc-700 dark:text-neutral-300"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="mt-4 text-sm font-medium text-zinc-950 dark:text-white">
                  {tool.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-neutral-400">
                  {tool.description}
                </p>
                <button className="mt-4 flex items-center gap-1 rounded-lg text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-neutral-400 dark:hover:text-white">
                  Abrir
                  <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                </button>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-neutral-400">
            Histórico recente
          </h2>
          {recentHistory.length > 0 ? (
            <ul className="mt-4 divide-y divide-zinc-100 dark:divide-neutral-800">
              {recentHistory.map((item) => {
                const Icon = ICONS[resolveToolIcon(item.tool_id)];
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 py-3 text-sm first:pt-0 last:pb-0"
                  >
                    <Icon
                      className="h-4 w-4 shrink-0 text-zinc-400 dark:text-neutral-500"
                      strokeWidth={1.75}
                    />
                    <span className="flex-1 truncate text-zinc-700 dark:text-neutral-300">
                      {item.tool_name}
                    </span>
                    <span className="shrink-0 text-xs text-zinc-400 dark:text-neutral-500">
                      {formatRelativeTime(item.created_at)}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-2 py-8 text-center">
              <p className="text-xs text-zinc-500 dark:text-neutral-400">
                Nenhuma ferramenta utilizada ainda.
              </p>
              <Link
                href="/dashboard/tools"
                className="text-xs font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-white"
              >
                Explorar ferramentas
              </Link>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-neutral-400">
            Uso de créditos
          </h2>
          {creditsUsed > 0 ? (
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold text-zinc-950 dark:text-white">
                  {creditsUsed}
                </span>
                <span className="text-xs text-zinc-400 dark:text-neutral-500">
                  de {creditsLimit} créditos
                </span>
              </div>
              <div className="mt-3">
                <CreditsUsageBar percent={usagePercent} />
              </div>
              <p
                className={`mt-2 text-xs ${
                  usagePercent >= 90
                    ? "font-medium text-amber-600"
                    : "text-zinc-400 dark:text-neutral-500"
                }`}
              >
                {usagePercent}% do limite mensal utilizado
              </p>
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-2 py-8 text-center">
              <p className="text-xs text-zinc-500 dark:text-neutral-400">
                Nenhum crédito consumido ainda.
              </p>
            </div>
          )}
        </Card>
      </section>

      <Card className="p-5">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-neutral-400">
          Ferramentas mais usadas (30 dias)
        </h2>
        {topToolsData.length > 0 ? (
          <div className="mt-4">
            <TopToolsChart data={topToolsData} />
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-xs text-zinc-500 dark:text-neutral-400">
              Sem execuções nos últimos 30 dias para exibir no gráfico.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
