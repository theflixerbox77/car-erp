"use client";

import { useTransition } from "react";
import { approveDealerAction, reactivateDealerAction, suspendDealerAction } from "@/app/actions/platform";
import type { PlatformDealer } from "@/lib/types/platform";

export default function DealerActions({ dealer }: { dealer: PlatformDealer }) {
  const [isPending, startTransition] = useTransition();

  if (dealer.subscriptionStatus === "pending_approval") {
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => approveDealerAction(dealer.id))}
        className="rounded-md bg-success-50 px-2.5 py-1 text-xs font-medium text-success-600 hover:bg-success-100 disabled:opacity-60 dark:bg-success-500/10 dark:text-success-400"
      >
        Approve
      </button>
    );
  }

  if (dealer.subscriptionStatus === "active") {
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => suspendDealerAction(dealer.id))}
        className="rounded-md bg-error-50 px-2.5 py-1 text-xs font-medium text-error-600 hover:bg-error-100 disabled:opacity-60 dark:bg-error-500/10 dark:text-error-400"
      >
        Suspend
      </button>
    );
  }

  if (dealer.subscriptionStatus === "suspended") {
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => reactivateDealerAction(dealer.id))}
        className="rounded-md bg-success-50 px-2.5 py-1 text-xs font-medium text-success-600 hover:bg-success-100 disabled:opacity-60 dark:bg-success-500/10 dark:text-success-400"
      >
        Reactivate
      </button>
    );
  }

  return null;
}
