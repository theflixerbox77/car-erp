import { Metadata } from "next";
import { getCurrentUser } from "@/lib/dal";
import ProfileForm from "@/components/settings/ProfileForm";
import ChangePasswordForm from "@/components/settings/ChangePasswordForm";

export const metadata: Metadata = { title: "Profile Settings" };

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <ProfileForm user={user} />
      <ChangePasswordForm />
    </div>
  );
}
