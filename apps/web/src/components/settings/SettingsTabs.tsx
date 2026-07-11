"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Profile", href: "/dealer/settings/profile" },
  { label: "Business", href: "/dealer/settings/business" },
  { label: "Team", href: "/dealer/settings/team" },
];

export default function SettingsTabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 dark:border-white/[0.05]">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              active ? "bg-brand-500 text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
