"use client";

import React, { useTransition } from "react";
import { generateDocumentAction, getDocumentSignedUrl } from "@/app/actions/sales";
import type { SaleDocument } from "@/lib/types/sales";

const DOCUMENT_TYPES: { type: string; label: string }[] = [
  { type: "invoice", label: "Invoice" },
  { type: "money_receipt", label: "Money Receipt" },
  { type: "quotation", label: "Quotation" },
  { type: "delivery_note", label: "Delivery Note" },
  { type: "sales_agreement", label: "Sales Agreement" },
];

export default function DocumentsPanel({ saleId, documents }: { saleId: string; documents: SaleDocument[] }) {
  const [isPending, startTransition] = useTransition();

  async function handleDownload(documentId: string) {
    const url = await getDocumentSignedUrl(saleId, documentId);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Documents</h3>

      <div className="mb-4 flex flex-wrap gap-2">
        {DOCUMENT_TYPES.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => generateDocumentAction(saleId, type))}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
          >
            Generate {label}
          </button>
        ))}
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-gray-400">No documents generated yet.</p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">
                {DOCUMENT_TYPES.find((d) => d.type === doc.type)?.label ?? doc.type} — {new Date(doc.generatedAt).toLocaleDateString()}
              </span>
              <button type="button" onClick={() => handleDownload(doc.id)} className="text-brand-500 hover:text-brand-600">
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
