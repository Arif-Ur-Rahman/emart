"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyAdmin } from "@/lib/dal";
import { changeOrderStatus, type TransitionResult } from "@/lib/orders";
import { isOrderStatus } from "@/lib/data/admin";

export async function updateOrderStatus(
  orderId: string,
  to: string
): Promise<TransitionResult> {
  await verifyAdmin();
  if (!isOrderStatus(to)) return { ok: false, error: "Unknown status." };

  const result = await changeOrderStatus(orderId, to);
  if (result.ok) {
    // Status changes also move stock (on cancel) and the customer's view.
    revalidatePath("/", "layout");
  }
  return result;
}

const NoteSchema = z.string().trim().max(2000, { error: "Keep notes under 2000 characters." });

export type AdminNoteState = { ok?: boolean; error?: string } | undefined;

export async function saveAdminNote(
  orderId: string,
  _prev: AdminNoteState,
  formData: FormData
): Promise<AdminNoteState> {
  await verifyAdmin();

  const parsed = NoteSchema.safeParse(formData.get("adminNote") ?? "");
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.order.update({
    where: { id: orderId },
    data: { adminNote: parsed.data || null },
  });
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}
