"use client";

import { useActionState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { changePasswordAction, type ActionState } from "@/app/actions/settings";

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(changePasswordAction, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">Change Password</h2>
      {state.error && (
        <div className="rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-lg border border-success-500/30 bg-success-50 px-4 py-3 text-sm text-success-600 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400">
          Password changed.
        </div>
      )}
      <div>
        <Label>Current Password</Label>
        <Input name="currentPassword" type="password" />
      </div>
      <div>
        <Label>New Password</Label>
        <Input name="newPassword" type="password" hint="At least 8 characters." />
      </div>
      <Button size="sm" disabled={pending}>
        {pending ? "Saving..." : "Change Password"}
      </Button>
    </form>
  );
}
