"use client";

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import React, { useRef, useTransition } from "react";
import { createRecurringScheduleAction } from "@/app/actions/ops";
import type { ExpenseCategory } from "@/lib/types/ops";

export default function NewRecurringForm({ categories }: { categories: ExpenseCategory[] }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await createRecurringScheduleAction(formData);
          formRef.current?.reset();
        });
      }}
      className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03] sm:grid-cols-2"
    >
      <div>
        <Label>
          Category<span className="text-error-500">*</span>
        </Label>
        <select name="categoryId" required className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-700 dark:text-white/90">
          <option value="">Select...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>
          Amount<span className="text-error-500">*</span>
        </Label>
        <Input name="amount" type="number" />
      </div>
      <div>
        <Label>Frequency</Label>
        <select name="frequency" defaultValue="monthly" className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-700 dark:text-white/90">
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div>
        <Label>
          Next Run Date<span className="text-error-500">*</span>
        </Label>
        <Input name="nextRunDate" type="date" />
      </div>
      <div className="sm:col-span-2">
        <Label>Description</Label>
        <Input name="description" type="text" />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={isPending} className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60">
          {isPending ? "Saving..." : "Add Schedule"}
        </button>
      </div>
    </form>
  );
}
