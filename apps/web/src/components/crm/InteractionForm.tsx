"use client";

import React, { useRef, useTransition } from "react";
import { addInteractionAction } from "@/app/actions/sales";

export default function InteractionForm({ customerId }: { customerId: string }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await addInteractionAction(customerId, formData);
          formRef.current?.reset();
        });
      }}
      className="flex flex-wrap items-start gap-2"
    >
      <select name="type" className="h-9 rounded-lg border border-gray-300 bg-white px-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
        <option value="call">Call</option>
        <option value="visit">Visit</option>
        <option value="whatsapp">WhatsApp</option>
        <option value="email">Email</option>
        <option value="note">Note</option>
      </select>
      <input
        name="summary"
        type="text"
        placeholder="What happened?"
        required
        className="h-9 flex-1 min-w-[200px] rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:text-white/90"
      />
      <button
        type="submit"
        disabled={isPending}
        className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Log"}
      </button>
    </form>
  );
}
