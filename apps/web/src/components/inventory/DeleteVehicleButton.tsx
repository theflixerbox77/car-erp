"use client";

import React, { useTransition } from "react";
import { deleteVehicleAction } from "@/app/actions/vehicles";

export default function DeleteVehicleButton({ vehicleId }: { vehicleId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      className="text-sm font-medium text-error-500 hover:text-error-600 disabled:opacity-60"
      onClick={() => {
        if (confirm("Delete this vehicle? This cannot be undone.")) {
          startTransition(() => deleteVehicleAction(vehicleId));
        }
      }}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
