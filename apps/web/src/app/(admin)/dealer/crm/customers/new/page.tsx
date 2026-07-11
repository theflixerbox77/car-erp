"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import React, { useActionState } from "react";
import { createCustomerAction, ActionState } from "@/app/actions/sales";

export default function NewCustomerPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createCustomerAction, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Add Customer</h1>
      </div>
      <form action={formAction} className="max-w-2xl space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        {state.error && (
          <div className="rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            {state.error}
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
            <Label>Phone</Label>
            <Input name="phone" type="text" />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" />
          </div>
          <div>
            <Label>Source</Label>
            <Input name="source" type="text" placeholder="walk_in, facebook, referral..." />
          </div>
          <div>
            <Label>NID Number</Label>
            <Input name="nidNumber" type="text" />
          </div>
          <div>
            <Label>Driving License</Label>
            <Input name="licenseNumber" type="text" />
          </div>
        </div>
        <div>
          <Label>Address</Label>
          <Input name="address" type="text" />
        </div>
        <div>
          <Label>Notes</Label>
          <Input name="notes" type="text" />
        </div>
        <Button size="sm" disabled={pending}>
          {pending ? "Saving..." : "Save Customer"}
        </Button>
      </form>
    </div>
  );
}
