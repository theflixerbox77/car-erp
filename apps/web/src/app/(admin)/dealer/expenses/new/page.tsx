import { Metadata } from "next";
import { api } from "@/lib/api";
import type { ExpenseCategory } from "@/lib/types/ops";
import NewExpenseForm from "@/components/expenses/NewExpenseForm";

export const metadata: Metadata = { title: "Add Expense" };

export default async function NewExpensePage() {
  const categories = await api.get<ExpenseCategory[]>("/expenses/categories");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Add Expense</h1>
      </div>
      <NewExpenseForm categories={categories} />
    </div>
  );
}
