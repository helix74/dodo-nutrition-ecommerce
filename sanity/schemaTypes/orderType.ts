import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { ORDER_STATUS_SANITY_LIST } from "@/lib/constants/orderStatus";
import { GOUVERNORATS } from "@/lib/constants/gouvernorats";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  groups: [
    { name: "details", title: "Order Details", default: true },
    { name: "customer", title: "Customer" },
    { name: "shipping", title: "Shipping" },
    { name: "payment", title: "Payment" },
  ],
  fields: [
    defineField({
      name: "orderNumber",
      type: "string",
      group: "details",
      readOnly: true,
      validation: (rule) => [rule.required().error("Order number is required")],
    }),
    defineField({
      name: "items",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "quantity",
              type: "number",
              initialValue: 1,
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: "priceAtPurchase",
              type: "number",
              description: "Price at time of purchase",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "product.name",
              quantity: "quantity",
              price: "priceAtPurchase",
              media: "product.images.0",
            },
            prepare({ title, quantity, price, media }) {
              return {
                title: title ?? "Product",
                subtitle: `Qty: ${quantity} • ${price} TND`,
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "total",
      type: "number",
      group: "details",
      readOnly: true,
      description: "Total order amount in TND",
    }),
    defineField({
      name: "status",
      type: "string",
      group: "details",
      initialValue: "pending",
      options: {
        list: ORDER_STATUS_SANITY_LIST,
        layout: "radio",
      },
    }),
    defineField({
      name: "paymentMethod",
      type: "string",
      group: "payment",
      initialValue: "cod",
      options: {
        list: [
          { title: "Cash on Delivery", value: "cod" },
          { title: "Card (Stripe)", value: "stripe" },
        ],
        layout: "radio",
      },
    }),
    // Customer info
    defineField({
      name: "customer",
      type: "reference",
      to: [{ type: "customer" }],
      group: "customer",
      description: "Reference to the customer record (if logged in)",
    }),
    defineField({
      name: "clerkUserId",
      type: "string",
      group: "customer",
      readOnly: true,
      description: "Clerk user ID (if logged in)",
    }),
    defineField({
      name: "email",
      type: "string",
      group: "customer",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phone",
      type: "string",
      group: "customer",
      description: "Phone number for delivery confirmation (+216)",
      validation: (rule) => rule.required().error("Phone number is required for COD"),
    }),
    // Shipping address
    defineField({
      name: "address",
      type: "object",
      group: "shipping",
      fields: [
        defineField({ 
          name: "name", 
          type: "string", 
          title: "Nom complet",
          validation: (rule) => rule.required(),
        }),
        defineField({ 
          name: "line1", 
          type: "string", 
          title: "Adresse",
          validation: (rule) => rule.required(),
        }),
        defineField({ 
          name: "city", 
          type: "string", 
          title: "Ville",
          validation: (rule) => rule.required(),
        }),
        defineField({ 
          name: "gouvernorat", 
          type: "string", 
          title: "Gouvernorat",
          options: {
            list: GOUVERNORATS.map((g: string) => ({ title: g, value: g })),
          },
          initialValue: "Tunis",
          validation: (rule) => rule.required(),
        }),
        defineField({ 
          name: "postcode", 
          type: "string", 
          title: "Code postal" 
        }),
      ],
    }),
    defineField({
      name: "notes",
      type: "text",
      group: "shipping",
      title: "Notes de livraison",
      description: "Instructions spéciales pour la livraison",
    }),
    // Payment info
    defineField({
      name: "stripePaymentId",
      type: "string",
      group: "payment",
      readOnly: true,
      description: "Stripe payment intent ID (for card payments)",
    }),
    defineField({
      name: "createdAt",
      type: "datetime",
      group: "details",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      orderNumber: "orderNumber",
      email: "email",
      total: "total",
      status: "status",
      paymentMethod: "paymentMethod",
    },
    prepare({ orderNumber, email, total, status, paymentMethod }) {
      const method = paymentMethod === "cod" ? "COD" : "💳";
      return {
        title: `Order ${orderNumber ?? "N/A"}`,
        subtitle: `${email ?? "No email"} • ${total ?? 0} TND • ${status ?? "pending"} • ${method}`,
      };
    },
  },
  orderings: [
    {
      title: "Newest First",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Status",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
});
