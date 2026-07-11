"use server";

import { redirect } from "next/navigation";
import { publicApi, ApiError } from "@/lib/api";
import { setAuthCookies, clearAuthCookies } from "@/lib/session";

export interface LoginState {
  error?: string;
}

export interface RegisterState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const result = await publicApi.post<AuthTokens>("/auth/login", { email, password });
    await setAuthCookies(result.accessToken, result.refreshToken);
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.status === 401 ? "Invalid email or password." : "Something went wrong. Please try again." };
    }
    return { error: "Could not reach the server. Please try again." };
  }

  redirect("/");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function registerAction(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const businessName = String(formData.get("businessName") ?? "").trim();
  const ownerFullName = String(formData.get("ownerFullName") ?? "").trim();
  const ownerEmail = String(formData.get("ownerEmail") ?? "").trim();
  const ownerPassword = String(formData.get("ownerPassword") ?? "");
  const phone = String(formData.get("phone") ?? "").trim() || undefined;

  if (!businessName || !ownerFullName || !ownerEmail || !ownerPassword) {
    return { error: "Please fill in all required fields." };
  }
  if (ownerPassword.length < 8) {
    return { fieldErrors: { ownerPassword: "Password must be at least 8 characters." } };
  }

  const slug = slugify(businessName);

  try {
    const result = await publicApi.post<AuthTokens>("/auth/register", {
      businessName,
      slug,
      ownerFullName,
      ownerEmail,
      ownerPassword,
      phone,
    });
    await setAuthCookies(result.accessToken, result.refreshToken);
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return { error: "That business name or email is already registered." };
    }
    if (err instanceof ApiError && err.status === 400) {
      return { error: "Please check the form for errors and try again." };
    }
    return { error: "Could not reach the server. Please try again." };
  }

  redirect("/");
}

export async function logoutAction() {
  await clearAuthCookies();
  redirect("/signin");
}
