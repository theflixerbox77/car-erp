import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
      <p className="max-w-md text-gray-600 dark:text-gray-400">
        We couldn&apos;t find what you were looking for. The dealer or listing may no longer be available.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white hover:bg-brand-600"
      >
        Back to Home
      </Link>
    </div>
  );
}
