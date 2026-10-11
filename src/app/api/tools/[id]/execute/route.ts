import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { APPS } from "@/components/showcase/data";
import { getCreditsLimit } from "@/lib/tool-usage";
import {
  chargeCredits,
  INSUFFICIENT_CREDITS_MESSAGE,
  refundUsage,
  SELF_BILLED_TOOLS,
} from "@/lib/credits";
import { runToolWithTimeout, ToolTimeoutError } from "@/lib/tools/engine";

const TIMEOUT_MS = 10_000;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const app = APPS.find((item) => item.id === id && item.native);

  if (!app) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }

  // The tool's own route charges when it actually does the work.
  if (SELF_BILLED_TOOLS.has(app.id)) {
    return NextResponse.json({ success: true });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  const isPremium = subscription?.status === "active";

  let usageId: string;
  try {
    const charge = await chargeCredits({
      userId: user.id,
      toolId: app.id,
      toolName: app.name,
      cost: app.credits,
      limit: getCreditsLimit(isPremium),
    });
    if (!charge.ok) {
      return NextResponse.json(
        { error: INSUFFICIENT_CREDITS_MESSAGE },
        { status: 402 },
      );
    }
    usageId = charge.usageId;
  } catch (err) {
    console.error(`[tools/execute] ${app.id} for user ${user.id}:`, err);
    return NextResponse.json(
      { error: "Falha ao processar a ferramenta" },
      { status: 500 },
    );
  }

  try {
    await runToolWithTimeout(app.id, TIMEOUT_MS);
  } catch (err) {
    await refundUsage(usageId);

    if (err instanceof ToolTimeoutError) {
      return NextResponse.json(
        { error: "Tempo limite excedido ao processar a ferramenta" },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { error: "Falha ao processar a ferramenta" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
