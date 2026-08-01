import { type ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "premium" | "success" | "error";
}) {
  const toneClasses = {
    neutral:
      "bg-zinc-100 text-zinc-600 dark:bg-neutral-800 dark:text-neutral-300",
    premium:
      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    error: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
