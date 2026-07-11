import { getDealer } from "@/lib/dealer";
import InquiryForm from "@/components/InquiryForm";

export default async function ContactPage({ params }: { params: Promise<{ dealer: string }> }) {
  const { dealer: slug } = await params;
  const dealer = await getDealer(slug);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact {dealer.businessName}</h1>
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          {dealer.phone && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</h3>
              <p className="text-gray-800 dark:text-white">{dealer.phone}</p>
            </div>
          )}
          {dealer.whatsappNumber && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">WhatsApp</h3>
              <a
                href={`https://wa.me/${dealer.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                {dealer.whatsappNumber}
              </a>
            </div>
          )}
          {(dealer.address || dealer.city) && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Address</h3>
              <p className="text-gray-800 dark:text-white">{[dealer.address, dealer.city, dealer.country].filter(Boolean).join(", ")}</p>
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-gray-200 p-6 dark:border-white/10">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Send us a message</h2>
          <InquiryForm dealer={slug} />
        </div>
      </div>
    </div>
  );
}
