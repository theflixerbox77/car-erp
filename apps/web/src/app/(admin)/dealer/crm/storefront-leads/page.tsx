import { Metadata } from "next";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import StatusSelect from "@/components/crm/StatusSelect";
import type { Booking, StorefrontInquiry } from "@/lib/types/sales";
import { updateBookingStatusAction, updateInquiryStatusAction } from "@/app/actions/sales";

export const metadata: Metadata = { title: "Storefront Leads" };

const INQUIRY_STATUSES = ["new", "contacted", "converted", "closed"] as const;
const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

export default async function StorefrontLeadsPage() {
  const [inquiries, bookings] = await Promise.all([
    api.get<StorefrontInquiry[]>("/inquiries"),
    api.get<Booking[]>("/bookings"),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Storefront Leads</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Inquiries and bookings submitted through your public storefront.</p>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">Inquiries</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Contact
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Vehicle
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Message
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {inquiries.length === 0 && (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No inquiries yet.</TableCell>
                  </TableRow>
                )}
                {inquiries.map((inq) => (
                  <TableRow key={inq.id}>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">{inq.customerName}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {inq.phone ?? inq.email ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {inq.vehicle ? `${inq.vehicle.brand} ${inq.vehicle.model} (${inq.vehicle.year})` : "General"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {inq.message ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <StatusSelect id={inq.id} status={inq.status} options={INQUIRY_STATUSES} onChange={updateInquiryStatusAction} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">Bookings</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Contact
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Vehicle
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Type
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No bookings yet.</TableCell>
                  </TableRow>
                )}
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">{b.fullName}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{b.phone ?? b.email ?? "—"}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {b.vehicle.brand} {b.vehicle.model} ({b.vehicle.year})
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm capitalize dark:text-gray-400">{b.type}</TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <StatusSelect id={b.id} status={b.status} options={BOOKING_STATUSES} onChange={updateBookingStatusAction} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
