import { HeroBanner } from "@/components/showcase/hero-banner";
import { AppGrid } from "@/components/showcase/app-grid";
import { StoreLinks } from "@/components/showcase/store-links";
import { type AppItem, type StoreLink } from "@/components/showcase/types";

const APPS: AppItem[] = [
  {
    id: "gerador-documentos",
    name: "Gerador de Documentos",
    description: "Crie contratos e relatórios automaticamente, direto no navegador.",
    icon: "file-text",
    category: "web",
    native: true,
    compatibility: ["web"],
    href: "#",
  },
  {
    id: "editor-imagens",
    name: "Editor de Imagens",
    description: "Edite e otimize imagens com um clique, sem instalar nada.",
    icon: "image",
    category: "web",
    native: true,
    compatibility: ["web"],
    href: "#",
  },
  {
    id: "assistente-texto",
    name: "Assistente de Texto",
    description: "Revise e melhore textos com IA em tempo real.",
    icon: "message-square",
    category: "web",
    native: true,
    compatibility: ["web"],
    href: "#",
  },
  {
    id: "automacoes",
    name: "Automações",
    description: "Configure fluxos automáticos de trabalho na nuvem.",
    icon: "sparkles",
    category: "web",
    native: true,
    compatibility: ["web"],
    href: "#",
  },
  {
    id: "toolsfy-navegadores",
    name: "Toolsfy para Navegadores",
    description: "Acesse ferramentas rápidas direto da barra do navegador.",
    icon: "puzzle",
    category: "extension",
    native: false,
    compatibility: ["chrome", "edge", "firefox"],
    href: "#",
  },
  {
    id: "toolsfy-mobile",
    name: "Toolsfy Mobile",
    description: "Leve suas ferramentas favoritas para o Android.",
    icon: "smartphone",
    category: "mobile-desktop",
    native: false,
    compatibility: ["android"],
    href: "#",
  },
  {
    id: "toolsfy-desktop",
    name: "Toolsfy Desktop",
    description: "Aplicativo nativo para Windows com uso offline.",
    icon: "monitor",
    category: "mobile-desktop",
    native: false,
    compatibility: ["windows"],
    href: "#",
  },
];

const STORES: StoreLink[] = [
  {
    name: "Microsoft Store",
    description: "Baixe o Toolsfy Desktop para Windows",
    icon: "store",
    href: "#",
  },
  {
    name: "Google Play",
    description: "Disponível para dispositivos Android",
    icon: "play",
    href: "#",
  },
  {
    name: "Chrome Web Store",
    description: "Extensão oficial para o Google Chrome",
    icon: "puzzle",
    href: "#",
  },
  {
    name: "Firefox Add-ons",
    description: "Extensão oficial para o Mozilla Firefox",
    icon: "flame",
    href: "#",
  },
  {
    name: "Microsoft Edge Add-ons",
    description: "Extensão oficial para o Microsoft Edge",
    icon: "compass",
    href: "#",
  },
];

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
