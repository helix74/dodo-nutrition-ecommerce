import { z } from "zod";

// ============================================
// Checkout Schemas
// ============================================

export const CartItemSchema = z.object({
  productId: z.string().min(1, "Product ID requis"),
  name: z.string().min(1, "Nom requis"),
  price: z.number().positive("Prix invalide"),
  quantity: z.number().int().positive("Quantité invalide"),
  image: z.string().optional(),
});

export const AddressSchema = z.object({
  name: z.string().min(2, "Nom requis (min 2 caractères)"),
  line1: z.string().min(5, "Adresse requise (min 5 caractères)"),
  city: z.string().min(2, "Ville requise"),
  gouvernorat: z.string().min(2, "Gouvernorat requis"),
  postcode: z.string().optional(),
});

export const CODOrderSchema = z.object({
  items: z.array(CartItemSchema).min(1, "Panier vide"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  address: AddressSchema,
  notes: z.string().optional(),
});

// ============================================
// Review Schemas
// ============================================

export const SubmitReviewSchema = z.object({
  author: z.string().min(2, "Nom requis (min 2 caractères)"),
  rating: z.number().int().min(1).max(5, "Note entre 1 et 5"),
  comment: z.string().min(10, "Commentaire requis (min 10 caractères)"),
  categoryId: z.string().optional(),
});

// ============================================
// Order Schemas
// ============================================

export const OrderStatusSchema = z.enum([
  "pending",
  "confirmed", 
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "Order ID requis"),
  newStatus: OrderStatusSchema,
});

// ============================================
// Types (inferred from schemas)
// ============================================

export type CartItem = z.infer<typeof CartItemSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type CODOrderData = z.infer<typeof CODOrderSchema>;
export type SubmitReviewData = z.infer<typeof SubmitReviewSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
