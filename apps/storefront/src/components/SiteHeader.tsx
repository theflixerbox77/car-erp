import Link from "next/link";
import type { DealerProfile } from "@/lib/types";

export default function SiteHeader({ dealer }: { dealer: DealerProfile }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-gray-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={`/${dealer.slug}`} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            {dealer.businessName.slice(0, 1).toUpperCase()}
          </span>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{dealer.businessName}</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300 md:flex">
          <Link href={`/${dealer.slug}/cars`} className="hover:text-brand-600 dark:hover:text-brand-400">
            Browse Cars
          </Link>
          <Link href={`/${dealer.slug}/about`} className="hover:text-brand-600 dark:hover:text-brand-400">
            About
          </Link>
          <Link href={`/${dealer.slug}/contact`} className="hover:text-brand-600 dark:hover:text-brand-400">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href={`/${dealer.slug}/account/wishlist`}
            className="hidden text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400 sm:block"
          >
            My Account
          </Link>
          <Link
            href={`/${dealer.slug}/cars`}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
          >
            View Inventory
          </Link>
        </div>
      </div>
    </header>
  );
}
