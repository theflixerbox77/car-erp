import { redirect } from "next/navigation";
import { customerApi, ApiError } from "@/lib/api";
import { logoutCustomerAction } from "@/app/actions/customer";
import VehicleCard from "@/components/VehicleCard";
import type { PublicVehicle } from "@/lib/types";

export default async function WishlistPage({ params }: { params: Promise<{ dealer: string }> }) {
  const { dealer: slug } = await params;

  let wishlist: PublicVehicle[];
  try {
    wishlist = await customerApi.get<PublicVehicle[]>("/storefront/account/wishlist");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) redirect(`/${slug}/account/login`);
    throw err;
  }

  const logout = logoutCustomerAction.bind(null, slug);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
        <div className="flex gap-4 text-sm">
          <a href={`/${slug}/account/bookings`} className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
            My Bookings
          </a>
          <form action={logout}>
            <button type="submit" className="font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
              Sign Out
            </button>
          </form>
        </div>
      </div>
      {wishlist.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No saved cars yet. Browse{" "}
          <a href={`/${slug}/cars`} className="text-brand-600 hover:text-brand-700 dark:text-brand-400">
            our inventory
          </a>{" "}
          and save your favorites.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((v) => (
            <VehicleCard key={v.id} dealer={slug} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  );
}
