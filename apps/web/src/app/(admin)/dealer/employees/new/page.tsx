"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import React, { useActionState } from "react";
import { createEmployeeAction, EmployeeFormState } from "@/app/actions/ops";

export default function NewEmployeePage() {
  const [state, formAction, pending] = useActionState<EmployeeFormState, FormData>(createEmployeeAction, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Add Employee</h1>
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
            <Label>Hire Date</Label>
            <Input name="hireDate" type="date" />
          </div>
          <div>
            <Label>Salary Type</Label>
            <select name="salaryType" className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-700 dark:text-white/90">
              <option value="">—</option>
              <option value="fixed">Fixed</option>
              <option value="commission">Commission</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <Label>Salary Amount</Label>
            <Input name="salaryAmount" type="number" />
          </div>
          <div>
            <Label>Commission Rate (%)</Label>
            <Input name="commissionRate" type="number" />
          </div>
        </div>
        <Button size="sm" disabled={pending}>
          {pending ? "Saving..." : "Save Employee"}
        </Button>
      </form>
    </div>
  );
}
