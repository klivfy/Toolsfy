export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="space-y-2">
        <div className="h-5 w-64 rounded bg-zinc-100 dark:bg-neutral-800" />
        <div className="h-3 w-40 rounded bg-zinc-100 dark:bg-neutral-800" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl border border-zinc-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-40 rounded-xl border border-zinc-200 bg-white dark:border-neutral-800 dark:bg-neutral-900" />
        <div className="h-40 rounded-xl border border-zinc-200 bg-white dark:border-neutral-800 dark:bg-neutral-900" />
      </div>
    </div>
  );
}
