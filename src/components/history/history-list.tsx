"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ICONS } from "@/components/icons";
import { formatRelativeTime } from "@/lib/format-time";
import { type HistoryEntry, type HistoryStatus } from "./types";

const FILTERS: { key: HistoryStatus | "all"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "success", label: "Concluídas" },
  { key: "error", label: "Com erro" },
];

export function HistoryList({ entries }: { entries: HistoryEntry[] }) {
  const [activeFilter, setActiveFilter] = useState<HistoryStatus | "all">(
    "all",
  );

  const filteredEntries =
    activeFilter === "all"
      ? entries
      : entries.filter((entry) => entry.status === activeFilter);

  return (
    <div className="space-y-5">
      <div className="-mx-1 flex flex-wrap gap-2 overflow-x-auto px-1 pb-1">
        {FILTERS.map((filter) => {
          const isActive = filter.key === activeFilter;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-zinc-950 text-white"
                  : "border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <Card>
        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            Nenhum registro encontrado para este filtro.
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {filteredEntries.map((entry) => {
              const Icon = ICONS[entry.icon];
              return (
                <li key={entry.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-50">
                    <Icon
                      className="h-4 w-4 text-zinc-700"
                      strokeWidth={1.75}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-950">
                      {entry.toolName}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {formatRelativeTime(entry.timestamp)}
                    </p>
                  </div>

                  <span className="hidden text-xs text-zinc-500 sm:block">
                    {entry.credits} créditos
                  </span>

                  <Badge tone={entry.status === "success" ? "success" : "error"}>
                    {entry.status === "success" ? "Concluída" : "Erro"}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
