"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { client, writeClient } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/lib/sanity/queries/products";
import { getOrCreateStripeCustomer } from "@/lib/actions/customer";
import { resend, senderEmail } from "@/lib/mail";
import { OrderConfirmation } from "@/emails/OrderConfirmation";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});

// Types
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Creates a Stripe Checkout Session from cart items
 * Validates stock and prices against Sanity before creating session
 */
export async function createCheckoutSession(
  items: CartItem[]
): Promise<CheckoutResult> {
  try {
    // 1. Verify user is authenticated
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, error: "Please sign in to checkout" };
    }

    // 2. Validate cart is not empty
    if (!items || items.length === 0) {
      return { success: false, error: "Your cart is empty" };
    }

    // 3. Fetch current product data from Sanity to validate prices/stock
    const productIds = items.map((item) => item.productId);
    const products = await client.fetch(PRODUCTS_BY_IDS_QUERY, {
      ids: productIds,
    });

    // 4. Validate each item
    const validationErrors: string[] = [];
    const validatedItems: {
      product: (typeof products)[number];
      quantity: number;
    }[] = [];

    for (const item of items) {
      const product = products.find(
        (p: { _id: string }) => p._id === item.productId
      );

      if (!product) {
        validationErrors.push(`Product "${item.name}" is no longer available`);
        continue;
      }

      if ((product.stock ?? 0) === 0) {
        validationErrors.push(`"${product.name}" is out of stock`);
        continue;
      }

      if (item.quantity > (product.stock ?? 0)) {
        validationErrors.push(
          `Only ${product.stock} of "${product.name}" available`
        );
        continue;
      }

      validatedItems.push({ product, quantity: item.quantity });
    }

    if (validationErrors.length > 0) {
      return { success: false, error: validationErrors.join(". ") };
    }

    // 5. Create Stripe line items with validated prices
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      validatedItems.map(({ product, quantity }) => ({
        price_data: {
          currency: "tnd", // Tunisian Dinar
          product_data: {
            name: product.name ?? "Product",
            images: product.image?.asset?.url ? [product.image.asset.url] : [],
            metadata: {
              productId: product._id,
            },
          },
          unit_amount: Math.round((product.priceRetail ?? 0) * 1000), // Convert to millimes (TND has 3 decimal places)
        },
        quantity,
      }));

    // 6. Get or create Stripe customer
    const userEmail = user.emailAddresses[0]?.emailAddress ?? "";
    const userName =
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || userEmail;

    const { stripeCustomerId, sanityCustomerId } =
      await getOrCreateStripeCustomer(userEmail, userName, userId);

    // 7. Prepare metadata for webhook
    const metadata = {
      clerkUserId: userId,
      userEmail,
      sanityCustomerId,
      productIds: validatedItems.map((i) => i.product._id).join(","),
      quantities: validatedItems.map((i) => i.quantity).join(","),
    };

    // 8. Create Stripe Checkout Session
    // Priority: NEXT_PUBLIC_BASE_URL > Vercel URL > localhost
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer: stripeCustomerId,
      shipping_address_collection: {
        allowed_countries: [
          "GB", // United Kingdom
          "US", // United States
          "CA", // Canada
          "AU", // Australia
          "NZ", // New Zealand
          "IE", // Ireland
          "DE", // Germany
          "FR", // France
          "ES", // Spain
          "IT", // Italy
          "NL", // Netherlands
          "BE", // Belgium
          "AT", // Austria
          "CH", // Switzerland
          "SE", // Sweden
          "NO", // Norway
          "DK", // Denmark
          "FI", // Finland
          "PT", // Portugal
          "PL", // Poland
          "CZ", // Czech Republic
          "GR", // Greece
          "HU", // Hungary
          "RO", // Romania
          "BG", // Bulgaria
          "HR", // Croatia
          "SI", // Slovenia
          "SK", // Slovakia
          "LT", // Lithuania
          "LV", // Latvia
          "EE", // Estonia
          "LU", // Luxembourg
          "MT", // Malta
          "CY", // Cyprus
          "JP", // Japan
          "SG", // Singapore
          "HK", // Hong Kong
          "KR", // South Korea
          "TW", // Taiwan
          "MY", // Malaysia
          "TH", // Thailand
          "IN", // India
          "AE", // United Arab Emirates
          "SA", // Saudi Arabia
          "IL", // Israel
          "ZA", // South Africa
          "BR", // Brazil
          "MX", // Mexico
          "AR", // Argentina
          "CL", // Chile
          "CO", // Colombia
        ],
      },
      metadata,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return { success: true, url: session.url ?? undefined };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

/**
 * Retrieves a checkout session by ID (for success page)
 */
export async function getCheckoutSession(sessionId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details"],
    });

    // Verify the session belongs to this user
    if (session.metadata?.clerkUserId !== userId) {
      return { success: false, error: "Session not found" };
    }

    return {
      success: true,
      session: {
        id: session.id,
        customerEmail: session.customer_details?.email,
        customerName: session.customer_details?.name,
        amountTotal: session.amount_total,
        paymentStatus: session.payment_status,
        shippingAddress: session.customer_details?.address,
        lineItems: session.line_items?.data.map((item) => ({
          name: item.description,
          quantity: item.quantity,
          amount: item.amount_total,
        })),
      },
    };
  } catch (error) {
    console.error("Get session error:", error);
    return { success: false, error: "Could not retrieve order details" };
  }
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
    // 1. Get user if authenticated (optional for COD)
    const { userId } = await auth();
    const user = userId ? await currentUser() : null;

    // 2. Validate cart is not empty
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Votre panier est vide" };
    }

    // 3. Validate required fields
    if (!data.address.name || !data.address.line1 || !data.address.city || !data.address.gouvernorat) {
      return { success: false, error: "Veuillez remplir tous les champs obligatoires" };
    }

    if (!data.phone) {
      return { success: false, error: "Le numéro de téléphone est requis" };
    }

    if (!data.email) {
      return { success: false, error: "L'adresse email est requise" };
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

    // 8. Decrement stock for each product (using writeClient)
    const stockUpdates = orderItems.map((item) =>
      writeClient
        .patch(item.product._ref)
        .dec({ stock: item.quantity })
        .commit()
    );

    await Promise.all(stockUpdates);

    // 9. Send Order Confirmation Email
    if (resend) {
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
    }

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

