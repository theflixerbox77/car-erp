import { Metadata } from "next";
import { api } from "@/lib/api";
import type { ExpensesReport } from "@/lib/types/reports";
import TrendAreaChart from "@/components/reports/TrendAreaChart";
import DonutBreakdownChart from "@/components/reports/DonutBreakdownChart";
import StatTile from "@/components/reports/StatTile";

export const metadata: Metadata = { title: "Expense Report" };

function money(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export default async function ExpensesReportPage() {
  const report = await api.get<ExpensesReport>("/reports/expenses");

  return (
    <div className="space-y-6">
      <StatTile label="Total Approved Expenses (last 12 months)" value={money(report.totalExpenses)} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03] lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Monthly Expenses</h3>
          <TrendAreaChart categories={report.trend.map((t) => t.month)} series={report.trend.map((t) => t.total)} name="Expenses" />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">By Category</h3>
          <DonutBreakdownChart labels={report.byCategory.map((c) => c.name)} series={report.byCategory.map((c) => c.total)} />
        </div>
      </div>
    </div>
  );
}
