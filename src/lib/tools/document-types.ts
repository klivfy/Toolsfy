export type DocumentType = "contrato" | "recibo" | "relatorio";

export type DocumentField = {
  key: string;
  label: string;
  required: boolean;
  multiline?: boolean;
};

export const DOCUMENT_TYPES: {
  key: DocumentType;
  label: string;
  fields: DocumentField[];
}[] = [
  {
    key: "contrato",
    label: "Contrato de Prestação de Serviços",
    fields: [
      { key: "contratante", label: "Contratante", required: true },
      { key: "contratado", label: "Contratado", required: true },
      { key: "objeto", label: "Objeto do contrato", required: true, multiline: true },
      { key: "valor", label: "Valor (R$)", required: true },
      { key: "prazo", label: "Prazo de vigência", required: true },
    ],
  },
  {
    key: "recibo",
    label: "Recibo de Pagamento",
    fields: [
      { key: "pagador", label: "Pagador", required: true },
      { key: "recebedor", label: "Recebedor", required: true },
      { key: "valor", label: "Valor (R$)", required: true },
      { key: "referente", label: "Referente a", required: true },
    ],
  },
  {
    key: "relatorio",
    label: "Relatório Simples",
    fields: [
      { key: "titulo", label: "Título", required: true },
      { key: "autor", label: "Autor", required: true },
      { key: "conteudo", label: "Conteúdo", required: true, multiline: true },
    ],
  },
];

export type DocumentGeneratorInput = {
  docType: DocumentType;
  fields: Record<string, string>;
};
