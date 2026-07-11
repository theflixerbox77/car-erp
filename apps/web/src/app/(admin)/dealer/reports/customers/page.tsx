import { Metadata } from "next";
import { api } from "@/lib/api";
import type { CustomersReport } from "@/lib/types/reports";
import TrendAreaChart from "@/components/reports/TrendAreaChart";
import StatTile from "@/components/reports/StatTile";

export const metadata: Metadata = { title: "Customer Report" };

function money(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export default async function CustomersReportPage() {
  const report = await api.get<CustomersReport>("/reports/customers");

  return (
    <div className="space-y-6">
      <StatTile label="Total Customers" value={String(report.totalCustomers)} />
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">New Customers per Month</h3>
        <TrendAreaChart categories={report.trend.map((t) => t.month)} series={report.trend.map((t) => t.newCustomers)} name="New Customers" />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Top Customers</h3>
        {report.topCustomers.length === 0 ? (
          <p className="text-sm text-gray-400">No sales yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {report.topCustomers.map((c, i) => (
              <li key={c.customerId} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 dark:border-white/[0.05]">
                <span className="text-gray-700 dark:text-gray-300">
                  {i + 1}. {c.fullName}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {money(c.totalSpent)} · {c.salesCount} purchase{c.salesCount === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
