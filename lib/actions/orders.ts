"use server";

import { writeClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import type { OrderStatusValue } from "@/lib/constants/orderStatus";

/**
 * Update the status of an order
 * Used by QuickStatusActions component
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatusValue
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate inputs
    if (!orderId) {
      return { success: false, error: "ID de commande manquant" };
    }

    if (!newStatus) {
      return { success: false, error: "Statut manquant" };
    }

    // Update order status in Sanity
    await writeClient
      .patch(orderId)
      .set({ status: newStatus })
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
