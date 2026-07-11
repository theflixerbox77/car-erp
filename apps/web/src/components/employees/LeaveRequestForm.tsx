"use client";

import React, { useRef, useTransition } from "react";
import { createLeaveRequestAction } from "@/app/actions/ops";

export default function LeaveRequestForm({ employeeId }: { employeeId: string }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await createLeaveRequestAction(employeeId, formData);
          formRef.current?.reset();
        });
      }}
      className="grid grid-cols-2 gap-2 sm:grid-cols-5"
    >
      <select name="type" className="h-9 rounded-lg border border-gray-300 bg-white px-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
        <option value="sick">Sick</option>
        <option value="casual">Casual</option>
        <option value="annual">Annual</option>
        <option value="other">Other</option>
      </select>
      <input name="startDate" type="date" required className="h-9 rounded-lg border border-gray-300 bg-transparent px-2 text-sm dark:border-gray-700 dark:text-white/90" />
      <input name="endDate" type="date" required className="h-9 rounded-lg border border-gray-300 bg-transparent px-2 text-sm dark:border-gray-700 dark:text-white/90" />
      <input name="reason" type="text" placeholder="Reason" className="h-9 rounded-lg border border-gray-300 bg-transparent px-2 text-sm dark:border-gray-700 dark:text-white/90" />
      <button type="submit" disabled={isPending} className="h-9 rounded-lg bg-brand-500 px-3 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60">
        {isPending ? "..." : "Request"}
      </button>
    </form>
  );
}
