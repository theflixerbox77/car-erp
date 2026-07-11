"use client";

import React, { useRef, useTransition } from "react";
import { recordPaymentAction } from "@/app/actions/sales";

export default function PaymentForm({ saleId }: { saleId: string }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await recordPaymentAction(saleId, formData);
          formRef.current?.reset();
        });
      }}
      className="flex flex-wrap items-end gap-2"
    >
      <div>
        <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Amount</label>
        <input name="amount" type="number" required className="h-9 w-32 rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:text-white/90" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Method</label>
        <select name="method" className="h-9 rounded-lg border border-gray-300 bg-white px-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
          <option value="cash">Cash</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="cheque">Cheque</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Reference</label>
        <input name="referenceNote" type="text" className="h-9 w-40 rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:text-white/90" />
      </div>
      <button type="submit" disabled={isPending} className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60">
        {isPending ? "Saving..." : "Record Payment"}
      </button>
    </form>
  );
}
