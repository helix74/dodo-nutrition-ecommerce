/**
 * Shared types for AI shopping assistant - Dodo Nutrition
 */

export interface SearchProduct {
  id: string;
  name: string | null;
  slug: string | null;
  description: string | null;
  price: number | null;
  priceFormatted: string | null;
  category: string | null;
  categorySlug: string | null;
  // Nutrition-specific fields
  brand: string | null;
  brandSlug: string | null;
  unit: string | null;
  quantity: number | null;
  servings: number | null;
  flavors: string[];
  benefits: string[];
  certifications: string[];
  // Stock info
  stockCount: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock" | "unknown";
  stockMessage: string;
  featured: boolean;
  imageUrl: string | null;
  productUrl: string | null;
}

export interface SearchProductsResult {
  found: boolean;
  message: string;
  products: SearchProduct[];
  totalResults?: number;
  error?: string;
  filters: {
    query: string;
    category: string;
    brand: string;
    minPrice: number;
    maxPrice: number;
  };
}

// Re-export order types from the tool
export type { OrderSummary, GetMyOrdersResult } from "./tools/get-my-orders";
