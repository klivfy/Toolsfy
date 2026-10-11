"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/toast/toast-provider";
import { clearHistory } from "@/lib/supabase/history-actions";

export function ClearHistoryButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const showToast = useToast();

  function handleClick() {
    const confirmed = window.confirm(
      "Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.",
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await clearHistory();
      if (!result.ok) {
        showToast("Não foi possível limpar o histórico", "error");
        return;
      }
      showToast("Histórico limpo");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-red-200 hover:text-red-600 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
    >
      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
      {isPending ? "Limpando…" : "Limpar Histórico"}
    </button>
  );
}
