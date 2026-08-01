export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Histórico
        </h1>
        <p className="text-sm text-zinc-500 dark:text-neutral-400">
          Consulte o histórico de uso das suas ferramentas.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500 dark:border-neutral-700 dark:bg-neutral-900">
        Nenhum registro ainda.
      </div>
    </div>
  );
}
