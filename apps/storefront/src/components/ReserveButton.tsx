"use client";

import { useActionState, useState } from "react";
import { submitReservationAction, FormState } from "@/app/actions/customer";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-gray-900 dark:text-white";

export default function ReserveButton({ dealer, vehicleId, label, type }: { dealer: string; vehicleId: string; label: string; type: "reservation" | "test_drive" }) {
  const [open, setOpen] = useState(false);
  const action = submitReservationAction.bind(null, dealer);
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-brand-500 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
      >
        {label}
      </button>
    );
  }

  if (state.success) {
    return <p className="rounded-lg bg-success-50 px-4 py-3 text-sm text-success-700 dark:bg-success-500/10 dark:text-success-400">Request received! We&apos;ll confirm with you shortly.</p>;
  }

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-white/10">
      <input type="hidden" name="vehicleId" value={vehicleId} />
      <input type="hidden" name="type" value={type} />
      {state.error && <p className="text-sm text-error-500">{state.error}</p>}
      <input name="fullName" type="text" placeholder="Your name" required className={inputClass} />
      <input name="phone" type="text" placeholder="Phone number" className={inputClass} />
      <input name="email" type="email" placeholder="Email (optional)" className={inputClass} />
      <button type="submit" disabled={pending} className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
        {pending ? "Submitting..." : `Confirm ${label}`}
      </button>
    </form>
  );
}
