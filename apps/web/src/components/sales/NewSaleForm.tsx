"use client";

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import React, { useActionState } from "react";
import { createSaleAction, ActionState } from "@/app/actions/sales";
import type { Customer } from "@/lib/types/sales";
import type { Vehicle } from "@/lib/types/vehicle";

export default function NewSaleForm({
  customers,
  vehicles,
  defaults,
}: {
  customers: Customer[];
  vehicles: Vehicle[];
  defaults: { leadId?: string; customerId?: string; vehicleId?: string };
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createSaleAction, {});
  const selectClass = "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-700 dark:text-white/90";

  return (
    <form action={formAction} className="max-w-2xl space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      {state.error && (
        <div className="rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          {state.error}
        </div>
      )}
      {defaults.leadId && <input type="hidden" name="leadId" value={defaults.leadId} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>
            Customer<span className="text-error-500">*</span>
          </Label>
          <select name="customerId" required defaultValue={defaults.customerId} className={selectClass}>
            <option value="">Select...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>
            Vehicle<span className="text-error-500">*</span>
          </Label>
          <select name="vehicleId" required defaultValue={defaults.vehicleId} className={selectClass}>
            <option value="">Select...</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand} {v.model} ({v.year}) — #{v.stockNumber}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>
            Sale Price<span className="text-error-500">*</span>
          </Label>
          <Input name="salePrice" type="number" />
        </div>
        <div>
          <Label>Discount</Label>
          <Input name="discount" type="number" />
        </div>
        <div>
          <Label>Commission Rate (%)</Label>
          <Input name="commissionRate" type="number" />
        </div>
        <div>
          <Label>Delivery Date</Label>
          <Input name="deliveryDate" type="date" />
        </div>
        <div>
          <Label>Warranty (months)</Label>
          <Input name="warrantyMonths" type="number" />
        </div>
      </div>
      <Button size="sm" disabled={pending}>
        {pending ? "Creating..." : "Create Sale"}
      </Button>
    </form>
  );
}
