import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { publicApi, ApiError } from "./api";
import type { DealerProfile } from "./types";

export const getDealer = cache(async (slug: string): Promise<DealerProfile> => {
  try {
    return await publicApi.get<DealerProfile>(`/storefront/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
});
