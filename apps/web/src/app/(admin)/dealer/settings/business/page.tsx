import { Metadata } from "next";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { getCurrentUser } from "@/lib/dal";
import BusinessSettingsForm from "@/components/settings/BusinessSettingsForm";
import type { BusinessSettings } from "@/lib/types/settings";

export const metadata: Metadata = { title: "Business Settings" };

export default async function BusinessSettingsPage() {
  const user = await getCurrentUser();
  // Platform admins have no tenant, so /settings/business (TenantScopedGuard) isn't reachable for them.
  if (user?.isPlatformAdmin) redirect("/dealer/settings/profile");

  const business = await api.get<BusinessSettings>("/settings/business");
  const canEdit = user?.role?.name === "Owner";

  return <BusinessSettingsForm business={business} canEdit={canEdit} />;
}
