import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  DOCUMENT_TYPES,
  getFieldMaxLength,
  type DocumentType,
  type DocumentGeneratorInput,
} from "./document-types";

export function validateDocumentInput(input: unknown): DocumentGeneratorInput {
  if (typeof input !== "object" || input === null) {
    throw new Error("Corpo da requisição inválido");
  }

  const { docType, fields } = input as Record<string, unknown>;
  const definition = DOCUMENT_TYPES.find((type) => type.key === docType);

  if (!definition) {
    throw new Error("Tipo de documento inválido");
  }

  if (typeof fields !== "object" || fields === null) {
    throw new Error("Campos do documento ausentes");
  }

  const normalizedFields: Record<string, string> = {};
  for (const field of definition.fields) {
    const value = (fields as Record<string, unknown>)[field.key];
    const stringValue = typeof value === "string" ? value.trim() : "";

    if (field.required && !stringValue) {
      throw new Error(`O campo "${field.label}" é obrigatório`);
    }

    const maxLength = getFieldMaxLength(field);
    if (stringValue.length > maxLength) {
      throw new Error(
        `O campo "${field.label}" aceita até ${maxLength} caracteres`,
      );
    }

    normalizedFields[field.key] = stringValue;
  }

  return { docType: definition.key, fields: normalizedFields };
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function buildBody(docType: DocumentType, fields: Record<string, string>): string {
  const today = new Date().toLocaleDateString("pt-BR");

  if (docType === "contrato") {
    return (
      `CONTRATO DE PRESTAÇÃO DE SERVIÇOS\n\n` +
      `Pelo presente instrumento particular, de um lado ${fields.contratante}, doravante denominado CONTRATANTE, ` +
      `e de outro lado ${fields.contratado}, doravante denominado CONTRATADO, têm entre si justo e acordado o presente ` +
      `contrato de prestação de serviços, que se regerá pelas cláusulas seguintes.\n\n` +
      `OBJETO: ${fields.objeto}\n\n` +
      `VALOR: R$ ${fields.valor}\n\n` +
      `PRAZO DE VIGÊNCIA: ${fields.prazo}\n\n` +
      `E por estarem assim justos e contratados, firmam o presente instrumento.\n\n` +
      `Documento gerado via Toolsfy em ${today}.`
    );
  }

  if (docType === "recibo") {
    return (
      `RECIBO DE PAGAMENTO\n\n` +
      `Eu, ${fields.recebedor}, declaro ter recebido de ${fields.pagador} a importância de R$ ${fields.valor}, ` +
      `referente a: ${fields.referente}.\n\n` +
      `Para maior clareza, firmo o presente recibo.\n\n` +
      `${today}\n\n` +
      `Documento gerado via Toolsfy.`
    );
  }

  return (
    `${fields.titulo.toUpperCase()}\n\n` +
    `Autor: ${fields.autor}\n` +
    `Data: ${today}\n\n` +
    `${fields.conteudo}\n\n` +
    `Documento gerado via Toolsfy.`
  );
}

export async function generateDocumentPdf(input: DocumentGeneratorInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageSize: [number, number] = [595.28, 841.89]; // A4
  const margin = 56;
  const fontSize = 11;
  const lineHeight = 16;
  const maxCharsPerLine = 92;

  const definition = DOCUMENT_TYPES.find((type) => type.key === input.docType)!;
  const body = buildBody(input.docType, input.fields);
  const paragraphs = body.split("\n\n");

  let page = pdfDoc.addPage(pageSize);
  let y = pageSize[1] - margin;

  page.drawText("Toolsfy", {
    x: margin,
    y,
    size: 10,
    font: bold,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= lineHeight * 2;

  page.drawText(definition.label, {
    x: margin,
    y,
    size: 16,
    font: bold,
    color: rgb(0.06, 0.06, 0.06),
  });
  y -= lineHeight * 2;

  for (const paragraph of paragraphs) {
    const lines = paragraph
      .split("\n")
      .flatMap((line) => (line ? wrapText(line, maxCharsPerLine) : [""]));

    for (const line of lines) {
      if (y < margin) {
        page = pdfDoc.addPage(pageSize);
        y = pageSize[1] - margin;
      }
      page.drawText(line, { x: margin, y, size: fontSize, font });
      y -= lineHeight;
    }
    y -= lineHeight * 0.5;
  }

  return pdfDoc.save();
}
