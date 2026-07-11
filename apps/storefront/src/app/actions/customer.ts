"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { publicApi, customerApi, ApiError } from "@/lib/api";
import { setCustomerToken, clearCustomerToken } from "@/lib/session";

export interface FormState {
  error?: string;
  success?: boolean;
}

interface AuthResult {
  accessToken: string;
  account: { id: string; fullName: string; email: string };
}

export async function registerCustomerAction(dealer: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim() || undefined;

  if (!fullName || !email || password.length < 8) {
    return { error: "Please fill in all fields (password must be at least 8 characters)." };
  }

  let result: AuthResult;
  try {
    result = await publicApi.post<AuthResult>(`/storefront/${dealer}/auth/register`, { fullName, email, password, phone });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }
  await setCustomerToken(result.accessToken);
  redirect(`/${dealer}/account/wishlist`);
}

export async function loginCustomerAction(dealer: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };

  let result: AuthResult;
  try {
    result = await publicApi.post<AuthResult>(`/storefront/${dealer}/auth/login`, { email, password });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.status === 401 ? "Invalid email or password." : err.message };
    return { error: "Could not reach the server." };
  }
  await setCustomerToken(result.accessToken);
  redirect(`/${dealer}/account/wishlist`);
}

export async function logoutCustomerAction(dealer: string) {
  await clearCustomerToken();
  redirect(`/${dealer}`);
}

export async function submitInquiryAction(dealer: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  const customerName = String(formData.get("customerName") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!customerName || !message) return { error: "Please fill in your name and message." };

  try {
    await publicApi.post(`/storefront/${dealer}/inquiries`, {
      vehicleId: String(formData.get("vehicleId") ?? "") || undefined,
      customerName,
      phone: String(formData.get("phone") ?? "").trim() || undefined,
      email: String(formData.get("email") ?? "").trim() || undefined,
      message,
      source: "contact_form",
    });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }
  return { success: true };
}

export async function submitReservationAction(dealer: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const vehicleId = String(formData.get("vehicleId") ?? "");
  if (!fullName || !vehicleId) return { error: "Please fill in your name." };

  try {
    await publicApi.post(`/storefront/${dealer}/bookings`, {
      vehicleId,
      type: String(formData.get("type") ?? "reservation"),
      fullName,
      phone: String(formData.get("phone") ?? "").trim() || undefined,
      email: String(formData.get("email") ?? "").trim() || undefined,
      note: String(formData.get("note") ?? "").trim() || undefined,
    });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }
  return { success: true };
}

export async function toggleWishlistAction(dealer: string, vehicleId: string, isSaved: boolean) {
  if (isSaved) {
    await customerApi.delete(`/storefront/account/wishlist/${vehicleId}`);
  } else {
    await customerApi.post(`/storefront/account/wishlist/${vehicleId}`);
  }
  revalidatePath(`/${dealer}`);
}
