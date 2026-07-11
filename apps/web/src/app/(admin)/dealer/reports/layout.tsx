import ReportTabs from "@/components/reports/ReportTabs";
import React from "react";

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Reports</h1>
      </div>
      <ReportTabs />
      <div className="mt-6">{children}</div>
    </div>
  );
}
