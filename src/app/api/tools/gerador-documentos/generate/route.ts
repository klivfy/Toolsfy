import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  generateDocumentPdf,
  validateDocumentInput,
} from "@/lib/tools/document-generator";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let input;
  try {
    const body = await request.json();
    input = validateDocumentInput(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requisição inválida";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const pdfBytes = await generateDocumentPdf(input);

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${input.docType}.pdf"`,
    },
  });
}
