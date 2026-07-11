import "server-only";
import { cache } from "react";
import { api, ApiError } from "./api";
import { getAccessToken } from "./session";

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  isPlatformAdmin: boolean;
  tenantId: string | null;
  role: { id: string; name: string } | null;
  tenant: {
    id: string;
    slug: string;
    businessName: string;
    subscriptionStatus: "pending_approval" | "active" | "suspended" | "cancelled";
    subscriptionPlan: string;
  } | null;
}

/** Cached per-request: safe to call from multiple server components without duplicate network calls. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    return await api.get<CurrentUser>("/users/me");
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 404)) return null;
    throw err;
  }
});
