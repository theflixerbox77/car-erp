import SettingsTabs from "@/components/settings/SettingsTabs";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your profile, business, and team.</p>
      </div>
      <SettingsTabs />
      {children}
    </div>
  );
}
