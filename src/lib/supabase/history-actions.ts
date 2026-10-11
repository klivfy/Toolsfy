"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Hides the user's history. Rows are kept (hidden_at is set) so the
 * credits already consumed this month still count.
 */
export async function clearHistory() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false };

  const { error } = await supabase.rpc("hide_tool_usage_history");

  if (error) {
    console.error(`[history] clear failed for user ${user.id}: ${error.message}`);
    return { ok: false };
  }

  revalidatePath("/dashboard/history");
  revalidatePath("/dashboard");
  return { ok: true };
}
