import { type ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "premium" | "success";
}) {
  const toneClasses = {
    neutral:
      "bg-zinc-100 text-zinc-600 dark:bg-neutral-800 dark:text-neutral-300",
    premium:
      "bg-zinc-900 text-white dark:bg-white dark:text-neutral-900",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
