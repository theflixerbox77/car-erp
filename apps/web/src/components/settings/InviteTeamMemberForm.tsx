"use client";

import { useActionState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { createTeamMemberAction, type ActionState } from "@/app/actions/settings";
import type { TeamRole } from "@/lib/types/settings";

export default function InviteTeamMemberForm({ roles }: { roles: TeamRole[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createTeamMemberAction, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">Add Team Member</h2>
      {state.error && (
        <div className="rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-lg border border-success-500/30 bg-success-50 px-4 py-3 text-sm text-success-600 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400">
          Team member added.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>
            Full Name<span className="text-error-500">*</span>
          </Label>
          <Input name="fullName" type="text" />
        </div>
        <div>
          <Label>
            Email<span className="text-error-500">*</span>
          </Label>
          <Input name="email" type="email" />
        </div>
        <div>
          <Label>
            Temporary Password<span className="text-error-500">*</span>
          </Label>
          <Input name="password" type="password" hint="At least 8 characters. They can change it after logging in." />
        </div>
        <div>
          <Label>Phone</Label>
          <Input name="phone" type="text" />
        </div>
        <div>
          <Label>
            Role<span className="text-error-500">*</span>
          </Label>
          <select name="roleId" className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-700 dark:text-white/90">
            <option value="">Select a role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button size="sm" disabled={pending}>
        {pending ? "Adding..." : "Add Team Member"}
      </Button>
    </form>
  );
}
