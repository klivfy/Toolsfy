"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, ExternalLink, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ICONS } from "@/components/icons";
import { useToast } from "@/components/toast/toast-provider";
import { type AppCategory, type AppItem } from "./types";
import { CompatibilityDots } from "./compatibility-dots";

const CATEGORIES: { key: AppCategory | "all"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "web", label: "Aplicações Web" },
  { key: "extension", label: "Extensões" },
  { key: "mobile-desktop", label: "Mobile & Desktop" },
];

export function AppGrid({
  apps,
  isPremium = false,
}: {
  apps: AppItem[];
  isPremium?: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState<AppCategory | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const router = useRouter();
  const showToast = useToast();

  const normalizedQuery = searchQuery.trim().toLowerCase();

  async function handleAccess(app: AppItem) {
    setPendingId(app.id);
    try {
      const res = await fetch(`/api/tools/${app.id}/execute`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error ?? "Não foi possível acessar a ferramenta", "error");
        return;
      }

      router.push(app.href);
    } catch {
      showToast("Falha de conexão ao acessar a ferramenta", "error");
    } finally {
      setPendingId(null);
    }
  }

  const filteredApps = apps
    .filter((app) => activeCategory === "all" || app.category === activeCategory)
    .filter((app) => app.name.toLowerCase().includes(normalizedQuery));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-1 flex flex-wrap gap-2 overflow-x-auto px-1">
          {CATEGORIES.map((category) => {
            const isActive = category.key === activeCategory;
            return (
              <button
                key={category.key}
                type="button"
                onClick={() => setActiveCategory(category.key)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-950 text-white"
                    : "border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-56">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
            strokeWidth={1.75}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Buscar ferramentas..."
            aria-label="Buscar ferramentas nativas por nome"
            className="w-full rounded-lg border border-zinc-200 py-1.5 pl-8 pr-3 text-xs text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-400"
          />
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="flex flex-col items-center gap-1 py-16 text-center">
          <p className="text-sm font-medium text-zinc-950">
            Nenhuma ferramenta encontrada
          </p>
          <p className="max-w-xs text-xs text-zinc-500">
            {normalizedQuery
              ? `Não encontramos resultados para "${searchQuery.trim()}".`
              : "Não há ferramentas nesta categoria no momento."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => {
            const Icon = ICONS[app.icon];
            return (
              <Card
                key={app.id}
                className={`flex flex-col p-5 ${
                  app.native ? "ring-1 ring-zinc-950/5" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-50">
                    <Icon
                      className="h-5 w-5 text-zinc-700"
                      strokeWidth={1.75}
                    />
                  </div>
                  {app.native && (
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                      Nativo
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-sm font-bold text-zinc-950">
                  {app.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {app.description}
                </p>

                <div className="mt-4">
                  <CompatibilityDots items={app.compatibility} />
                </div>

                <div className="mt-5">
                  {app.premiumOnly && !isPremium ? (
                    <Link
                      href="/dashboard/billing"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-600"
                    >
                      <Lock className="h-3 w-3" strokeWidth={1.75} />
                      Exclusivo Premium
                    </Link>
                  ) : app.native ? (
                    <button
                      type="button"
                      onClick={() => handleAccess(app)}
                      disabled={pendingId === app.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-950 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                    >
                      {pendingId === app.id && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                      )}
                      {pendingId === app.id ? "Processando..." : "Acessar"}
                    </button>
                  ) : (
                    <a
                      href={app.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                    >
                      Abrir
                      <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
