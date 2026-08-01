import { ICONS } from "./icons";
import { type StoreLink } from "./types";

export function StoreLinks({ stores }: { stores: StoreLink[] }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-zinc-500">Onde nos encontrar</h2>
      <p className="mt-1 text-xs text-zinc-400">
        Toolsfy também está disponível nas principais lojas oficiais.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => {
          const Icon = ICONS[store.icon];
          return (
            <a
              key={store.name}
              href={store.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
                <Icon className="h-5 w-5 text-zinc-700" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-950">
                  {store.name}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {store.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
