"use server";

import { writeClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { OrderStatusSchema } from "@/lib/validations/schemas";

/**
 * Update the status of an order
 * Used by QuickStatusActions component
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Require admin authentication
    await requireAdmin();

    // Validate inputs
    if (!orderId) {
      return { success: false, error: "ID de commande manquant" };
    }

    // Validate status with Zod schema
    const statusResult = OrderStatusSchema.safeParse(newStatus);
    if (!statusResult.success) {
      return { success: false, error: "Statut invalide" };
    }

    // Update order status in Sanity
    await writeClient
      .patch(orderId)
      .set({ status: statusResult.data })
      .commit();

    // Revalidate admin pages
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { 
      success: false, 
      error: "Échec de la mise à jour du statut" 
    };
  }
}
