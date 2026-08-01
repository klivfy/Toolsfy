import { HeroBanner } from "@/components/showcase/hero-banner";
import { AppGrid } from "@/components/showcase/app-grid";
import { StoreLinks } from "@/components/showcase/store-links";
import { APPS, STORES } from "@/components/showcase/data";

export default function ToolsPage() {
  const featuredApp = APPS[0];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">
          Vitrine de Aplicações
        </h1>
        <p className="text-sm text-zinc-500">
          Centralize suas ferramentas Toolsfy e descubra onde mais estamos
          presentes.
        </p>
      </div>

      <HeroBanner app={featuredApp} />
      <AppGrid apps={APPS} />
      <StoreLinks stores={STORES} />
    </div>
  );
}
