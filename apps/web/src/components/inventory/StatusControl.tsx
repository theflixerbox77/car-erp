"use client";

import React, { useTransition } from "react";
import { changeVehicleStatusAction } from "@/app/actions/vehicles";
import { VEHICLE_STATUSES, STATUS_LABELS, type VehicleStatus } from "@/lib/types/vehicle";

export default function StatusControl({ vehicleId, status }: { vehicleId: string; status: VehicleStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => changeVehicleStatusAction(vehicleId, next));
      }}
    >
      {VEHICLE_STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
