export default function ToolsLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-48 rounded-xl border border-zinc-200 bg-white dark:border-neutral-800 dark:bg-neutral-900" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-7 w-24 rounded-full bg-zinc-100 dark:bg-neutral-800" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-xl border border-zinc-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
          />
        ))}
      </div>
    </div>
  );
}
