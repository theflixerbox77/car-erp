import Link from "next/link";
import { Metadata } from "next";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import type { Sale } from "@/lib/types/sales";

export const metadata: Metadata = { title: "Sales" };

const PAYMENT_BADGE: Record<string, "success" | "warning" | "error"> = { paid: "success", partial: "warning", pending: "error" };

function money(value: string) {
  return new Intl.NumberFormat("en-US").format(Number(value));
}

export default async function SalesRecordsPage() {
  const sales = await api.get<Sale[]>("/sales");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Sales</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{sales.length} sale{sales.length === 1 ? "" : "s"}</p>
        </div>
        <Link href="/dealer/sales/records/new">
          <Button size="sm">New Sale</Button>
        </Link>
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
                  Customer
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Sale Price
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Profit
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Payment
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {sales.length === 0 && (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No sales recorded yet.</TableCell>
                </TableRow>
              )}
              {sales.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <Link href={`/dealer/sales/records/${s.id}`} className="font-medium text-gray-800 hover:text-brand-500 text-theme-sm dark:text-white/90">
                      {s.vehicle.brand} {s.vehicle.model} ({s.vehicle.year})
                    </Link>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{s.customer.fullName}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{money(s.salePrice)}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm">
                    <span className={Number(s.profit) >= 0 ? "text-success-600" : "text-error-500"}>{money(s.profit)}</span>
                  </TableCell>
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
