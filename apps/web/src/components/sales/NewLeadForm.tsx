"use client";

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import React, { useActionState } from "react";
import { createLeadAction, ActionState } from "@/app/actions/sales";
import type { Customer } from "@/lib/types/sales";
import type { Vehicle } from "@/lib/types/vehicle";

export default function NewLeadForm({
  customers,
  vehicles,
  defaultCustomerId,
}: {
  customers: Customer[];
  vehicles: Vehicle[];
  defaultCustomerId?: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createLeadAction, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      {state.error && (
        <div className="rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          {state.error}
        </div>
      )}
      <div>
        <Label>
          Customer<span className="text-error-500">*</span>
        </Label>
        <select
          name="customerId"
          required
          defaultValue={defaultCustomerId}
          className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-700 dark:text-white/90"
        >
          <option value="">Select a customer...</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName} {c.phone ? `(${c.phone})` : ""}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Vehicle of interest</Label>
        <select
          name="vehicleId"
          className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-700 dark:text-white/90"
        >
          <option value="">General inquiry (no specific vehicle)</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.brand} {v.model} ({v.year}) — #{v.stockNumber}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Source</Label>
        <Input name="source" type="text" placeholder="walk_in, facebook, whatsapp..." />
      </div>
      <Button size="sm" disabled={pending}>
        {pending ? "Creating..." : "Create Lead"}
      </Button>
    </form>
  );
}
