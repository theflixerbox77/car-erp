import { Metadata } from "next";
import VehicleForm from "@/components/inventory/VehicleForm";
import { updateVehicleAction } from "@/app/actions/vehicles";
import { api } from "@/lib/api";
import type { Vehicle } from "@/lib/types/vehicle";

export const metadata: Metadata = { title: "Edit Vehicle" };

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await api.get<Vehicle>(`/vehicles/${id}`);
  const action = updateVehicleAction.bind(null, id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
          Edit {vehicle.brand} {vehicle.model}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Stock #{vehicle.stockNumber}</p>
      </div>
      <VehicleForm vehicle={vehicle} action={action} />
    </div>
  );
}
