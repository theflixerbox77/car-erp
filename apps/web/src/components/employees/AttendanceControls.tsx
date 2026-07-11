"use client";

import React, { useTransition } from "react";
import { checkInAction, checkOutAction } from "@/app/actions/ops";

export default function AttendanceControls({ employeeId, todayRecord }: { employeeId: string; todayRecord?: { checkInTime: string | null; checkOutTime: string | null } }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={isPending || !!todayRecord?.checkInTime}
        onClick={() => startTransition(() => checkInAction(employeeId))}
        className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
      >
        Check In
      </button>
      <button
        type="button"
        disabled={isPending || !todayRecord?.checkInTime || !!todayRecord?.checkOutTime}
        onClick={() => startTransition(() => checkOutAction(employeeId))}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
      >
        Check Out
      </button>
    </div>
  );
}
