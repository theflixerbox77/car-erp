import { notFound } from "next/navigation";
import { publicApi, customerApi, ApiError } from "@/lib/api";
import { getCustomerToken } from "@/lib/session";
import VehicleGallery from "@/components/VehicleGallery";
import InquiryForm from "@/components/InquiryForm";
import ReserveButton from "@/components/ReserveButton";
import WishlistToggle from "@/components/WishlistToggle";
import type { PublicVehicle } from "@/lib/types";

interface VehicleDetailResponse {
  tenant: { businessName: string; whatsappNumber: string | null };
  vehicle: {
    id: string;
    stockNumber: string;
    vin: string | null;
    brand: string;
    model: string;
    trim: string | null;
    year: number;
    fuelType: string | null;
    transmission: string | null;
    driveType: string | null;
    mileage: number | null;
    color: string | null;
    condition: string | null;
    bodyType: string | null;
    features: string[];
    sellingPrice: string | null;
    status: string;
    media: { id: string; type: "image" | "video" | "360"; url: string; isPrimary: boolean }[];
  };
}

function money(value: string | null) {
  if (value == null) return "Ask for price";
  return `৳${new Intl.NumberFormat("en-US").format(Number(value))}`;
}

function Spec({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-gray-100 py-2.5 text-sm last:border-0 dark:border-white/5">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-800 dark:text-white">{value ?? "—"}</span>
    </div>
  );
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ dealer: string; id: string }> }) {
  const { dealer: slug, id } = await params;

  let data: VehicleDetailResponse;
  try {
    data = await publicApi.get<VehicleDetailResponse>(`/storefront/${slug}/vehicles/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
  const { vehicle } = data;

  const customerToken = await getCustomerToken();
  const isLoggedIn = Boolean(customerToken);
  let initiallySaved = false;
  if (isLoggedIn) {
    try {
      const wishlist = await customerApi.get<PublicVehicle[]>("/storefront/account/wishlist");
      initiallySaved = wishlist.some((v) => v.id === vehicle.id);
    } catch {
      // Expired/invalid token -- treat as logged out for this check, login page will re-auth.
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VehicleGallery media={vehicle.media} title={`${vehicle.brand} ${vehicle.model}`} />

          <div className="mt-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {vehicle.brand} {vehicle.model} {vehicle.trim ?? ""} ({vehicle.year})
            </h1>
            <p className="mt-1 text-2xl font-bold text-brand-600 dark:text-brand-400">{money(vehicle.sellingPrice)}</p>

            <div className="mt-6 rounded-2xl border border-gray-200 p-5 dark:border-white/10">
              <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Specifications</h2>
              <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                <div>
                  <Spec label="Mileage" value={vehicle.mileage != null ? `${new Intl.NumberFormat("en-US").format(vehicle.mileage)} km` : null} />
                  <Spec label="Fuel Type" value={vehicle.fuelType} />
                  <Spec label="Transmission" value={vehicle.transmission} />
                  <Spec label="Drive Type" value={vehicle.driveType} />
                </div>
                <div>
                  <Spec label="Color" value={vehicle.color} />
                  <Spec label="Condition" value={vehicle.condition} />
                  <Spec label="Body Type" value={vehicle.bodyType} />
                  <Spec label="Stock #" value={vehicle.stockNumber} />
                </div>
              </div>
            </div>

            {vehicle.features?.length > 0 && (
              <div className="mt-6 rounded-2xl border border-gray-200 p-5 dark:border-white/10">
                <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((f) => (
                    <span key={f} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-white/5 dark:text-gray-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 p-5 dark:border-white/10">
            <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Interested in this car?</h2>
            <div className="space-y-3">
              <WishlistToggle dealer={slug} vehicleId={vehicle.id} isLoggedIn={isLoggedIn} initiallySaved={initiallySaved} />
              <ReserveButton dealer={slug} vehicleId={vehicle.id} label="Reserve This Vehicle" type="reservation" />
              <ReserveButton dealer={slug} vehicleId={vehicle.id} label="Book a Test Drive" type="test_drive" />
              {data.tenant.whatsappNumber && (
                <a
                  href={`https://wa.me/${data.tenant.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in the ${vehicle.brand} ${vehicle.model} (Stock #${vehicle.stockNumber})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg bg-[#25D366] py-2.5 text-center text-sm font-semibold text-white hover:opacity-90"
                >
                  Ask on WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 p-5 dark:border-white/10">
            <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Send an Inquiry</h2>
            <InquiryForm dealer={slug} vehicleId={vehicle.id} defaultMessage={`I'm interested in the ${vehicle.brand} ${vehicle.model}.`} />
          </div>
        </div>
      </div>
    </div>
  );
}
