"use client";

import { useTransition } from "react";
import { updateTeamMemberRoleAction } from "@/app/actions/settings";
import type { TeamRole } from "@/lib/types/settings";

export default function TeamRoleSelect({ id, roleId, roles }: { id: string; roleId: string; roles: TeamRole[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={roleId}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateTeamMemberRoleAction(id, e.target.value))}
      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
    >
      {roles.map((r) => (
        <option key={r.id} value={r.id}>
          {r.name}
        </option>
      ))}
    </select>
  );
}
