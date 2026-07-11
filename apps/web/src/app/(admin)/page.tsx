import Link from "next/link";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import StatTile from "@/components/reports/StatTile";
import TrendAreaChart from "@/components/reports/TrendAreaChart";
import type { InventoryReport, LeadsReport, SalesReport } from "@/lib/types/reports";
import type { Sale } from "@/lib/types/sales";

export const metadata: Metadata = { title: "Dashboard" };

const PAYMENT_BADGE: Record<string, "success" | "warning" | "error"> = { paid: "success", partial: "warning", pending: "error" };

function money(value: string | number) {
  return new Intl.NumberFormat("en-US").format(Number(value));
}

export default async function DashboardPage() {
  const [inventory, leads, sales, recentSales] = await Promise.all([
    api.get<InventoryReport>("/reports/inventory"),
    api.get<LeadsReport>("/reports/leads"),
    api.get<SalesReport>("/reports/sales"),
    api.get<Sale[]>("/sales"),
  ]);

  const latestSales = [...recentSales]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Vehicles in Stock" value={String(inventory.totalVehicles)} />
        <StatTile label="Inventory Value" value={money(inventory.inventoryValue)} />
        <StatTile label="Active Leads" value={String(leads.total)} />
        <StatTile label="Revenue (last 12mo)" value={money(sales.totalRevenue)} tone="good" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Monthly Revenue</h3>
        {sales.trend.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">No sales yet.</p>
        ) : (
          <TrendAreaChart categories={sales.trend.map((t) => t.month)} series={sales.trend.map((t) => t.revenue)} name="Revenue" />
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">Recent Sales</h3>
          <Link href="/dealer/sales/records" className="text-theme-xs font-medium text-brand-500 hover:text-brand-600">
            View all
          </Link>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Vehicle
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Customer
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Sale Price
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Payment
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {latestSales.length === 0 && (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No sales recorded yet.</TableCell>
                </TableRow>
              )}
              {latestSales.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <Link href={`/dealer/sales/records/${s.id}`} className="font-medium text-gray-800 hover:text-brand-500 text-theme-sm dark:text-white/90">
                      {s.vehicle.brand} {s.vehicle.model} ({s.vehicle.year})
                    </Link>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{s.customer.fullName}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{money(s.salePrice)}</TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge size="sm" color={PAYMENT_BADGE[s.paymentStatus]}>
                      {s.paymentStatus}
                    </Badge>
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
