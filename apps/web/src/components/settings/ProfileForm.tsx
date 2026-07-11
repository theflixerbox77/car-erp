"use client";

import { useActionState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { updateProfileAction, type ActionState } from "@/app/actions/settings";
import type { CurrentUser } from "@/lib/dal";

export default function ProfileForm({ user }: { user: CurrentUser }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateProfileAction, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">Your Profile</h2>
      {state.error && (
        <div className="rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-lg border border-success-500/30 bg-success-50 px-4 py-3 text-sm text-success-600 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400">
          Profile updated.
        </div>
      )}
      <div>
        <Label>Full Name</Label>
        <Input name="fullName" type="text" defaultValue={user.fullName} />
      </div>
      <div>
        <Label>Email</Label>
        <Input name="email" type="email" defaultValue={user.email} disabled />
      </div>
      <div>
        <Label>Phone</Label>
        <Input name="phone" type="text" defaultValue={user.phone ?? ""} />
      </div>
      <div>
        <Label>Role</Label>
        <Input name="role" type="text" defaultValue={user.role?.name ?? "—"} disabled />
      </div>
      <Button size="sm" disabled={pending}>
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
