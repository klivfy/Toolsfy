import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-neutral-50 px-6 dark:bg-neutral-950">
      <div className="flex max-w-xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Toolsfy</h1>
        <p className="text-lg text-neutral-500">
          One dashboard to manage and subscribe to all your tools.
        </p>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
