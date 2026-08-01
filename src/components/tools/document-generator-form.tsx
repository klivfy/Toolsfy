"use client";

import { useState } from "react";
import { Loader2, Download } from "lucide-react";
import { useToast } from "@/components/toast/toast-provider";
import { DOCUMENT_TYPES, type DocumentType } from "@/lib/tools/document-types";

export function DocumentGeneratorForm() {
  const [docType, setDocType] = useState<DocumentType>(DOCUMENT_TYPES[0].key);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  const definition = DOCUMENT_TYPES.find((type) => type.key === docType)!;

  function handleFieldChange(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/tools/gerador-documentos/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, fields: values }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error ?? "Não foi possível gerar o documento", "error");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${docType}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      showToast("Documento gerado com sucesso");
    } catch {
      showToast("Falha de conexão ao gerar o documento", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="docType"
          className="mb-1.5 block text-xs font-medium text-zinc-600"
        >
          Tipo de documento
        </label>
        <select
          id="docType"
          value={docType}
          onChange={(event) => {
            setDocType(event.target.value as DocumentType);
            setValues({});
          }}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-400"
        >
          {DOCUMENT_TYPES.map((type) => (
            <option key={type.key} value={type.key}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {definition.fields.map((field) => (
        <div key={field.key}>
          <label
            htmlFor={field.key}
            className="mb-1.5 block text-xs font-medium text-zinc-600"
          >
            {field.label}
          </label>
          {field.multiline ? (
            <textarea
              id={field.key}
              value={values[field.key] ?? ""}
              onChange={(event) => handleFieldChange(field.key, event.target.value)}
              rows={3}
              required={field.required}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-400"
            />
          ) : (
            <input
              id={field.key}
              type="text"
              value={values[field.key] ?? ""}
              onChange={(event) => handleFieldChange(field.key, event.target.value)}
              required={field.required}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-400"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
        ) : (
          <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
        )}
        {loading ? "Gerando…" : "Gerar documento"}
      </button>
    </form>
  );
}
