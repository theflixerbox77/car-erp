"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerCustomerAction, FormState } from "@/app/actions/customer";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-gray-900 dark:text-white";

export default function RegisterForm({ dealer }: { dealer: string }) {
  const action = registerCustomerAction.bind(null, dealer);
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
      <form action={formAction} className="mt-6 space-y-4">
        {state.error && <p className="text-sm text-error-500">{state.error}</p>}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Full Name</label>
          <input name="fullName" type="text" required className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</label>
          <input name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone</label>
          <input name="phone" type="text" className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Password (min 8 characters)</label>
          <input name="password" type="password" required minLength={8} className={inputClass} />
        </div>
        <button type="submit" disabled={pending} className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
          {pending ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link href={`/${dealer}/account/login`} className="text-brand-600 hover:text-brand-700 dark:text-brand-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
