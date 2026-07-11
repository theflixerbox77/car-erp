import { Metadata } from "next";
import { api } from "@/lib/api";
import type { InventoryReport } from "@/lib/types/reports";
import DonutBreakdownChart from "@/components/reports/DonutBreakdownChart";
import RankedBarChart from "@/components/reports/RankedBarChart";
import StatTile from "@/components/reports/StatTile";

export const metadata: Metadata = { title: "Inventory Report" };

function money(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export default async function InventoryReportPage() {
  const report = await api.get<InventoryReport>("/reports/inventory");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatTile label="Total Vehicles" value={String(report.totalVehicles)} />
        <StatTile label="Inventory Value (unsold)" value={money(report.inventoryValue)} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">By Status</h3>
          <DonutBreakdownChart labels={report.byStatus.map((s) => s.status)} series={report.byStatus.map((s) => s.count)} />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">By Brand</h3>
          <RankedBarChart categories={report.byBrand.map((b) => b.brand)} series={report.byBrand.map((b) => b.count)} name="Vehicles" />
        </div>
      </div>
    </div>
  );
}
