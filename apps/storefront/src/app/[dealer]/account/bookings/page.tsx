import { redirect } from "next/navigation";
import { customerApi, ApiError } from "@/lib/api";

interface CustomerBooking {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  vehicle: { brand: string; model: string; year: number; stockNumber: string };
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  converted_to_sale: "Purchased",
};

export default async function BookingsPage({ params }: { params: Promise<{ dealer: string }> }) {
  const { dealer: slug } = await params;

  let bookings: CustomerBooking[];
  try {
    bookings = await customerApi.get<CustomerBooking[]>("/storefront/account/bookings");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) redirect(`/${slug}/account/login`);
    throw err;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No bookings yet.</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => (
            <li key={b.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-white/10">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {b.vehicle.brand} {b.vehicle.model} ({b.vehicle.year})
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {b.type === "test_drive" ? "Test Drive" : "Reservation"} &middot; {new Date(b.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-white/5 dark:text-gray-300">
                {STATUS_LABEL[b.status] ?? b.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
