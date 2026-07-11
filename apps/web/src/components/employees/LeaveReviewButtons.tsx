"use client";

import React, { useTransition } from "react";
import { reviewLeaveRequestAction } from "@/app/actions/ops";

export default function LeaveReviewButtons({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => reviewLeaveRequestAction(id, "approve"))}
        className="rounded-md bg-success-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-success-600 disabled:opacity-60"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => reviewLeaveRequestAction(id, "reject"))}
        className="rounded-md bg-error-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-error-600 disabled:opacity-60"
      >
        Reject
      </button>
    </div>
  );
}
