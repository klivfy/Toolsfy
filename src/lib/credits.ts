import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Tools whose own API route does the work and charges the credits. For
 * these, "Acessar" (/api/tools/[id]/execute) only navigates.
 */
export const SELF_BILLED_TOOLS = new Set(["gerador-documentos"]);

export const INSUFFICIENT_CREDITS_MESSAGE =
  "Créditos insuficientes para executar esta ferramenta";

type ChargeInput = {
  userId: string;
  toolId: string;
  toolName: string;
  cost: number;
  limit: number;
};

export type ChargeResult =
  | { ok: true; usageId: string }
  | { ok: false; reason: "insufficient_credits" };

/**
 * Checks the monthly balance and records the usage atomically in the
 * database (see consume_credits in supabase/migrations). Throws when the
 * database call itself fails, so callers never run a tool uncharged.
 */
export async function chargeCredits(input: ChargeInput): Promise<ChargeResult> {
  const { data, error } = await createAdminClient().rpc("consume_credits", {
    p_user_id: input.userId,
    p_tool_id: input.toolId,
    p_tool_name: input.toolName,
    p_cost: input.cost,
    p_limit: input.limit,
  });

  if (error) {
    if (error.message.includes("insufficient_credits")) {
      return { ok: false, reason: "insufficient_credits" };
    }
    throw new Error(`consume_credits failed: ${error.message}`);
  }

  return { ok: true, usageId: data as string };
}

/**
 * Turns a charged usage into a free error entry when the tool fails after
 * being charged. Logged instead of thrown: the caller is already answering
 * with an error.
 */
export async function refundUsage(usageId: string) {
  const { error } = await createAdminClient()
    .from("tool_usage")
    .update({ credits: 0, status: "error" })
    .eq("id", usageId);

  if (error) {
    console.error(`[credits] refund failed for usage ${usageId}: ${error.message}`);
  }
}
