import { Metadata } from "next";
import { api } from "@/lib/api";
import type { ProfitReport } from "@/lib/types/reports";
import TrendAreaChart from "@/components/reports/TrendAreaChart";
import StatTile from "@/components/reports/StatTile";

export const metadata: Metadata = { title: "Profit Report" };

function money(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export default async function ProfitReportPage() {
  const report = await api.get<ProfitReport>("/reports/profit");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total Revenue" value={money(report.totalRevenue)} />
        <StatTile label="Total Profit" value={money(report.totalProfit)} tone={report.totalProfit >= 0 ? "good" : "critical"} />
        <StatTile label="Commission Paid" value={money(report.totalCommission)} />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Monthly Profit</h3>
        {report.trend.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">No sales yet.</p>
        ) : (
          <TrendAreaChart categories={report.trend.map((t) => t.month)} series={report.trend.map((t) => t.profit)} name="Profit" />
        )}
      </div>
    </div>
  );
}
