import { getDealer } from "@/lib/dealer";
import { publicApi } from "@/lib/api";
import type { PublicVehicleListResponse } from "@/lib/types";
import VehicleCard from "@/components/VehicleCard";
import CarFilters from "@/components/CarFilters";

interface SearchParams {
  search?: string;
  brand?: string;
  transmission?: string;
  fuelType?: string;
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  sortBy?: string;
  sortDir?: string;
  [key: string]: string | undefined;
}

export default async function CarsListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ dealer: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { dealer: slug } = await params;
  const sp = await searchParams;
  const dealer = await getDealer(slug);

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value) query.set(key, value);
  }
  query.set("limit", "24");

  const listing = await publicApi.get<PublicVehicleListResponse>(`/storefront/${slug}/vehicles?${query.toString()}`);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Cars</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        {listing.total} vehicle{listing.total === 1 ? "" : "s"} at {dealer.businessName}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <CarFilters current={sp} />
        </div>
        <div className="lg:col-span-3">
          {listing.items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No vehicles match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {listing.items.map((v) => (
                <VehicleCard key={v.id} dealer={slug} vehicle={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
