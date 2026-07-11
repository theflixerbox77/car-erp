"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Sales", href: "/dealer/reports/sales" },
  { label: "Profit", href: "/dealer/reports/profit" },
  { label: "Expenses", href: "/dealer/reports/expenses" },
  { label: "Inventory", href: "/dealer/reports/inventory" },
  { label: "Stock Aging", href: "/dealer/reports/stock-aging" },
  { label: "Model Performance", href: "/dealer/reports/model-performance" },
  { label: "Customers", href: "/dealer/reports/customers" },
  { label: "Leads", href: "/dealer/reports/leads" },
];

export default function ReportTabs() {
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
