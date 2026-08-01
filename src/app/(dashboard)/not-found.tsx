import Link from "next/link";
import { Compass } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50">
        <Compass className="h-5 w-5 text-zinc-400" strokeWidth={1.75} />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">
          Página não encontrada
        </h1>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">
          O conteúdo que você está procurando não existe ou foi movido.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="mt-2 inline-flex items-center rounded-lg bg-zinc-950 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
