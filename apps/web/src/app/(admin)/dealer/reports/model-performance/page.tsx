import { Metadata } from "next";
import { api } from "@/lib/api";
import type { ModelPerformanceReport } from "@/lib/types/reports";

export const metadata: Metadata = { title: "Model Performance Report" };

function PerformanceTable({ title, rows }: { title: string; rows: { brand: string; model: string; unitsSold: number; avgDaysToSell: number }[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">Not enough sales data yet.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {rows.map((r, i) => (
            <li key={`${r.brand}-${r.model}`} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 dark:border-white/[0.05]">
              <span className="text-gray-700 dark:text-gray-300">
                {i + 1}. {r.brand} {r.model}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {r.avgDaysToSell} days avg · {r.unitsSold} sold
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function ModelPerformanceReportPage() {
  const report = await api.get<ModelPerformanceReport>("/reports/model-performance");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <PerformanceTable title="Fastest Selling Models" rows={report.fastSelling} />
      <PerformanceTable title="Slowest Selling Models" rows={report.slowSelling} />
    </div>
  );
}
