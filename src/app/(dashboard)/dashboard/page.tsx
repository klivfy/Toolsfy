import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const RECENT_HISTORY = [
  { tool: "Gerador de Documentos", date: "Hoje, 09:12" },
  { tool: "Editor de Imagens", date: "Ontem, 17:40" },
  { tool: "Assistente de Texto", date: "Ontem, 11:05" },
];

const CREDITS_USED = 320;
const CREDITS_LIMIT = 1000;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user!.id)
    .maybeSingle();

  const isPremium = subscription?.status === "active";
  const displayName = user?.email?.split("@")[0] ?? "Usuário";
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const usagePercent = Math.round((CREDITS_USED / CREDITS_LIMIT) * 100);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-950 dark:text-white">
            Olá, {displayName}. Bem-vindo ao Toolsfy.
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
                <button className="mt-4 flex items-center gap-1 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-neutral-400 dark:hover:text-white">
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
          {RECENT_HISTORY.length > 0 ? (
            <ul className="mt-4 divide-y divide-zinc-100 dark:divide-neutral-800">
              {RECENT_HISTORY.map((item) => (
                <li
                  key={`${item.tool}-${item.date}`}
                  className="flex items-center justify-between py-3 text-sm first:pt-0 last:pb-0"
                >
                  <span className="text-zinc-700 dark:text-neutral-300">
                    {item.tool}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-neutral-500">
                    {item.date}
                  </span>
                </li>
              ))}
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
          {CREDITS_USED > 0 ? (
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold text-zinc-950 dark:text-white">
                  {CREDITS_USED}
                </span>
                <span className="text-xs text-zinc-400 dark:text-neutral-500">
                  de {CREDITS_LIMIT} créditos
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-zinc-900 dark:bg-white"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-zinc-400 dark:text-neutral-500">
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
    </div>
  );
}
