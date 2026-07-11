import { Metadata } from "next";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import type { ExpenseCategory, RecurringSchedule } from "@/lib/types/ops";
import NewRecurringForm from "@/components/expenses/NewRecurringForm";
import RecurringScheduleRow from "@/components/expenses/RecurringScheduleRow";

export const metadata: Metadata = { title: "Recurring Expenses" };

export default async function RecurringExpensesPage() {
  const [schedules, categories] = await Promise.all([
    api.get<RecurringSchedule[]>("/expenses/recurring"),
    api.get<ExpenseCategory[]>("/expenses/categories"),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Recurring Expenses</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Auto-generated as approved expenses on their scheduled date.</p>
      </div>

      <div className="mb-6">
        <NewRecurringForm categories={categories} />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Category
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Amount
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Frequency
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Next Run
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {""}
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {schedules.length === 0 && (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No recurring schedules yet.</TableCell>
                </TableRow>
              )}
              {schedules.map((s) => (
                <RecurringScheduleRow key={s.id} schedule={s} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
