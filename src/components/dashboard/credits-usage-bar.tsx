"use client";

import { useEffect, useState } from "react";

export function CreditsUsageBar({ percent }: { percent: number }) {
  const [width, setWidth] = useState(0);
  const clamped = Math.min(100, Math.max(0, percent));
  const isWarning = clamped >= 90;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setWidth(clamped));
    return () => cancelAnimationFrame(frame);
  }, [clamped]);

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-neutral-800">
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${
          isWarning ? "bg-amber-500" : "bg-zinc-900 dark:bg-white"
        }`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
