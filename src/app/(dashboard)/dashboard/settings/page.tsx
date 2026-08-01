import { createClient } from "@/lib/supabase/server";
import { getUserInitials } from "@/lib/user-display";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateProfile, updatePassword } from "@/lib/supabase/settings-actions";
import { PortalButton } from "@/components/billing/portal-button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, stripe_customer_id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const isPremium = subscription?.status === "active";
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? "";
  const theme = (user?.user_metadata?.theme as string | undefined) ?? "system";
  const initials = getUserInitials(user);
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">Configurações</h1>
        <p className="text-sm text-zinc-500">
          Gerencie as preferências da sua conta.
        </p>
      </div>

      {message && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-base font-medium text-zinc-600">
            {initials}
          </div>
          <div>
            <h2 className="text-sm font-medium text-zinc-950">Perfil</h2>
            <p className="text-xs text-zinc-500">
              Atualize seu nome de exibição.
            </p>
          </div>
        </div>

        <form action={updateProfile} className="mt-6 max-w-sm space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="mb-1.5 block text-xs font-medium text-zinc-600"
            >
              Nome
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              defaultValue={fullName}
              placeholder="Seu nome completo"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-400"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium text-zinc-600"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400"
            />
          </div>
          <div>
            <label
              htmlFor="theme"
              className="mb-1.5 block text-xs font-medium text-zinc-600"
            >
              Preferência de tema
            </label>
            <select
              id="theme"
              name="theme"
              defaultValue={theme}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-400"
            >
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
              <option value="system">Automático (sistema)</option>
            </select>
          </div>
          <p className="text-xs text-zinc-400">
            Conta criada em {createdAt}
          </p>
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-zinc-950 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Salvar alterações
          </button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-medium text-zinc-950">Segurança</h2>
        <p className="text-xs text-zinc-500">Altere sua senha de acesso.</p>

        <form action={updatePassword} className="mt-6 max-w-sm space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium text-zinc-600"
            >
              Nova senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-400"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-xs font-medium text-zinc-600"
            >
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-400"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-zinc-950 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Atualizar senha
          </button>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Plano atual
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-950">
                {isPremium ? "Premium" : "Free"}
              </span>
              <Badge tone={isPremium ? "premium" : "neutral"}>
                {isPremium ? "Ativo" : "Gratuito"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isPremium && subscription?.stripe_customer_id && <PortalButton />}
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Ver planos
              <ArrowRight className="h-3 w-3" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-medium text-red-700">Zona de risco</h2>
        <p className="mt-1 max-w-sm text-xs text-zinc-500">
          A exclusão da conta é permanente e remove todos os seus dados do
          Toolsfy. Entre em contato com o suporte para solicitar a exclusão.
        </p>
        <button
          type="button"
          disabled
          className="mt-4 inline-flex items-center rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-600 opacity-50"
        >
          Excluir conta
        </button>
      </Card>
    </div>
  );
}
