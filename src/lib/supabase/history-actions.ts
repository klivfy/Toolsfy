"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function clearHistory() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("tool_usage").delete().eq("user_id", user.id);

  revalidatePath("/dashboard/history");
  revalidatePath("/dashboard");
}
