import Link from "next/link";
import { ICONS } from "./icons";
import { type AppItem } from "./types";

export function HeroBanner({ app }: { app: AppItem }) {
  const Icon = ICONS[app.icon];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex items-center justify-center bg-zinc-50 p-10 md:p-14">
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-zinc-200 bg-white">
            <Icon className="h-12 w-12 text-zinc-900" strokeWidth={1.5} />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-zinc-950 px-2.5 py-0.5 text-xs font-medium text-white">
              Destaque
            </span>
            <span className="inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
              Direto no navegador
            </span>
            <span className="inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
              Sem instalação
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-zinc-950">
              {app.name}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
              {app.description}
            </p>
          </div>

          <Link
            href={app.href}
            className="inline-flex w-fit items-center rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Usar Agora
          </Link>
        </div>
      </div>
    </div>
  );
}
