"use client";

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import React, { useActionState, useState } from "react";
import { createExpenseAction, createExpenseCategoryAction, ActionState } from "@/app/actions/ops";
import type { ExpenseCategory } from "@/lib/types/ops";

export default function NewExpenseForm({ categories }: { categories: ExpenseCategory[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createExpenseAction, {});
  const [showNewCategory, setShowNewCategory] = useState(categories.length === 0);

  return (
    <div className="max-w-2xl space-y-4">
      {showNewCategory && (
        <form
          action={async (fd) => {
            await createExpenseCategoryAction(fd);
            setShowNewCategory(false);
          }}
          className="flex items-end gap-2 rounded-xl border border-dashed border-gray-300 p-4 dark:border-gray-700"
        >
          <div className="flex-1">
            <Label>New Category Name</Label>
            <Input name="name" type="text" />
          </div>
          <button type="submit" className="h-11 rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-700 dark:bg-white/5 dark:text-gray-300">
            Add Category
          </button>
        </form>
      )}

      <form action={formAction} className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]" encType="multipart/form-data">
        {state.error && (
          <div className="rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            {state.error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>
              Category<span className="text-error-500">*</span>
            </Label>
            <div className="flex gap-2">
              <select
                name="categoryId"
                required
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-700 dark:text-white/90"
              >
                <option value="">Select...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategory((v) => !v)}
                className="h-11 shrink-0 rounded-lg border border-gray-300 px-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300"
              >
                + New
              </button>
            </div>
          </div>
          <div>
            <Label>
              Amount<span className="text-error-500">*</span>
            </Label>
            <Input name="amount" type="number" />
          </div>
          <div>
            <Label>Date</Label>
            <Input name="expenseDate" type="date" />
          </div>
          <div>
            <Label>Receipt</Label>
            <input name="receipt" type="file" accept="image/*,application/pdf" className="block w-full text-sm text-gray-600 dark:text-gray-300" />
          </div>
        </div>
        <div>
          <Label>Description</Label>
          <Input name="description" type="text" />
        </div>
        <Button size="sm" disabled={pending}>
          {pending ? "Submitting..." : "Submit Expense"}
        </Button>
      </form>
    </div>
  );
}
