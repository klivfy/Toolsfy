import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ICONS } from "@/components/icons";
import { APPS } from "@/components/showcase/data";
import { CompatibilityDots } from "@/components/showcase/compatibility-dots";
import { CopyLinkButton } from "@/components/showcase/copy-link-button";

export function generateStaticParams() {
  return APPS.filter((app) => app.native).map((app) => ({ id: app.id }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = APPS.find((item) => item.id === id && item.native);

  if (!app) {
    notFound();
  }

  const Icon = ICONS[app.icon];

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/tools"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Voltar à Vitrine
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white">
            <Icon className="h-6 w-6 text-zinc-900" strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-zinc-950">
                {app.name}
              </h1>
              <Badge>Nativo</Badge>
            </div>
            <p className="mt-1 max-w-lg text-sm text-zinc-500">
              {app.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CompatibilityDots items={app.compatibility} />
          <CopyLinkButton />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-8 lg:col-span-2">
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-200 text-center">
            <Icon className="h-8 w-8 text-zinc-300" strokeWidth={1.5} />
            <p className="text-sm font-medium text-zinc-950">
              A interface de {app.name} carrega aqui
            </p>
            <p className="max-w-xs text-xs text-zinc-500">
              Esta área concentra o conteúdo funcional da ferramenta,
              priorizando a experiência nativa da plataforma Toolsfy.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-medium text-zinc-500">Sobre</h2>
          <dl className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Categoria</dt>
              <dd className="font-medium text-zinc-950">Aplicação Web</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Execução</dt>
              <dd className="font-medium text-zinc-950">Direto no navegador</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Instalação</dt>
              <dd className="font-medium text-zinc-950">Não requerida</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
