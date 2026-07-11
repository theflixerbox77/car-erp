"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, apiUpload, ApiError } from "@/lib/api";
import type { Expense } from "@/lib/types/ops";

export interface ActionState {
  error?: string;
}

// --- Expenses -------------------------------------------------------------

export async function createExpenseCategoryAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await api.post("/expenses/categories", { name, isRecurringDefault: formData.get("isRecurringDefault") === "on" });
  revalidatePath("/dealer/expenses");
  revalidatePath("/dealer/expenses/new");
}

export async function createExpenseAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const categoryId = String(formData.get("categoryId") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  if (!categoryId || !amount) return { error: "Category and amount are required." };

  const payload = {
    categoryId,
    amount,
    description: String(formData.get("description") ?? "").trim() || undefined,
    expenseDate: String(formData.get("expenseDate") ?? "") || undefined,
  };

  let expense: Expense;
  try {
    expense = await api.post<Expense>("/expenses", payload);
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }

  const receipt = formData.get("receipt");
  if (receipt instanceof File && receipt.size > 0) {
    const upload = new FormData();
    upload.set("file", receipt);
    await apiUpload(`/expenses/${expense.id}/receipt`, upload);
  }

  revalidatePath("/dealer/expenses");
  redirect("/dealer/expenses");
}

export async function approveExpenseAction(id: string) {
  await api.patch(`/expenses/${id}/approve`);
  revalidatePath("/dealer/expenses");
}

export async function rejectExpenseAction(id: string) {
  await api.patch(`/expenses/${id}/reject`);
  revalidatePath("/dealer/expenses");
}

export async function createRecurringScheduleAction(formData: FormData) {
  const categoryId = String(formData.get("categoryId") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  const frequency = String(formData.get("frequency") ?? "monthly");
  const nextRunDate = String(formData.get("nextRunDate") ?? "");
  if (!categoryId || !amount || !nextRunDate) return;
  await api.post("/expenses/recurring", { categoryId, amount, frequency, nextRunDate, description: String(formData.get("description") ?? "").trim() || undefined });
  revalidatePath("/dealer/expenses/recurring");
}

export async function deactivateRecurringScheduleAction(id: string) {
  await api.patch(`/expenses/recurring/${id}/deactivate`);
  revalidatePath("/dealer/expenses/recurring");
}

// --- Employees -------------------------------------------------------------

export interface EmployeeFormState {
  error?: string;
}

export async function createEmployeeAction(_prevState: EmployeeFormState, formData: FormData): Promise<EmployeeFormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  if (!fullName) return { error: "Full name is required." };

  const payload: Record<string, unknown> = { fullName };
  const phone = String(formData.get("phone") ?? "").trim();
  if (phone) payload.phone = phone;
  const email = String(formData.get("email") ?? "").trim();
  if (email) payload.email = email;
  const hireDate = String(formData.get("hireDate") ?? "");
  if (hireDate) payload.hireDate = hireDate;
  const salaryAmount = formData.get("salaryAmount");
  if (salaryAmount) payload.salaryAmount = Number(salaryAmount);
  const salaryType = String(formData.get("salaryType") ?? "");
  if (salaryType) payload.salaryType = salaryType;
  const commissionRate = formData.get("commissionRate");
  if (commissionRate) payload.commissionRate = Number(commissionRate);

  try {
    await api.post("/employees", payload);
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not reach the server." };
  }
  revalidatePath("/dealer/employees");
  redirect("/dealer/employees");
}

export async function checkInAction(employeeId: string) {
  await api.post(`/employees/${employeeId}/check-in`);
  revalidatePath(`/dealer/employees/${employeeId}`);
}

export async function checkOutAction(employeeId: string) {
  await api.post(`/employees/${employeeId}/check-out`);
  revalidatePath(`/dealer/employees/${employeeId}`);
}

export async function createLeaveRequestAction(employeeId: string, formData: FormData) {
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  if (!startDate || !endDate) return;
  await api.post(`/employees/${employeeId}/leave-requests`, {
    type: String(formData.get("type") ?? "other"),
    startDate,
    endDate,
    reason: String(formData.get("reason") ?? "").trim() || undefined,
  });
  revalidatePath(`/dealer/employees/${employeeId}`);
}

export async function reviewLeaveRequestAction(id: string, decision: "approve" | "reject") {
  await api.patch(`/leave-requests/${id}/${decision}`);
  revalidatePath("/dealer/employees/leave-requests");
}

// --- Notifications -------------------------------------------------------------

export async function markNotificationReadAction(id: string) {
  await api.patch(`/notifications/${id}/read`);
  revalidatePath("/");
}
