import { Metadata } from "next";
import { api } from "@/lib/api";
import { getCurrentUser } from "@/lib/dal";
import BusinessSettingsForm from "@/components/settings/BusinessSettingsForm";
import type { BusinessSettings } from "@/lib/types/settings";

export const metadata: Metadata = { title: "Business Settings" };

export default async function BusinessSettingsPage() {
  const [user, business] = await Promise.all([getCurrentUser(), api.get<BusinessSettings>("/settings/business")]);
  const canEdit = user?.role?.name === "Owner";

  return <BusinessSettingsForm business={business} canEdit={canEdit} />;
}
