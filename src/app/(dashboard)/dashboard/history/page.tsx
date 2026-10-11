import Link from "next/link";
import { History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HistoryList } from "@/components/history/history-list";
import { ClearHistoryButton } from "@/components/history/clear-history-button";
import { type HistoryEntry } from "@/components/history/types";
import {
  resolveToolIcon,
  type MonthlyUsage,
  type ToolUsageRow,
} from "@/lib/tool-usage";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/current-user";

const PAGE_SIZE = 10;

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ limit?: string }>;
}) {
  const { limit: limitParam } = await searchParams;
  const limit = Math.max(PAGE_SIZE, Number(limitParam) || PAGE_SIZE);

  const [supabase, user] = await Promise.all([
    createClient(),
    getCurrentUser(),
  ]);

  // One extra row tells whether there is a next page without a count(*).
  const [{ data: rows }, { data: monthly }] = await Promise.all([
    supabase
      .from("tool_usage")
      .select("id, tool_id, tool_name, credits, status, created_at")
      .eq("user_id", user!.id)
      .is("hidden_at", null)
      .order("created_at", { ascending: false })
      .range(0, limit),
    supabase.rpc("get_monthly_usage").maybeSingle<MonthlyUsage>(),
  ]);

  const usage = ((rows ?? []) as ToolUsageRow[]).slice(0, limit);
  const hasMore = (rows?.length ?? 0) > limit;

  const executions = Number(monthly?.executions ?? 0);
  const successCount = Number(monthly?.successes ?? 0);

  const STATS = [
    {
      label: "Execuções este mês",
      value: String(executions),
    },
    {
      label: "Créditos consumidos",
      value: String(Number(monthly?.credits_used ?? 0)),
    },
    {
      label: "Taxa de sucesso",
      value:
        executions > 0
          ? `${Math.round((successCount / executions) * 100)}%`
          : "—",
    },
  ];

  const entries: HistoryEntry[] = usage.map((row) => ({
    id: row.id,
    toolName: row.tool_name,
    icon: resolveToolIcon(row.tool_id),
    timestamp: row.created_at,
    credits: row.credits,
    status: row.status,
  }));

  const hasEntries = entries.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-950">Histórico</h1>
          <p className="text-sm text-zinc-500">
            Consulte o histórico de uso das suas ferramentas.
          </p>
        </div>
        {hasEntries && <ClearHistoryButton />}
      </div>

      {hasEntries ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS.map((stat) => (
              <Card key={stat.label} className="p-5">
                <p className="text-sm text-zinc-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-950">
                  {stat.value}
                </p>
              </Card>
            ))}
          </div>

          <HistoryList entries={entries} />

          {hasMore && (
            <div className="flex justify-center">
              <Link
                href={`/dashboard/history?limit=${limit + PAGE_SIZE}`}
                className="inline-flex items-center rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900"
              >
                Ver mais
              </Link>
            </div>
          )}
        </>
      ) : (
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50">
            <History className="h-5 w-5 text-zinc-400" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-950">
              Você ainda não usou nenhuma ferramenta
            </p>
            <p className="mt-1 max-w-xs text-xs text-zinc-500">
              Assim que você executar sua primeira ferramenta, o histórico e o
              consumo de créditos aparecerão aqui.
            </p>
          </div>
          <Link
            href="/dashboard/tools"
            className="mt-2 inline-flex items-center rounded-lg bg-zinc-950 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Explorar ferramentas
          </Link>
        </Card>
      )}
    </div>
  );
}
