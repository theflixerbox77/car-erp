import { Metadata } from "next";
import { api } from "@/lib/api";
import Badge from "@/components/ui/badge/Badge";
import type { Sale } from "@/lib/types/sales";
import PaymentForm from "@/components/sales/PaymentForm";
import DocumentsPanel from "@/components/sales/DocumentsPanel";

export const metadata: Metadata = { title: "Sale Detail" };

const PAYMENT_BADGE: Record<string, "success" | "warning" | "error"> = { paid: "success", partial: "warning", pending: "error" };

function money(value: string) {
  return new Intl.NumberFormat("en-US").format(Number(value));
}

export default async function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sale = await api.get<Sale>(`/sales/${id}`);
  const netTotal = Number(sale.salePrice) - Number(sale.discount);
  const totalPaid = sale.payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
              {sale.vehicle.brand} {sale.vehicle.model} ({sale.vehicle.year})
            </h1>
            <Badge size="sm" color={PAYMENT_BADGE[sale.paymentStatus]}>
              {sale.paymentStatus}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sold to {sale.customer.fullName} · Stock #{sale.vehicle.stockNumber}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Record Payment</h3>
            <PaymentForm saleId={sale.id} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Payment History</h3>
            {sale.payments.length === 0 ? (
              <p className="text-sm text-gray-400">No payments recorded yet.</p>
            ) : (
              <ul className="space-y-2">
                {sale.payments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm last:border-0 dark:border-white/[0.05]">
                    <div>
                      <span className="text-gray-800 dark:text-white/90">{money(p.amount)}</span>
                      <span className="ml-2 text-xs text-gray-400">{p.method.replace("_", " ")}</span>
                      {p.referenceNote && <p className="text-xs text-gray-400">{p.referenceNote}</p>}
                    </div>
                    <span className="text-xs text-gray-400">{new Date(p.paidAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DocumentsPanel saleId={sale.id} documents={sale.documents} />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Financials</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Sale Price</dt>
                <dd className="text-gray-800 dark:text-white/90">{money(sale.salePrice)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Discount</dt>
                <dd className="text-gray-800 dark:text-white/90">-{money(sale.discount)}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 font-semibold dark:border-white/[0.05]">
                <dt className="text-gray-700 dark:text-gray-300">Net Total</dt>
                <dd className="text-gray-800 dark:text-white/90">{money(netTotal.toString())}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Paid</dt>
                <dd className="text-gray-800 dark:text-white/90">{money(totalPaid.toString())}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Due</dt>
                <dd className="text-gray-800 dark:text-white/90">{money((netTotal - totalPaid).toString())}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 dark:border-white/[0.05]">
                <dt className="text-gray-500 dark:text-gray-400">Commission ({Number(sale.commissionRate)}%)</dt>
                <dd className="text-gray-800 dark:text-white/90">{money(sale.commissionAmount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Vehicle Cost</dt>
                <dd className="text-gray-800 dark:text-white/90">{money(sale.vehicle.totalCost)}</dd>
              </div>
              <div className="flex justify-between font-semibold">
                <dt className="text-gray-700 dark:text-gray-300">Profit</dt>
                <dd className={Number(sale.profit) >= 0 ? "text-success-600" : "text-error-500"}>{money(sale.profit)}</dd>
              </div>
            </dl>
          </div>

          {sale.warrantyMonths != null && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-white/90">Warranty</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{sale.warrantyMonths} months</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
