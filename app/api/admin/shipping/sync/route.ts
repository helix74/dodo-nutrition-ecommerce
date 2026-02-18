import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { listShipmentStatuses, mapCiblexStatus } from "@/lib/shipping/ciblex";

interface TrackedOrder {
  _id: string;
  orderNumber: string;
  trackingNumber: string;
  status: string;
  ciblexStatus: string | null;
}

const TRACKED_ORDERS_QUERY = `*[
  _type == "order"
  && defined(trackingNumber)
  && trackingNumber != ""
  && !(status in ["delivered", "cancelled"])
]{
  _id,
  orderNumber,
  trackingNumber,
  status,
  ciblexStatus
}`;

/**
 * POST /api/admin/shipping/sync
 * Syncs Ciblex delivery statuses for all tracked, active orders.
 * Optionally accepts { trackingNumber } to sync a single order.
 */
export async function POST(request: Request) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!process.env.CIBLEX_USER || !process.env.CIBLEX_PASS) {
      return NextResponse.json(
        { error: "Identifiants Ciblex non configurés" },
        { status: 503 },
      );
    }

    let body: { trackingNumber?: string } = {};
    try {
      body = await request.json();
    } catch {
      // empty body is fine — sync all
    }

    let orders: TrackedOrder[];

    if (body.trackingNumber) {
      orders = await writeClient.fetch(
        `*[
          _type == "order"
          && trackingNumber == $tn
        ][0...1]{
          _id,
          orderNumber,
          trackingNumber,
          status,
          ciblexStatus
        }`,
        { tn: body.trackingNumber },
        { cache: "no-store" },
      );
      if (!Array.isArray(orders)) orders = orders ? [orders] : [];
    } else {
      orders = await writeClient.fetch(TRACKED_ORDERS_QUERY, {}, { cache: "no-store" });
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        synced: 0,
        message: "Aucune commande à synchroniser",
      });
    }

    const codeBars = orders.map((o) => o.trackingNumber);
    const ciblexRes = await listShipmentStatuses(codeBars);

    if (ciblexRes.result_type !== "success") {
      return NextResponse.json(
        { error: `Erreur Ciblex: ${ciblexRes.result_code}` },
        { status: 502 },
      );
    }

    const statusList = Array.isArray(ciblexRes.result_content)
      ? ciblexRes.result_content
      : [ciblexRes.result_content];

    const statusByCode = new Map(
      statusList.map((s) => [s.code, s.etat]),
    );

    let updated = 0;
    const results: Array<{
      orderNumber: string;
      trackingNumber: string;
      ciblexStatus: string;
      orderStatus: string;
      changed: boolean;
    }> = [];

    const tx = writeClient.transaction();

    for (const order of orders) {
      const ciblexEtat = statusByCode.get(order.trackingNumber);
      if (!ciblexEtat) continue;

      const newOrderStatus = mapCiblexStatus(ciblexEtat);
      const statusChanged = newOrderStatus && newOrderStatus !== order.status;
      const ciblexChanged = ciblexEtat !== order.ciblexStatus;

      if (statusChanged || ciblexChanged) {
        const patch: Record<string, string> = { ciblexStatus: ciblexEtat };
        if (statusChanged) {
          patch.status = newOrderStatus;
        }
        tx.patch(order._id, { set: patch });
        updated++;
      }

      results.push({
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber,
        ciblexStatus: ciblexEtat,
        orderStatus: newOrderStatus ?? order.status,
        changed: !!(statusChanged || ciblexChanged),
      });
    }

    if (updated > 0) {
      await tx.commit();
    }

    return NextResponse.json({
      synced: updated,
      total: orders.length,
      results,
    });
  } catch (error) {
    console.error("[Shipping Sync] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la synchronisation" },
      { status: 500 },
    );
  }
}
