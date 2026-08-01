import { type User } from "@supabase/supabase-js";

export function getUserInitials(user: Pick<User, "email" | "user_metadata"> | null | undefined) {
  const fullName = (user?.user_metadata?.full_name as string | undefined)?.trim();

  if (fullName) {
    const parts = fullName.split(/\s+/).filter(Boolean);
    const initials = parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : parts[0].slice(0, 2);
    return initials.toUpperCase();
  }

  return (user?.email?.[0] ?? "U").toUpperCase();
}

export function getGreeting(date: Date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}
