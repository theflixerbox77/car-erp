import { Metadata } from "next";
import VehicleForm from "@/components/inventory/VehicleForm";
import { createVehicleAction } from "@/app/actions/vehicles";

export const metadata: Metadata = { title: "Add Vehicle" };

export default function NewVehiclePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Add Vehicle</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Total cost and expected profit are calculated automatically.</p>
      </div>
      <VehicleForm action={createVehicleAction} />
    </div>
  );
}
