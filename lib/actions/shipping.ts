"use server";

import { writeClient } from "@/sanity/lib/client";
import {
  createShipment,
  type CiblexCreateShipmentRequest,
} from "@/lib/shipping/ciblex";

interface CreateCiblexShipmentParams {
  orderId: string;
  orderNumber: string;
  clientName: string;
  address: string;
  gouvernorat: string;
  ville: string;
  phone: string;
  total: number;
  itemCount: number;
  designation: string;
  notes?: string;
}

/**
 * Create a Ciblex shipment for an order and store the tracking number.
 * Designed to be called non-blocking — failures are logged, never thrown.
 */
export async function createCiblexShipment(
  params: CreateCiblexShipmentParams,
): Promise<{ trackingNumber?: string; error?: string }> {
  try {
    if (!process.env.CIBLEX_USER || !process.env.CIBLEX_PASS) {
      return { error: "Ciblex credentials not configured" };
    }

    const shipmentData: CiblexCreateShipmentRequest = {
      reference: params.orderNumber,
      client: params.clientName,
      adresse: params.address,
      gouvernorat: params.gouvernorat,
      ville: params.ville,
      nb_pieces: params.itemCount,
      prix: params.total,
      tel1: params.phone,
      designation: params.designation,
      commentaire: params.notes ?? "",
      type: "FIX",
      echange: 0,
    };

    const res = await createShipment(shipmentData);

    if (res.result_type === "success" && res.result_content?.codeBar) {
      const trackingNumber = res.result_content.codeBar;

      await writeClient
        .patch(params.orderId)
        .set({
          trackingNumber,
          ciblexStatus: "En Attente",
        })
        .commit();

      return { trackingNumber };
    }

    return {
      error: `Ciblex: ${res.result_type} — ${res.result_code}`,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown Ciblex error";
    console.error(
      `[Ciblex] Failed to create shipment for order ${params.orderNumber}:`,
      message,
    );
    return { error: message };
  }
}
