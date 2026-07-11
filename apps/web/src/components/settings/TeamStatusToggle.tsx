"use client";

import { useTransition } from "react";
import { updateTeamMemberStatusAction } from "@/app/actions/settings";

export default function TeamStatusToggle({ id, status }: { id: string; status: "active" | "suspended" }) {
  const [isPending, startTransition] = useTransition();
  const next = status === "active" ? "suspended" : "active";

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => updateTeamMemberStatusAction(id, next))}
      className={`rounded-md px-2.5 py-1 text-xs font-medium disabled:opacity-60 ${
        status === "active"
          ? "bg-error-50 text-error-600 hover:bg-error-100 dark:bg-error-500/10 dark:text-error-400"
          : "bg-success-50 text-success-600 hover:bg-success-100 dark:bg-success-500/10 dark:text-success-400"
      }`}
    >
      {status === "active" ? "Suspend" : "Reactivate"}
    </button>
  );
}
