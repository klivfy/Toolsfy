"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/toast/toast-provider";

export function PortalButton() {
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Falha ao abrir o portal de cobrança");
      }
      window.location.href = data.url;
    } catch {
      showToast("Não foi possível abrir o portal de cobrança. Tente novamente.", "error");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-50"
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />}
      {loading ? "Redirecionando…" : "Gerenciar assinatura"}
    </button>
  );
}
