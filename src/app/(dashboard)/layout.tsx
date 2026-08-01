import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";
import { Footer } from "@/components/footer";
import Link from "next/link";
import {
  LayoutGrid,
  Wrench,
  History,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Início", icon: LayoutGrid },
  { href: "/dashboard/tools", label: "Ferramentas", icon: Wrench },
  { href: "/dashboard/history", label: "Histórico", icon: History },
  { href: "/dashboard/billing", label: "Assinatura", icon: CreditCard },
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards this route group; this is a defense-in-depth
  // check for direct server-side renders.
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-neutral-950">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 sm:flex">
        <div className="flex h-16 items-center border-b border-zinc-100 px-6 dark:border-neutral-800">
          <span className="text-base font-semibold tracking-tight text-zinc-950 dark:text-white">
            Toolsfy
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-100 p-4 dark:border-neutral-800">
          <div className="mb-3 flex items-center gap-3 px-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-neutral-800 dark:text-neutral-300">
              {user.email?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span className="truncate text-sm text-zinc-600 dark:text-neutral-300">
              {user.email}
            </span>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
          <span className="text-sm font-medium text-zinc-950 dark:text-white sm:hidden">
            Toolsfy
          </span>
          <span className="hidden text-sm font-medium text-zinc-500 dark:text-neutral-400 sm:block">
            Painel de Controle
          </span>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden items-center gap-1.5 text-xs text-zinc-500 dark:text-neutral-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              API operacional
            </span>
            <form action={signOut} className="sm:hidden">
              <button
                type="submit"
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-neutral-400 dark:hover:text-white"
              >
                Sair
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
