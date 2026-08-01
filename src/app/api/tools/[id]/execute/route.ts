import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { APPS } from "@/components/showcase/data";
import { getCreditsLimit } from "@/lib/tool-usage";
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

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  const isPremium = subscription?.status === "active";
  const creditsLimit = getCreditsLimit(isPremium);

  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  ).toISOString();
  const { data: monthlyRows } = await supabase
    .from("tool_usage")
    .select("credits")
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth);

  const creditsUsed = (monthlyRows ?? []).reduce(
    (total, row) => total + (row.credits ?? 0),
    0,
  );

  if (creditsUsed + app.credits > creditsLimit) {
    return NextResponse.json(
      { error: "Créditos insuficientes para executar esta ferramenta" },
      { status: 429 },
    );
  }

  try {
    await runToolWithTimeout(app.id, TIMEOUT_MS);
  } catch (err) {
    const isTimeout = err instanceof ToolTimeoutError;

    await supabase.from("tool_usage").insert({
      user_id: user.id,
      tool_id: app.id,
      tool_name: app.name,
      credits: 0,
      status: "error",
    });

    if (isTimeout) {
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

  await supabase.from("tool_usage").insert({
    user_id: user.id,
    tool_id: app.id,
    tool_name: app.name,
    credits: app.credits,
    status: "success",
  });

  return NextResponse.json({ success: true });
}
