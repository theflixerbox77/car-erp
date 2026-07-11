import Link from "next/link";
import { Metadata } from "next";
import { api } from "@/lib/api";
import Badge from "@/components/ui/badge/Badge";
import type { Vehicle } from "@/lib/types/vehicle";
import { STATUS_BADGE_COLOR, STATUS_LABELS } from "@/lib/types/vehicle";
import MediaUploader from "@/components/inventory/MediaUploader";
import StatusControl from "@/components/inventory/StatusControl";
import DeleteVehicleButton from "@/components/inventory/DeleteVehicleButton";

export const metadata: Metadata = { title: "Vehicle Detail" };

function money(value: string | null) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US").format(Number(value));
}

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-gray-100 py-2 text-sm last:border-0 dark:border-white/[0.05]">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-800 dark:text-white/90">{value ?? "—"}</span>
    </div>
  );
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await api.get<Vehicle>(`/vehicles/${id}`);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
              {vehicle.brand} {vehicle.model} {vehicle.trim ?? ""} ({vehicle.year})
            </h1>
            <Badge size="sm" color={STATUS_BADGE_COLOR[vehicle.status]}>
              {STATUS_LABELS[vehicle.status]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Stock #{vehicle.stockNumber}</p>
        </div>
        <div className="flex items-center gap-4">
          <StatusControl vehicleId={vehicle.id} status={vehicle.status} />
          <Link href={`/dealer/inventory/${vehicle.id}/edit`} className="text-sm font-medium text-brand-500 hover:text-brand-600">
            Edit
          </Link>
          <DeleteVehicleButton vehicleId={vehicle.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <MediaUploader vehicleId={vehicle.id} media={vehicle.media ?? []} />

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Specifications</h3>
            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              <div>
                <SpecRow label="VIN" value={vehicle.vin} />
                <SpecRow label="Chassis Number" value={vehicle.chassisNumber} />
                <SpecRow label="Engine Number" value={vehicle.engineNumber} />
                <SpecRow label="Mileage" value={vehicle.mileage != null ? `${new Intl.NumberFormat("en-US").format(vehicle.mileage)} km` : null} />
                <SpecRow label="Color" value={vehicle.color} />
                <SpecRow label="Condition" value={vehicle.condition} />
              </div>
              <div>
                <SpecRow label="Fuel Type" value={vehicle.fuelType} />
                <SpecRow label="Transmission" value={vehicle.transmission} />
                <SpecRow label="Drive Type" value={vehicle.driveType} />
                <SpecRow label="Body Type" value={vehicle.bodyType} />
                <SpecRow label="Auction Grade" value={vehicle.auctionGrade} />
                <SpecRow label="Registration #" value={vehicle.registrationNumber} />
              </div>
            </div>
          </div>

          {vehicle.statusHistory && vehicle.statusHistory.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Status History</h3>
              <ul className="space-y-3">
                {vehicle.statusHistory.map((entry) => (
                  <li key={entry.id} className="text-sm">
                    <span className="text-gray-800 dark:text-white/90">
                      {entry.fromStatus ? `${STATUS_LABELS[entry.fromStatus as keyof typeof STATUS_LABELS] ?? entry.fromStatus} → ` : ""}
                      {STATUS_LABELS[entry.toStatus as keyof typeof STATUS_LABELS] ?? entry.toStatus}
                    </span>
                    <span className="ml-2 text-gray-400">{new Date(entry.createdAt).toLocaleString()}</span>
                    {entry.note && <p className="text-gray-500 dark:text-gray-400">{entry.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Pricing &amp; Costs</h3>
            <SpecRow label="Import Cost" value={money(vehicle.importCost)} />
            <SpecRow label="Auction Cost" value={money(vehicle.auctionCost)} />
            <SpecRow label="Shipping Cost" value={money(vehicle.shippingCost)} />
            <SpecRow label="Customs Cost" value={money(vehicle.customsCost)} />
            <SpecRow label="Repair Cost" value={money(vehicle.repairCost)} />
            <SpecRow label="Registration Cost" value={money(vehicle.registrationCost)} />
            <div className="my-2 border-t border-gray-200 dark:border-white/[0.05]" />
            <SpecRow label="Total Cost" value={<span className="font-semibold">{money(vehicle.totalCost)}</span>} />
            <SpecRow label="Selling Price" value={money(vehicle.sellingPrice)} />
            <SpecRow label="Minimum Price" value={money(vehicle.minimumPrice)} />
            <SpecRow label="Discount" value={money(vehicle.discountAmount)} />
            <SpecRow
              label="Expected Profit"
              value={
                <span className={Number(vehicle.expectedProfit ?? 0) >= 0 ? "font-semibold text-success-600" : "font-semibold text-error-500"}>
                  {money(vehicle.expectedProfit)}
                </span>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
