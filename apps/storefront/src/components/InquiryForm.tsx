"use client";

import { useActionState } from "react";
import { submitInquiryAction, FormState } from "@/app/actions/customer";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-gray-900 dark:text-white";

export default function InquiryForm({ dealer, vehicleId, defaultMessage }: { dealer: string; vehicleId?: string; defaultMessage?: string }) {
  const action = submitInquiryAction.bind(null, dealer);
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  if (state.success) {
    return <p className="rounded-lg bg-success-50 px-4 py-3 text-sm text-success-700 dark:bg-success-500/10 dark:text-success-400">Thanks! We&apos;ll get back to you shortly.</p>;
  }

  return (
    <form action={formAction} className="space-y-3">
      {vehicleId && <input type="hidden" name="vehicleId" value={vehicleId} />}
      {state.error && <p className="text-sm text-error-500">{state.error}</p>}
      <input name="customerName" type="text" placeholder="Your name" required className={inputClass} />
      <input name="phone" type="text" placeholder="Phone number" className={inputClass} />
      <input name="email" type="email" placeholder="Email (optional)" className={inputClass} />
      <textarea name="message" rows={3} placeholder="Your message" defaultValue={defaultMessage} required className={inputClass} />
      <button type="submit" disabled={pending} className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
        {pending ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
