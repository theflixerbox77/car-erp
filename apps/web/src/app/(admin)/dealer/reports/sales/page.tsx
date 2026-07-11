import { Metadata } from "next";
import { api } from "@/lib/api";
import type { SalesReport } from "@/lib/types/reports";
import TrendAreaChart from "@/components/reports/TrendAreaChart";
import StatTile from "@/components/reports/StatTile";

export const metadata: Metadata = { title: "Sales Report" };

function money(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export default async function SalesReportPage() {
  const report = await api.get<SalesReport>("/reports/sales");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatTile label="Sales (last 12 months)" value={String(report.totalSales)} />
        <StatTile label="Total Revenue" value={money(report.totalRevenue)} tone="good" />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Monthly Revenue</h3>
        <TrendAreaChart categories={report.trend.map((t) => t.month)} series={report.trend.map((t) => t.revenue)} name="Revenue" />
      </div>
    </div>
  );
}
