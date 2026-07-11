"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { Customer, Lead, Sale } from "@/lib/types/sales";

export interface ActionState {
  error?: string;
}

// --- Customers -------------------------------------------------------------

export async function createCustomerAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const payload = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    email: String(formData.get("email") ?? "").trim() || undefined,
    address: String(formData.get("address") ?? "").trim() || undefined,
    nidNumber: String(formData.get("nidNumber") ?? "").trim() || undefined,
    licenseNumber: String(formData.get("licenseNumber") ?? "").trim() || undefined,
    notes: String(formData.get("notes") ?? "").trim() || undefined,
    source: String(formData.get("source") ?? "").trim() || undefined,
  };
  if (!payload.fullName) return { error: "Full name is required." };

  let customer: Customer;
  try {
    customer = await api.post<Customer>("/customers", payload);
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }
  revalidatePath("/dealer/crm/customers");
  redirect(`/dealer/crm/customers/${customer.id}`);
}

export async function addInteractionAction(customerId: string, formData: FormData) {
  const type = String(formData.get("type") ?? "note");
  const summary = String(formData.get("summary") ?? "").trim();
  if (!summary) return;
  await api.post(`/customers/${customerId}/interactions`, { type, summary });
  revalidatePath(`/dealer/crm/customers/${customerId}`);
}

// --- Leads -------------------------------------------------------------

export async function createLeadAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const customerId = String(formData.get("customerId") ?? "");
  const vehicleId = String(formData.get("vehicleId") ?? "") || undefined;
  const source = String(formData.get("source") ?? "").trim() || undefined;
  if (!customerId) return { error: "Please select a customer." };

  try {
    await api.post<Lead>("/leads", { customerId, vehicleId, source });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }
  revalidatePath("/dealer/sales/pipeline");
  redirect("/dealer/sales/pipeline");
}

export async function changeLeadStageAction(leadId: string, stage: string) {
  await api.patch(`/leads/${leadId}/stage`, { stage });
  revalidatePath("/dealer/sales/pipeline");
}

// --- Sales -------------------------------------------------------------

export async function createSaleAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const payload: Record<string, unknown> = {
    customerId: String(formData.get("customerId") ?? ""),
    vehicleId: String(formData.get("vehicleId") ?? ""),
    salePrice: Number(formData.get("salePrice") ?? 0),
  };
  const leadId = String(formData.get("leadId") ?? "");
  if (leadId) payload.leadId = leadId;
  const discount = formData.get("discount");
  if (discount) payload.discount = Number(discount);
  const commissionRate = formData.get("commissionRate");
  if (commissionRate) payload.commissionRate = Number(commissionRate);
  const deliveryDate = formData.get("deliveryDate");
  if (deliveryDate) payload.deliveryDate = String(deliveryDate);
  const warrantyMonths = formData.get("warrantyMonths");
  if (warrantyMonths) payload.warrantyMonths = Number(warrantyMonths);

  if (!payload.customerId || !payload.vehicleId || !payload.salePrice) {
    return { error: "Customer, vehicle, and sale price are required." };
  }

  let sale: Sale;
  try {
    sale = await api.post<Sale>("/sales", payload);
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }
  revalidatePath("/dealer/sales/records");
  redirect(`/dealer/sales/records/${sale.id}`);
}

export async function recordPaymentAction(saleId: string, formData: FormData) {
  const amount = Number(formData.get("amount") ?? 0);
  const method = String(formData.get("method") ?? "cash");
  const referenceNote = String(formData.get("referenceNote") ?? "").trim() || undefined;
  if (!amount) return;
  await api.post(`/sales/${saleId}/payments`, { amount, method, referenceNote });
  revalidatePath(`/dealer/sales/records/${saleId}`);
}

export async function generateDocumentAction(saleId: string, type: string) {
  await api.post(`/sales/${saleId}/documents/${type}`);
  revalidatePath(`/dealer/sales/records/${saleId}`);
}

export async function getDocumentSignedUrl(saleId: string, documentId: string): Promise<string> {
  const res = await api.get<{ url: string }>(`/sales/${saleId}/documents/${documentId}/signed-url`);
  return res.url;
}
