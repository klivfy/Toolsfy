export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Tools</h1>
        <p className="text-sm text-neutral-500">
          Manage the tools connected to your account.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
        No tools yet.
      </div>
    </div>
  );
}
