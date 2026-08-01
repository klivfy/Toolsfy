"use server";

import { createClient } from "@/lib/supabase/server";

export async function recordToolUsage(
  toolId: string,
  toolName: string,
  credits: number,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("tool_usage").insert({
    user_id: user.id,
    tool_id: toolId,
    tool_name: toolName,
    credits,
    status: "success",
  });
}
