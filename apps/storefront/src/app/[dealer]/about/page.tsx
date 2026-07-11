import { getDealer } from "@/lib/dealer";

export default async function AboutPage({ params }: { params: Promise<{ dealer: string }> }) {
  const { dealer: slug } = await params;
  const dealer = await getDealer(slug);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About {dealer.businessName}</h1>
      <p className="mt-4 whitespace-pre-line text-gray-600 dark:text-gray-300">
        {dealer.storefrontSettings?.about ?? `${dealer.businessName} is committed to providing quality used vehicles with transparent pricing and honest service.`}
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-5 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Location</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {[dealer.address, dealer.city, dealer.country].filter(Boolean).join(", ") || "Contact us for our location."}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 p-5 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Contact</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{dealer.phone ?? "See contact page"}</p>
        </div>
      </div>
    </div>
  );
}
