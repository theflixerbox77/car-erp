"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleWishlistAction } from "@/app/actions/customer";

export default function WishlistToggle({ dealer, vehicleId, isLoggedIn, initiallySaved }: { dealer: string; vehicleId: string; isLoggedIn: boolean; initiallySaved: boolean }) {
  const [saved, setSaved] = useState(initiallySaved);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!isLoggedIn) {
      router.push(`/${dealer}/account/login`);
      return;
    }
    const next = !saved;
    setSaved(next);
    startTransition(() => toggleWishlistAction(dealer, vehicleId, saved));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
    >
      <span>{saved ? "♥" : "♡"}</span>
      {saved ? "Saved to Wishlist" : "Save to Wishlist"}
    </button>
  );
}
