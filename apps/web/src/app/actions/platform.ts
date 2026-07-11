"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";

export async function approveDealerAction(id: string) {
  await api.patch(`/platform/dealers/${id}/approve`);
  revalidatePath("/platform/dealers");
}

export async function suspendDealerAction(id: string) {
  await api.patch(`/platform/dealers/${id}/suspend`);
  revalidatePath("/platform/dealers");
}

export async function reactivateDealerAction(id: string) {
  await api.patch(`/platform/dealers/${id}/reactivate`);
  revalidatePath("/platform/dealers");
}
