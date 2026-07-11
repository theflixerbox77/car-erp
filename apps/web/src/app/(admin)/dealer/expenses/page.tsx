import Link from "next/link";
import { Metadata } from "next";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import type { Expense } from "@/lib/types/ops";
import ApprovalButtons from "@/components/expenses/ApprovalButtons";

export const metadata: Metadata = { title: "Expenses" };

const STATUS_BADGE: Record<string, "success" | "warning" | "error"> = { approved: "success", pending: "warning", rejected: "error" };

function money(value: string) {
  return new Intl.NumberFormat("en-US").format(Number(value));
}

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const query = status ? `?status=${status}` : "";
  const expenses = await api.get<Expense[]>(`/expenses${query}`);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Expenses</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{expenses.length} expense{expenses.length === 1 ? "" : "s"}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dealer/expenses/recurring" className="text-sm font-medium text-brand-500 hover:text-brand-600 self-center">
            Recurring Schedules
          </Link>
          <Link href="/dealer/expenses/new">
            <Button size="sm">Add Expense</Button>
          </Link>
        </div>
      </div>

      <div className="mb-4 flex gap-2 text-sm">
        {["", "pending", "approved", "rejected"].map((s) => (
          <Link
            key={s}
            href={s ? `/dealer/expenses?status=${s}` : "/dealer/expenses"}
            className={`rounded-lg px-3 py-1.5 ${status === s || (!status && !s) ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300"}`}
          >
            {s || "All"}
          </Link>
        ))}
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
                  Description
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Amount
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Date
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
              {expenses.length === 0 && (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No expenses found.</TableCell>
                </TableRow>
              )}
              {expenses.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {e.category.name}
                    {e.isRecurring && (
                      <Badge size="sm" color="light">
                        recurring
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{e.description ?? "—"}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{money(e.amount)}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{new Date(e.expenseDate).toLocaleDateString()}</TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge size="sm" color={STATUS_BADGE[e.status]}>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">{e.status === "pending" && <ApprovalButtons expenseId={e.id} />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
