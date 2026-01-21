import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import {
  FILTER_PRODUCTS_BY_NAME_QUERY,
  FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
  FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
  ALL_BRANDS_QUERY,
} from "@/lib/sanity/queries/products";
import { ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries/categories";
import { ProductSection } from "@/components/app/ProductSection";
import { ProductFiltersSkeleton } from "@/components/app/ProductFiltersSkeleton";
import { ProductGridSkeleton } from "@/components/app/ProductGridSkeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop - Tous les Produits | Dodo Nutrition",
  description: "Découvrez notre sélection complète de suppléments et nutrition sportive. Protéines, créatine, pre-workout, vitamines et plus.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
  }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const searchQuery = params.q ?? "";
  const categorySlug = params.category ?? "";
  const brandSlug = params.brand ?? "";
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || 0;
  const sort = params.sort ?? "name";
  const inStock = params.inStock === "true";

  // Select query based on sort parameter
  const getQuery = () => {
    if (searchQuery && sort === "relevance") {
      return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
    }

    switch (sort) {
      case "price_asc":
        return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY;
      case "price_desc":
        return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY;
      case "relevance":
        return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
      default:
        return FILTER_PRODUCTS_BY_NAME_QUERY;
    }
  };

  // Fetch products with filters
  const { data: products } = await sanityFetch({
    query: getQuery(),
    params: {
      searchQuery,
      categorySlug,
      brandSlug,
      minPrice,
      maxPrice,
      inStock,
    },
  });

  // Fetch categories for filter sidebar
  const { data: categories } = await sanityFetch({
    query: ALL_CATEGORIES_QUERY,
  });

  // Fetch brands for filter sidebar
  const { data: brands } = await sanityFetch({
    query: ALL_BRANDS_QUERY,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm text-muted-foreground">
            <a href="/" className="hover:text-dodo-yellow">Accueil</a>
            <span className="mx-2">/</span>
            <span className="text-foreground">Shop</span>
            {categorySlug && (
              <>
                <span className="mx-2">/</span>
                <span className="text-foreground capitalize">{categorySlug.replace(/-/g, ' ')}</span>
              </>
            )}
          </nav>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {categorySlug 
              ? categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
              : brandSlug
              ? `Produits ${brandSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`
              : "Tous les Produits"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {searchQuery 
              ? `Résultats pour "${searchQuery}"`
              : "Suppléments et nutrition sportive de qualité premium"}
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="flex gap-8">
            <ProductFiltersSkeleton />
            <ProductGridSkeleton />
          </div>
        }>
          <ProductSection
            categories={categories}
            brands={brands}
            products={products}
            searchQuery={searchQuery}
          />
        </Suspense>
      </div>
    </div>
  );
}
