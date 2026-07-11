"use client";

import { useActionState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { updateBusinessSettingsAction, type ActionState } from "@/app/actions/settings";
import type { BusinessSettings } from "@/lib/types/settings";

export default function BusinessSettingsForm({ business, canEdit }: { business: BusinessSettings; canEdit: boolean }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateBusinessSettingsAction, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      {!canEdit && (
        <div className="rounded-lg border border-warning-500/30 bg-warning-50 px-4 py-3 text-sm text-warning-600 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400">
          Only the dealership owner can edit business settings. You can view them below.
        </div>
      )}
      {state.error && (
        <div className="rounded-lg border border-error-500/30 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-lg border border-success-500/30 bg-success-50 px-4 py-3 text-sm text-success-600 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400">
          Business settings updated.
        </div>
      )}

      <div>
        <h2 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Business Info</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Dealer URL</Label>
            <Input type="text" defaultValue={`/${business.slug}`} disabled />
          </div>
          <div>
            <Label>Business Name</Label>
            <Input type="text" defaultValue={business.businessName} disabled />
          </div>
          <div>
            <Label>Legal Name</Label>
            <Input name="legalName" type="text" defaultValue={business.legalName ?? ""} disabled={!canEdit} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input name="phone" type="text" defaultValue={business.phone ?? ""} disabled={!canEdit} />
          </div>
          <div>
            <Label>WhatsApp Number</Label>
            <Input name="whatsappNumber" type="text" defaultValue={business.whatsappNumber ?? ""} disabled={!canEdit} />
          </div>
          <div>
            <Label>Logo URL</Label>
            <Input name="logoUrl" type="text" defaultValue={business.logoUrl ?? ""} disabled={!canEdit} />
          </div>
          <div>
            <Label>Address</Label>
            <Input name="address" type="text" defaultValue={business.address ?? ""} disabled={!canEdit} />
          </div>
          <div>
            <Label>City</Label>
            <Input name="city" type="text" defaultValue={business.city ?? ""} disabled={!canEdit} />
          </div>
          <div>
            <Label>Country</Label>
            <Input name="country" type="text" defaultValue={business.country ?? ""} disabled={!canEdit} />
          </div>
          <div>
            <Label>Custom Domain</Label>
            <Input name="customDomain" type="text" defaultValue={business.customDomain ?? ""} disabled={!canEdit} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Storefront</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>About Text</Label>
            <Input name="about" type="text" defaultValue={business.storefrontSettings?.about ?? ""} disabled={!canEdit} hint="Shown on your public storefront's homepage and About page." />
          </div>
          <div>
            <Label>Hero Image URL</Label>
            <Input name="heroImageUrl" type="text" defaultValue={business.storefrontSettings?.heroImageUrl ?? ""} disabled={!canEdit} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Subscription</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Plan</Label>
            <Input type="text" defaultValue={business.subscriptionPlan} disabled />
          </div>
          <div>
            <Label>Status</Label>
            <Input type="text" defaultValue={business.subscriptionStatus} disabled />
          </div>
        </div>
      </div>

      {canEdit && (
        <Button size="sm" disabled={pending}>
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      )}
    </form>
  );
}
