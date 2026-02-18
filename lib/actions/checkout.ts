"use server";

import { auth } from "@clerk/nextjs/server";
import { client, writeClient } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/lib/sanity/queries/products";
import { resend, senderEmail } from "@/lib/mail";
import { OrderConfirmation } from "@/emails/OrderConfirmation";
import { CODOrderSchema } from "@/lib/validations/schemas";
import { sendCAPIEvent } from "@/lib/tracking/meta-capi";
import { createCiblexShipment } from "@/lib/actions/shipping";

// Types
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// =============================================================================
// COD (Cash on Delivery) Checkout
// =============================================================================

export interface CODOrderData {
  items: CartItem[];
  address: {
    name: string;
    line1: string;
    city: string;
    gouvernorat: string;
    postcode?: string;
  };
  phone: string;
  email: string;
  notes?: string;
}

export interface CODOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

/**
 * Creates a COD (Cash on Delivery) order
 * Works for both authenticated and guest users
 */
export async function createCODOrder(
  data: CODOrderData
): Promise<CODOrderResult> {
  try {
    // 1. Get user ID if authenticated (optional for COD)
    const { userId } = await auth();

    // 2. Validate cart is not empty
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Votre panier est vide" };
    }

    // 3. Validate input with Zod
    const validationResult = CODOrderSchema.safeParse(data);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map((e: { message: string }) => e.message).join(". ");
      return { success: false, error: errorMessages };
    }

    // 4. Fetch current product data from Sanity to validate prices/stock
    const productIds = data.items.map((item) => item.productId);
    const products = await client.fetch(PRODUCTS_BY_IDS_QUERY, {
      ids: productIds,
    });

    // 5. Validate each item and calculate total
    const validationErrors: string[] = [];
    const orderItems: {
      _key: string;
      product: { _type: "reference"; _ref: string };
      quantity: number;
      priceAtPurchase: number;
    }[] = [];
    let total = 0;

    for (const item of data.items) {
      const product = products.find(
        (p: { _id: string }) => p._id === item.productId
      );

      if (!product) {
        validationErrors.push(`"${item.name}" n'est plus disponible`);
        continue;
      }

      if ((product.stock ?? 0) === 0) {
        validationErrors.push(`"${product.name}" est en rupture de stock`);
        continue;
      }

      if (item.quantity > (product.stock ?? 0)) {
        validationErrors.push(
          `Seulement ${product.stock} "${product.name}" disponible(s)`
        );
        continue;
      }

      const price = product.priceRetail ?? 0;
      orderItems.push({
        _key: crypto.randomUUID(),
        product: { _type: "reference", _ref: product._id },
        quantity: item.quantity,
        priceAtPurchase: price,
      });
      total += price * item.quantity;
    }

    if (validationErrors.length > 0) {
      return { success: false, error: validationErrors.join(". ") };
    }

    // 6. Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 7. Create order in Sanity (using writeClient for mutations)
    const order = await writeClient.create({
      _type: "order",
      orderNumber,
      items: orderItems,
      total,
      status: "pending",
      paymentMethod: "cod",
      clerkUserId: userId ?? null,
      email: data.email,
      phone: data.phone,
      address: {
        name: data.address.name,
        line1: data.address.line1,
        city: data.address.city,
        gouvernorat: data.address.gouvernorat,
        postcode: data.address.postcode ?? null,
      },
      notes: data.notes ?? null,
      createdAt: new Date().toISOString(),
    });

    // 8. Decrement stock atomically using transaction
    const stockTransaction = writeClient.transaction();
    for (const item of orderItems) {
      stockTransaction.patch(item.product._ref, {
        dec: { stock: item.quantity }
      });
    }
    await stockTransaction.commit();

    // 9. Send Order Confirmation Email (non-blocking - don't let email failure block checkout)
    if (resend) {
      try {
        const emailItems = data.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        }));

        await resend.emails.send({
          from: senderEmail,
          to: data.email,
          subject: `Confirmation de commande ${orderNumber} - Dodo Nutrition`,
          react: OrderConfirmation({
            customerName: data.address.name,
            orderId: orderNumber,
            items: emailItems,
            total: total,
            shippingAddress: `${data.address.line1}\n${data.address.city}, ${data.address.gouvernorat} ${data.address.postcode ?? ""}`,
          }),
        });
      } catch (emailError) {
        // Log but don't fail the order - email is secondary
        console.error("Failed to send confirmation email:", emailError);
      }
    }

    // 10. Send Meta CAPI Purchase event (non-blocking)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dodonutrition.tn";
    sendCAPIEvent({
      eventName: "Purchase",
      eventId: `purchase-${order.orderNumber}`,
      eventSourceUrl: `${baseUrl}/checkout/success?order=${order.orderNumber}`,
      userData: {
        email: data.email,
        phone: data.phone,
      },
      value: total,
      items: data.items.map((i) => ({
        id: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    }).catch((err) => console.error("CAPI Purchase event failed:", err));

    // 11. Create Ciblex shipment (non-blocking — never fail the order)
    const itemNames = data.items.map((i) => i.name).join(", ");
    createCiblexShipment({
      orderId: order._id,
      orderNumber,
      clientName: data.address.name,
      address: data.address.line1,
      gouvernorat: data.address.gouvernorat,
      ville: data.address.city,
      phone: data.phone,
      total,
      itemCount: data.items.reduce((sum, i) => sum + i.quantity, 0),
      designation: itemNames.length > 200 ? itemNames.slice(0, 197) + "..." : itemNames,
      notes: data.notes,
    }).catch((err) => console.error("[Ciblex] Shipment creation failed:", err));

    return {
      success: true,
      orderId: order._id,
      orderNumber: order.orderNumber,
    };
  } catch (error) {
    console.error("COD Order Error:", error);
    return {
      success: false,
      error: "Une erreur est survenue. Veuillez réessayer.",
    };
  }
}
