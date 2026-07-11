"use client";

import React, { useTransition } from "react";
import { deactivateRecurringScheduleAction } from "@/app/actions/ops";
import { TableCell, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import type { RecurringSchedule } from "@/lib/types/ops";

function money(value: string) {
  return new Intl.NumberFormat("en-US").format(Number(value));
}

export default function RecurringScheduleRow({ schedule }: { schedule: RecurringSchedule }) {
  const [isPending, startTransition] = useTransition();

  return (
    <TableRow>
      <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">{schedule.category.name}</TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{money(schedule.amount)}</TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{schedule.frequency}</TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{new Date(schedule.nextRunDate).toLocaleDateString()}</TableCell>
      <TableCell className="px-4 py-3 text-start">
        <Badge size="sm" color={schedule.isActive ? "success" : "light"}>
          {schedule.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="px-4 py-3 text-start">
        {schedule.isActive && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => deactivateRecurringScheduleAction(schedule.id))}
            className="text-xs font-medium text-error-500 hover:text-error-600 disabled:opacity-60"
          >
            Deactivate
          </button>
        )}
      </TableCell>
    </TableRow>
  );
}
