import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { api } from "@/lib/api";
import AdminShell from "@/layout/AdminShell";
import type { AppNotification } from "@/lib/types/ops";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  if (!user.isPlatformAdmin && user.tenant && user.tenant.subscriptionStatus !== "active") {
    redirect("/pending-approval");
  }

  // Platform admins have no tenant, and /notifications is a dealer-scoped route.
  const notifications = user.tenantId ? await api.get<AppNotification[]>("/notifications") : [];

  return (
    <AdminShell user={user} notifications={notifications}>
      {children}
    </AdminShell>
  );
}
