import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { APPS } from "@/components/showcase/data";
import { getCreditsLimit } from "@/lib/tool-usage";
import {
  chargeCredits,
  INSUFFICIENT_CREDITS_MESSAGE,
  refundUsage,
} from "@/lib/credits";
import {
  generateDocumentPdf,
  validateDocumentInput,
} from "@/lib/tools/document-generator";

const TOOL_ID = "gerador-documentos";
const MAX_BODY_BYTES = 64 * 1024;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const app = APPS.find((item) => item.id === TOOL_ID);
  if (!app) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Requisição muito grande" }, { status: 413 });
  }

  let input;
  try {
    // Content-Length can be absent (chunked), so measure the body too.
    const raw = await request.text();
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Requisição muito grande" }, { status: 413 });
    }
    input = validateDocumentInput(JSON.parse(raw));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requisição inválida";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  let usageId: string;
  try {
    const charge = await chargeCredits({
      userId: user.id,
      toolId: app.id,
      toolName: app.name,
      cost: app.credits,
      limit: getCreditsLimit(subscription?.status === "active"),
    });
    if (!charge.ok) {
      return NextResponse.json(
        { error: INSUFFICIENT_CREDITS_MESSAGE },
        { status: 402 },
      );
    }
    usageId = charge.usageId;
  } catch (err) {
    console.error(`[gerador-documentos] charge failed for user ${user.id}:`, err);
    return NextResponse.json(
      { error: "Não foi possível gerar o documento" },
      { status: 500 },
    );
  }

  let pdfBytes: Uint8Array;
  try {
    pdfBytes = await generateDocumentPdf(input);
  } catch (err) {
    await refundUsage(usageId);
    console.warn(`[gerador-documentos] generation failed for user ${user.id}:`, err);
    return NextResponse.json(
      {
        error:
          "Não foi possível gerar o PDF. Remova emojis ou símbolos especiais e tente novamente.",
      },
      { status: 422 },
    );
  }

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${input.docType}.pdf"`,
    },
  });
}
