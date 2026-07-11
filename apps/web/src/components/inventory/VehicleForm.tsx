"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import React, { useActionState } from "react";
import type { Vehicle } from "@/lib/types/vehicle";
import type { VehicleFormState } from "@/app/actions/vehicles";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">{title}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function Field({ label, name, type = "text", defaultValue, required }: { label: string; name: string; type?: string; defaultValue?: string | number | null; required?: boolean }) {
  return (
    <div>
      <Label>
        {label}
        {required && <span className="text-error-500">*</span>}
      </Label>
      <Input name={name} type={type} defaultValue={defaultValue ?? undefined} />
    </div>
  );
}

export default function VehicleForm({
  vehicle,
  action,
}: {
  vehicle?: Vehicle;
  action: (prevState: VehicleFormState, formData: FormData) => Promise<VehicleFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          {state.error}
        </div>
      )}

      <Section title="Identification">
        <Field label="Stock Number" name="stockNumber" defaultValue={vehicle?.stockNumber} required />
        <Field label="VIN" name="vin" defaultValue={vehicle?.vin} />
        <Field label="Chassis Number" name="chassisNumber" defaultValue={vehicle?.chassisNumber} />
        <Field label="Engine Number" name="engineNumber" defaultValue={vehicle?.engineNumber} />
        <Field label="Registration Number" name="registrationNumber" defaultValue={vehicle?.registrationNumber} />
        <Field label="Registration Expiry" name="registrationExpiry" type="date" defaultValue={vehicle?.registrationExpiry?.slice(0, 10)} />
      </Section>

      <Section title="Specifications">
        <Field label="Brand" name="brand" defaultValue={vehicle?.brand} required />
        <Field label="Model" name="model" defaultValue={vehicle?.model} required />
        <Field label="Trim" name="trim" defaultValue={vehicle?.trim} />
        <Field label="Year" name="year" type="number" defaultValue={vehicle?.year} required />
        <Field label="Mileage (km)" name="mileage" type="number" defaultValue={vehicle?.mileage} />
        <Field label="Color" name="color" defaultValue={vehicle?.color} />
        <Field label="Condition" name="condition" defaultValue={vehicle?.condition} />
        <Field label="Body Type" name="bodyType" defaultValue={vehicle?.bodyType} />
        <Field label="Fuel Type" name="fuelType" defaultValue={vehicle?.fuelType} />
        <Field label="Transmission" name="transmission" defaultValue={vehicle?.transmission} />
        <Field label="Drive Type" name="driveType" defaultValue={vehicle?.driveType} />
        <Field label="Auction Grade" name="auctionGrade" defaultValue={vehicle?.auctionGrade} />
      </Section>

      <Section title="Pricing">
        <Field label="Import Cost" name="importCost" type="number" defaultValue={vehicle?.importCost} />
        <Field label="Auction Cost" name="auctionCost" type="number" defaultValue={vehicle?.auctionCost} />
        <Field label="Shipping Cost" name="shippingCost" type="number" defaultValue={vehicle?.shippingCost} />
        <Field label="Customs Cost" name="customsCost" type="number" defaultValue={vehicle?.customsCost} />
        <Field label="Repair Cost" name="repairCost" type="number" defaultValue={vehicle?.repairCost} />
        <Field label="Registration Cost" name="registrationCost" type="number" defaultValue={vehicle?.registrationCost} />
        <Field label="Selling Price" name="sellingPrice" type="number" defaultValue={vehicle?.sellingPrice} />
        <Field label="Minimum Price" name="minimumPrice" type="number" defaultValue={vehicle?.minimumPrice} />
        <Field label="Discount Amount" name="discountAmount" type="number" defaultValue={vehicle?.discountAmount} />
      </Section>

      <div className="flex justify-end gap-3">
        <Button size="sm" disabled={pending}>
          {pending ? "Saving..." : vehicle ? "Save changes" : "Create vehicle"}
        </Button>
      </div>
    </form>
  );
}
