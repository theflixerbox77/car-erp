import { Metadata } from "next";
import { api } from "@/lib/api";
import type { Customer } from "@/lib/types/sales";
import type { VehicleListResponse } from "@/lib/types/vehicle";
import NewSaleForm from "@/components/sales/NewSaleForm";

export const metadata: Metadata = { title: "New Sale" };

export default async function NewSalePage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string; customerId?: string; vehicleId?: string }>;
}) {
  const defaults = await searchParams;
  const [customers, vehicles] = await Promise.all([
    api.get<Customer[]>("/customers"),
    api.get<VehicleListResponse>("/vehicles?limit=100"),
  ]);

  const sellable = vehicles.items.filter((v) => v.status !== "sold" || v.id === defaults.vehicleId);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">New Sale</h1>
      </div>
      <NewSaleForm customers={customers} vehicles={sellable} defaults={defaults} />
    </div>
  );
}
