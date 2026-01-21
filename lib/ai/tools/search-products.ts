import { tool } from "ai";
import { z } from "zod";
import { sanityFetch } from "@/sanity/lib/live";
import { AI_SEARCH_PRODUCTS_QUERY } from "@/lib/sanity/queries/products";
import { formatPrice } from "@/lib/utils";
import { getStockStatus, getStockMessage } from "@/lib/constants/stock";
import type { AI_SEARCH_PRODUCTS_QUERYResult } from "@/sanity.types";
import type { SearchProduct } from "@/lib/ai/types";

const productSearchSchema = z.object({
  query: z
    .string()
    .optional()
    .default("")
    .describe(
      "Search term to find products by name, description, brand, or category (e.g., 'whey protein', 'creatine', 'pre-workout')"
    ),
  category: z
    .string()
    .optional()
    .default("")
    .describe(
      "Filter by category slug (e.g., 'proteines', 'creatine', 'pre-workout', 'vitamines', 'bruleurs-de-graisse')"
    ),
  brand: z
    .string()
    .optional()
    .default("")
    .describe(
      "Filter by brand slug (e.g., 'real-pharm', 'biotech-usa', 'eric-favre', 'muscletech')"
    ),
  minPrice: z
    .number()
    .optional()
    .default(0)
    .describe("Minimum price in TND (e.g., 50)"),
  maxPrice: z
    .number()
    .optional()
    .default(0)
    .describe("Maximum price in TND (e.g., 200). Use 0 for no maximum."),
});

export const searchProductsTool = tool({
  description:
    "Search for nutrition and supplement products in the Dodo Nutrition store. Can search by name, description, brand, or category, and filter by price range. Returns product details including stock availability, unit, quantity, and servings.",
  inputSchema: productSearchSchema,
  execute: async ({ query, category, brand, minPrice, maxPrice }) => {
    console.log("[SearchProducts] Query received:", {
      query,
      category,
      brand,
      minPrice,
      maxPrice,
    });

    try {
      const { data: products } = await sanityFetch({
        query: AI_SEARCH_PRODUCTS_QUERY,
        params: {
          searchQuery: query || "",
          categorySlug: category || "",
          brandSlug: brand || "",
          minPrice: minPrice || 0,
          maxPrice: maxPrice || 0,
        },
      });

      console.log("[SearchProducts] Products found:", products.length);

      if (products.length === 0) {
        return {
          found: false,
          message:
            "Aucun produit trouvé correspondant à vos critères. Essayez d'autres termes de recherche ou filtres.",
          products: [],
          filters: {
            query,
            category,
            brand,
            minPrice,
            maxPrice,
          },
        };
      }

      // Format the results with stock status for the AI to communicate
      const formattedProducts: SearchProduct[] = (
        products as AI_SEARCH_PRODUCTS_QUERYResult
      ).map((product) => ({
        id: product._id,
        name: product.name ?? null,
        slug: product.slug ?? null,
        description: product.description ?? null,
        price: product.priceRetail ?? null,
        priceFormatted: product.priceRetail ? formatPrice(product.priceRetail) : null,
        category: product.category?.title ?? null,
        categorySlug: product.category?.slug ?? null,
        brand: product.brand?.name ?? null,
        brandSlug: product.brand?.slug ?? null,
        unit: product.unit ?? null,
        quantity: product.quantity ?? null,
        servings: product.servings ?? null,
        flavors: product.flavors ?? [],
        benefits: product.benefits ?? [],
        certifications: product.certifications ?? [],
        stockCount: product.stock ?? 0,
        stockStatus: getStockStatus(product.stock),
        stockMessage: getStockMessage(product.stock),
        featured: product.featured ?? false,
        imageUrl: product.image?.asset?.url ?? null,
        productUrl: product.slug ? `/products/${product.slug}` : null,
      }));

      return {
        found: true,
        message: `${products.length} produit${products.length === 1 ? "" : "s"} trouvé${products.length === 1 ? "" : "s"}.`,
        totalResults: products.length,
        products: formattedProducts,
        filters: {
          query,
          category,
          brand,
          minPrice,
          maxPrice,
        },
      };
    } catch (error) {
      console.error("[SearchProducts] Error:", error);
      return {
        found: false,
        message: "Une erreur s'est produite lors de la recherche de produits.",
        products: [],
        error: error instanceof Error ? error.message : "Unknown error",
        filters: {
          query,
          category,
          brand,
          minPrice,
          maxPrice,
        },
      };
    }
  },
});
