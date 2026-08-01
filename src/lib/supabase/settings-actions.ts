"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const THEMES = ["light", "dark", "system"] as const;

export async function updateProfile(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const themeInput = String(formData.get("theme") ?? "system");
  const theme = THEMES.includes(themeInput as (typeof THEMES)[number])
    ? themeInput
    : "system";

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName, theme },
  });

  if (error) {
    redirect(`/dashboard/settings?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard/settings?message=Perfil atualizado com sucesso");
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    redirect(
      `/dashboard/settings?error=${encodeURIComponent("A senha deve ter pelo menos 8 caracteres")}`,
    );
  }

  if (password !== confirmPassword) {
    redirect(
      `/dashboard/settings?error=${encodeURIComponent("As senhas não coincidem")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/dashboard/settings?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard/settings?message=Senha atualizada com sucesso");
}
