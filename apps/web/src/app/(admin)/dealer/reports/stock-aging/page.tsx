import { Metadata } from "next";
import { api } from "@/lib/api";
import type { StockAgingReport } from "@/lib/types/reports";
import RankedBarChart from "@/components/reports/RankedBarChart";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";

export const metadata: Metadata = { title: "Stock Aging Report" };

export default async function StockAgingReportPage() {
  const report = await api.get<StockAgingReport>("/reports/stock-aging");

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Days in Stock</h3>
        <RankedBarChart categories={report.buckets.map((b) => b.range)} series={report.buckets.map((b) => b.count)} name="Vehicles" horizontal={false} />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Vehicle
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Days in Stock
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {report.items.length === 0 && (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No unsold inventory.</TableCell>
                </TableRow>
              )}
              {report.items.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {v.brand} {v.model} ({v.year}) · #{v.stockNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge size="sm" color="light">
                      {v.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm">
                    <span className={v.ageDays > 90 ? "text-error-500 font-medium" : "text-gray-600 dark:text-gray-300"}>{v.ageDays} days</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
