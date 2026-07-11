import Link from "next/link";
import { Metadata } from "next";
import { api } from "@/lib/api";
import Badge from "@/components/ui/badge/Badge";
import type { Customer } from "@/lib/types/sales";
import { LEAD_STAGE_LABELS } from "@/lib/types/sales";
import InteractionForm from "@/components/crm/InteractionForm";

export const metadata: Metadata = { title: "Customer" };

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await api.get<Customer>(`/customers/${id}`);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">{customer.fullName}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {customer.phone ?? "No phone"} {customer.email ? `· ${customer.email}` : ""}
          </p>
        </div>
        <Link href={`/dealer/sales/leads/new?customerId=${customer.id}`} className="text-sm font-medium text-brand-500 hover:text-brand-600">
          Create Lead
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Log Interaction</h3>
            <InteractionForm customerId={customer.id} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">History</h3>
            {!customer.interactions || customer.interactions.length === 0 ? (
              <p className="text-sm text-gray-400">No interactions logged yet.</p>
            ) : (
              <ul className="space-y-3">
                {customer.interactions.map((i) => (
                  <li key={i.id} className="border-b border-gray-100 pb-3 text-sm last:border-0 dark:border-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <Badge size="sm" color="light">
                        {i.type}
                      </Badge>
                      <span className="text-xs text-gray-400">{new Date(i.occurredAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">{i.summary}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {customer.leads && customer.leads.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Leads</h3>
              <ul className="space-y-2 text-sm">
                {customer.leads.map((l) => (
                  <li key={l.id} className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{l.vehicle ? `${l.vehicle.brand} ${l.vehicle.model}` : "General inquiry"}</span>
                    <Badge size="sm" color="warning">
                      {LEAD_STAGE_LABELS[l.stage]}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">NID</dt>
                <dd className="text-gray-800 dark:text-white/90">{customer.nidNumber ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">License</dt>
                <dd className="text-gray-800 dark:text-white/90">{customer.licenseNumber ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Address</dt>
                <dd className="text-right text-gray-800 dark:text-white/90">{customer.address ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Source</dt>
                <dd className="text-gray-800 dark:text-white/90">{customer.source ?? "—"}</dd>
              </div>
            </dl>
            {customer.notes && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{customer.notes}</p>}
          </div>

          {customer.interests && customer.interests.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Interested Vehicles</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {customer.interests.map((i) => (
                  <li key={i.vehicle.id}>
                    {i.vehicle.brand} {i.vehicle.model} ({i.vehicle.year}) — #{i.vehicle.stockNumber}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
