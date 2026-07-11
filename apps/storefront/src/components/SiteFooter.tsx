import Link from "next/link";
import type { DealerProfile } from "@/lib/types";

export default function SiteFooter({ dealer }: { dealer: DealerProfile }) {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dealer.businessName}</h3>
            {dealer.address && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{dealer.address}</p>}
            {(dealer.city || dealer.country) && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {[dealer.city, dealer.country].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>
                <Link href={`/${dealer.slug}/cars`} className="hover:text-brand-600 dark:hover:text-brand-400">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href={`/${dealer.slug}/about`} className="hover:text-brand-600 dark:hover:text-brand-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={`/${dealer.slug}/contact`} className="hover:text-brand-600 dark:hover:text-brand-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Get in Touch</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {dealer.phone && <li>{dealer.phone}</li>}
              {dealer.whatsappNumber && (
                <li>
                  <a
                    href={`https://wa.me/${dealer.whatsappNumber.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    WhatsApp: {dealer.whatsappNumber}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200 pt-6 text-xs text-gray-400 dark:border-white/10">
          &copy; {new Date().getFullYear()} {dealer.businessName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
