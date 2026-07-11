"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "@/lib/api";

export interface ActionState {
  error?: string;
  success?: boolean;
}

// --- Profile -------------------------------------------------------------

export async function updateProfileAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const payload = {
    fullName: String(formData.get("fullName") ?? "").trim() || undefined,
    phone: String(formData.get("phone") ?? "").trim() || undefined,
  };
  try {
    await api.patch("/users/me", payload);
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }
  revalidatePath("/dealer/settings/profile");
  return { success: true };
}

export async function changePasswordAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  if (!currentPassword || !newPassword) return { error: "Both fields are required." };

  try {
    await api.patch("/users/me/password", { currentPassword, newPassword });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }
  return { success: true };
}

// --- Business settings ----------------------------------------------------

export async function updateBusinessSettingsAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const payload: Record<string, unknown> = {};
  for (const key of ["legalName", "logoUrl", "address", "city", "country", "phone", "whatsappNumber", "customDomain", "about", "heroImageUrl"]) {
    const value = String(formData.get(key) ?? "").trim();
    if (value) payload[key] = value;
  }

  try {
    await api.patch("/settings/business", payload);
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }
  revalidatePath("/dealer/settings/business");
  return { success: true };
}

// --- Team -------------------------------------------------------------

export async function createTeamMemberAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const payload = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    roleId: String(formData.get("roleId") ?? ""),
    phone: String(formData.get("phone") ?? "").trim() || undefined,
  };
  if (!payload.fullName || !payload.email || !payload.password || !payload.roleId) {
    return { error: "Name, email, password, and role are required." };
  }

  try {
    await api.post("/users/team", payload);
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }
  revalidatePath("/dealer/settings/team");
  return { success: true };
}

export async function updateTeamMemberRoleAction(id: string, roleId: string) {
  await api.patch(`/users/team/${id}`, { roleId });
  revalidatePath("/dealer/settings/team");
}

export async function updateTeamMemberStatusAction(id: string, status: "active" | "suspended") {
  await api.patch(`/users/team/${id}`, { status });
  revalidatePath("/dealer/settings/team");
}
