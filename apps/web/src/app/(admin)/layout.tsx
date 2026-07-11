import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import AdminShell from "@/layout/AdminShell";

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

  return <AdminShell user={user}>{children}</AdminShell>;
}
