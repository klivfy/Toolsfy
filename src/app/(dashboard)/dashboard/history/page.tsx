import { Card } from "@/components/ui/card";
import { HistoryList } from "@/components/history/history-list";
import { type HistoryEntry } from "@/components/history/types";

const ENTRIES: HistoryEntry[] = [
  {
    id: "1",
    toolName: "Gerador de Documentos",
    icon: "file-text",
    timestamp: "Hoje, 09:12",
    credits: 12,
    status: "success",
  },
  {
    id: "2",
    toolName: "Editor de Imagens",
    icon: "image",
    timestamp: "Ontem, 17:40",
    credits: 8,
    status: "success",
  },
  {
    id: "3",
    toolName: "Assistente de Texto",
    icon: "message-square",
    timestamp: "Ontem, 11:05",
    credits: 5,
    status: "success",
  },
  {
    id: "4",
    toolName: "Automações",
    icon: "sparkles",
    timestamp: "Ontem, 08:47",
    credits: 20,
    status: "error",
  },
  {
    id: "5",
    toolName: "Gerador de Documentos",
    icon: "file-text",
    timestamp: "Segunda-feira, 16:22",
    credits: 12,
    status: "success",
  },
  {
    id: "6",
    toolName: "Editor de Imagens",
    icon: "image",
    timestamp: "Segunda-feira, 10:03",
    credits: 8,
    status: "error",
  },
  {
    id: "7",
    toolName: "Assistente de Texto",
    icon: "message-square",
    timestamp: "Domingo, 19:58",
    credits: 5,
    status: "success",
  },
];

const STATS = [
  {
    label: "Execuções este mês",
    value: String(ENTRIES.length),
  },
  {
    label: "Créditos consumidos",
    value: String(ENTRIES.reduce((total, entry) => total + entry.credits, 0)),
  },
  {
    label: "Taxa de sucesso",
    value: `${Math.round(
      (ENTRIES.filter((entry) => entry.status === "success").length /
        ENTRIES.length) *
        100,
    )}%`,
  },
];

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">Histórico</h1>
        <p className="text-sm text-zinc-500">
          Consulte o histórico de uso das suas ferramentas.
        </p>
      </div>

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

      <HistoryList entries={ENTRIES} />
    </div>
  );
}
