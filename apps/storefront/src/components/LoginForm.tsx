"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginCustomerAction, FormState } from "@/app/actions/customer";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-gray-900 dark:text-white";

export default function LoginForm({ dealer }: { dealer: string }) {
  const action = loginCustomerAction.bind(null, dealer);
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</h1>
      <form action={formAction} className="mt-6 space-y-4">
        {state.error && <p className="text-sm text-error-500">{state.error}</p>}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</label>
          <input name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Password</label>
          <input name="password" type="password" required className={inputClass} />
        </div>
        <button type="submit" disabled={pending} className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
          {pending ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        No account?{" "}
        <Link href={`/${dealer}/account/register`} className="text-brand-600 hover:text-brand-700 dark:text-brand-400">
          Create one
        </Link>
      </p>
    </div>
  );
}
