import Image from "next/image";
import Link from "next/link";
import type { PublicVehicle } from "@/lib/types";

function money(value: string | null) {
  if (value == null) return "Ask for price";
  return `৳${new Intl.NumberFormat("en-US").format(Number(value))}`;
}

export default function VehicleCard({ dealer, vehicle }: { dealer: string; vehicle: PublicVehicle }) {
  const primary = vehicle.media.find((m) => m.isPrimary) ?? vehicle.media[0];

  return (
    <Link
      href={`/${dealer}/cars/${vehicle.id}`}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-gray-900"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {primary ? (
          <Image
            src={primary.url}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">No photo yet</div>
        )}
        {vehicle.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-semibold text-white">Featured</span>
        )}
        {vehicle.status !== "available" && (
          <span className="absolute right-3 top-3 rounded-full bg-gray-900/80 px-2.5 py-1 text-xs font-semibold capitalize text-white">{vehicle.status}</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {vehicle.brand} {vehicle.model} {vehicle.trim ?? ""}
        </h3>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          {vehicle.year} {vehicle.mileage != null && `· ${new Intl.NumberFormat("en-US").format(vehicle.mileage)} km`} {vehicle.transmission && `· ${vehicle.transmission}`}
        </p>
        <p className="mt-3 text-lg font-bold text-brand-600 dark:text-brand-400">{money(vehicle.sellingPrice)}</p>
      </div>
    </Link>
  );
}
