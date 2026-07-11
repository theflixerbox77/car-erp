import Link from "next/link";
import { getDealer } from "@/lib/dealer";
import { publicApi } from "@/lib/api";
import type { PublicVehicleListResponse } from "@/lib/types";
import VehicleCard from "@/components/VehicleCard";

export default async function DealerHomePage({ params }: { params: Promise<{ dealer: string }> }) {
  const { dealer: slug } = await params;
  const dealer = await getDealer(slug);

  const listing = await publicApi.get<PublicVehicleListResponse>(`/storefront/${slug}/vehicles?limit=8&sortBy=created_at&sortDir=desc`);
  const featuredCars = listing.items.filter((v) => v.isFeatured).slice(0, 4);
  const latestCars = listing.items.slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Find your next car at {dealer.businessName}</h1>
            <p className="mt-4 text-lg text-brand-50/90">
              {dealer.storefrontSettings?.about ?? "Quality used vehicles, inspected and ready to drive. Browse our full inventory below."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={`/${slug}/cars`} className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50">
                Browse Inventory
              </Link>
              <Link href={`/${slug}/contact`} className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {featuredCars.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Vehicles</h2>
            <Link href={`/${slug}/cars`} className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCars.map((v) => (
              <VehicleCard key={v.id} dealer={slug} vehicle={v} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Arrivals</h2>
          <Link href={`/${slug}/cars`} className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
            View all &rarr;
          </Link>
        </div>
        {latestCars.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No vehicles listed yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latestCars.map((v) => (
              <VehicleCard key={v.id} dealer={slug} vehicle={v} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
