"use client";

import { Link2 } from "lucide-react";
import { useToast } from "@/components/toast/toast-provider";

export function CopyLinkButton() {
  const showToast = useToast();

  async function handleClick() {
    await navigator.clipboard.writeText(window.location.href);
    showToast("Link copiado");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
    >
      <Link2 className="h-3.5 w-3.5" strokeWidth={1.75} />
      Copiar link
    </button>
  );
}
