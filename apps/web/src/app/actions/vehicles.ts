"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, apiUpload, ApiError } from "@/lib/api";
import type { Vehicle } from "@/lib/types/vehicle";

export interface VehicleFormState {
  error?: string;
}

const NUMERIC_FIELDS = [
  "year",
  "mileage",
  "importCost",
  "auctionCost",
  "shippingCost",
  "customsCost",
  "repairCost",
  "registrationCost",
  "sellingPrice",
  "expectedProfit",
  "minimumPrice",
  "discountAmount",
] as const;

const STRING_FIELDS = [
  "stockNumber",
  "vin",
  "chassisNumber",
  "engineNumber",
  "brand",
  "model",
  "trim",
  "auctionGrade",
  "registrationNumber",
  "registrationExpiry",
  "fuelType",
  "transmission",
  "driveType",
  "color",
  "condition",
  "bodyType",
] as const;

function formDataToVehiclePayload(formData: FormData): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const field of STRING_FIELDS) {
    const value = formData.get(field);
    if (typeof value === "string" && value.trim() !== "") payload[field] = value.trim();
  }
  for (const field of NUMERIC_FIELDS) {
    const value = formData.get(field);
    if (typeof value === "string" && value.trim() !== "") payload[field] = Number(value);
  }

  const isFeatured = formData.get("isFeatured");
  if (isFeatured != null) payload.isFeatured = isFeatured === "on" || isFeatured === "true";

  return payload;
}

export async function createVehicleAction(_prevState: VehicleFormState, formData: FormData): Promise<VehicleFormState> {
  const payload = formDataToVehiclePayload(formData);
  let created: Vehicle;
  try {
    created = await api.post<Vehicle>("/vehicles", payload);
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }
  revalidatePath("/dealer/inventory");
  redirect(`/dealer/inventory/${created.id}`);
}

export async function updateVehicleAction(vehicleId: string, _prevState: VehicleFormState, formData: FormData): Promise<VehicleFormState> {
  const payload = formDataToVehiclePayload(formData);
  try {
    await api.patch<Vehicle>(`/vehicles/${vehicleId}`, payload);
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }
  revalidatePath("/dealer/inventory");
  revalidatePath(`/dealer/inventory/${vehicleId}`);
  redirect(`/dealer/inventory/${vehicleId}`);
}

export async function deleteVehicleAction(vehicleId: string) {
  await api.delete(`/vehicles/${vehicleId}`);
  revalidatePath("/dealer/inventory");
  redirect("/dealer/inventory");
}

export async function changeVehicleStatusAction(vehicleId: string, status: string, note?: string) {
  await api.patch(`/vehicles/${vehicleId}/status`, { status, note });
  revalidatePath(`/dealer/inventory/${vehicleId}`);
  revalidatePath("/dealer/inventory");
}

export async function uploadVehicleMediaAction(vehicleId: string, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const upload = new FormData();
  upload.set("file", file);
  upload.set("type", String(formData.get("type") ?? "image"));

  await apiUpload(`/vehicles/${vehicleId}/media`, upload);
  revalidatePath(`/dealer/inventory/${vehicleId}`);
}

export async function deleteVehicleMediaAction(vehicleId: string, mediaId: string) {
  await api.delete(`/vehicles/${vehicleId}/media/${mediaId}`);
  revalidatePath(`/dealer/inventory/${vehicleId}`);
}

export async function setPrimaryMediaAction(vehicleId: string, mediaId: string) {
  await api.patch(`/vehicles/${vehicleId}/media/${mediaId}/primary`);
  revalidatePath(`/dealer/inventory/${vehicleId}`);
}
