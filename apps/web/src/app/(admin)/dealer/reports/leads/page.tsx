import { Metadata } from "next";
import { api } from "@/lib/api";
import type { LeadsReport } from "@/lib/types/reports";
import DonutBreakdownChart from "@/components/reports/DonutBreakdownChart";
import RankedBarChart from "@/components/reports/RankedBarChart";
import StatTile from "@/components/reports/StatTile";
import { LEAD_STAGE_LABELS, type LeadStage } from "@/lib/types/sales";

export const metadata: Metadata = { title: "Lead Report" };

export default async function LeadsReportPage() {
  const report = await api.get<LeadsReport>("/reports/leads");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total Leads" value={String(report.total)} />
        <StatTile label="Conversion Rate" value={`${report.conversionRate}%`} tone="good" />
        <StatTile label="Lost Rate" value={`${report.lostRate}%`} tone={report.lostRate > 30 ? "critical" : "default"} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Pipeline Funnel</h3>
          {report.byStage.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">No leads yet.</p>
          ) : (
            <DonutBreakdownChart
              labels={report.byStage.map((s) => LEAD_STAGE_LABELS[s.stage as LeadStage] ?? s.stage)}
              series={report.byStage.map((s) => s.count)}
            />
          )}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">By Source</h3>
          {report.bySource.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">No leads yet.</p>
          ) : (
            <RankedBarChart categories={report.bySource.map((s) => s.source)} series={report.bySource.map((s) => s.count)} name="Leads" />
          )}
        </div>
      </div>
    </div>
  );
}
