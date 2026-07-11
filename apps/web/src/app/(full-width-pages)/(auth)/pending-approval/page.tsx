import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { logoutAction } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "Pending Approval",
  description: "Your dealer account is awaiting approval",
};

export default async function PendingApprovalPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  if (!user.tenant || user.tenant.subscriptionStatus === "active") redirect("/");

  const isSuspended = user.tenant.subscriptionStatus === "suspended";

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto text-center">
        <h1 className="mb-3 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          {isSuspended ? "Account suspended" : "Almost there"}
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {isSuspended
            ? `${user.tenant.businessName} has been suspended. Contact support if you believe this is a mistake.`
            : `${user.tenant.businessName} is awaiting approval from our team. You'll get access to your dashboard as soon as it's approved — usually within one business day.`}
        </p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            Sign out
          </button>
        </form>
        <Link href="/" className="mt-6 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          Check again
        </Link>
      </div>
    </div>
  );
}
