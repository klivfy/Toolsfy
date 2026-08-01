"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ICONS } from "./icons";
import { type AppCategory, type AppItem, type Compatibility } from "./types";

const CATEGORIES: { key: AppCategory | "all"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "web", label: "Aplicações Web" },
  { key: "extension", label: "Extensões" },
  { key: "mobile-desktop", label: "Mobile & Desktop" },
];

const COMPAT_LABEL: Record<Compatibility, string> = {
  web: "Web",
  chrome: "Chrome",
  edge: "Edge",
  firefox: "Firefox",
  android: "Android",
  windows: "Windows",
};

function CompatibilityDots({ items }: { items: Compatibility[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          title={COMPAT_LABEL[item]}
          className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-200 text-[9px] font-medium uppercase text-zinc-500"
        >
          {item === "web" ? (
            <Globe className="h-3 w-3" strokeWidth={1.75} />
          ) : (
            COMPAT_LABEL[item][0]
          )}
        </span>
      ))}
    </div>
  );
}

export function AppGrid({ apps }: { apps: AppItem[] }) {
  const [activeCategory, setActiveCategory] = useState<AppCategory | "all">(
    "all",
  );

  const filteredApps =
    activeCategory === "all"
      ? apps
      : apps.filter((app) => app.category === activeCategory);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-5">
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
                {app.native ? (
                  <Link
                    href={app.href}
                    className="inline-flex items-center rounded-lg bg-zinc-950 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
                  >
                    Acessar
                  </Link>
                ) : (
                  <a
                    href={app.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900"
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
    </div>
  );
}
