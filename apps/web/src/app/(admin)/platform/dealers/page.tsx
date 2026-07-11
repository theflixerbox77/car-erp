import { Metadata } from "next";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import DealerActions from "@/components/platform/DealerActions";
import type { PlatformDealer } from "@/lib/types/platform";

export const metadata: Metadata = { title: "Dealers" };

const STATUS_BADGE: Record<PlatformDealer["subscriptionStatus"], "warning" | "success" | "error" | "light"> = {
  pending_approval: "warning",
  active: "success",
  suspended: "error",
  cancelled: "light",
};

export default async function PlatformDealersPage() {
  const dealers = await api.get<PlatformDealer[]>("/platform/dealers");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Dealers</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{dealers.length} dealer{dealers.length === 1 ? "" : "s"} on the platform</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Business
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  URL
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Plan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Registered
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {""}
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {dealers.length === 0 && (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No dealers yet.</TableCell>
                </TableRow>
              )}
              {dealers.map((dealer) => (
                <TableRow key={dealer.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">{dealer.businessName}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">/{dealer.slug}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm capitalize dark:text-gray-400">{dealer.subscriptionPlan}</TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge size="sm" color={STATUS_BADGE[dealer.subscriptionStatus]}>
                      {dealer.subscriptionStatus.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(dealer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <DealerActions dealer={dealer} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
