import { Metadata } from "next";
import { api } from "@/lib/api";
import type { Customer } from "@/lib/types/sales";
import type { VehicleListResponse } from "@/lib/types/vehicle";
import NewLeadForm from "@/components/sales/NewLeadForm";

export const metadata: Metadata = { title: "New Lead" };

export default async function NewLeadPage({ searchParams }: { searchParams: Promise<{ customerId?: string }> }) {
  const { customerId } = await searchParams;
  const [customers, vehicles] = await Promise.all([
    api.get<Customer[]>("/customers"),
    api.get<VehicleListResponse>("/vehicles?status=available&limit=100"),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">New Lead</h1>
      </div>
      <NewLeadForm customers={customers} vehicles={vehicles.items} defaultCustomerId={customerId} />
    </div>
  );
}
