import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import {
  FILTER_PRODUCTS_BY_NAME_PAGINATED_QUERY,
  FILTER_PRODUCTS_BY_PRICE_ASC_PAGINATED_QUERY,
  FILTER_PRODUCTS_BY_PRICE_DESC_PAGINATED_QUERY,
  FILTER_PRODUCTS_BY_RELEVANCE_PAGINATED_QUERY,
  COUNT_FILTERED_PRODUCTS_QUERY,
  SHOP_PAGE_SIZE,
  ALL_BRANDS_QUERY,
} from "@/lib/sanity/queries/products";
import { ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries/categories";
import { ProductSection } from "@/components/app/ProductSection";
import { ProductFiltersSkeleton } from "@/components/app/ProductFiltersSkeleton";
import { ProductGridSkeleton } from "@/components/app/ProductGridSkeleton";
import { Pagination } from "@/components/app/Pagination";
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
    page?: string;
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
  const currentPage = Math.max(1, Number(params.page) || 1);
  const offset = (currentPage - 1) * SHOP_PAGE_SIZE;

  // Select paginated query based on sort parameter
  const getQuery = () => {
    if (searchQuery && sort === "relevance") {
      return FILTER_PRODUCTS_BY_RELEVANCE_PAGINATED_QUERY;
    }

    switch (sort) {
      case "price_asc":
        return FILTER_PRODUCTS_BY_PRICE_ASC_PAGINATED_QUERY;
      case "price_desc":
        return FILTER_PRODUCTS_BY_PRICE_DESC_PAGINATED_QUERY;
      case "relevance":
        return FILTER_PRODUCTS_BY_RELEVANCE_PAGINATED_QUERY;
      default:
        return FILTER_PRODUCTS_BY_NAME_PAGINATED_QUERY;
    }
  };

  const filterParams = {
    searchQuery,
    categorySlug,
    brandSlug,
    minPrice,
    maxPrice,
    inStock,
    offset,
  };

  // Fetch products and count in parallel
  const [productsResult, countResult, categoriesResult, brandsResult] = await Promise.all([
    sanityFetch({
      query: getQuery(),
      params: filterParams,
    }),
    sanityFetch({
      query: COUNT_FILTERED_PRODUCTS_QUERY,
      params: filterParams,
    }),
    sanityFetch({
      query: ALL_CATEGORIES_QUERY,
    }),
    sanityFetch({
      query: ALL_BRANDS_QUERY,
    }),
  ]);

  const products = productsResult.data;
  const totalProducts = countResult.data ?? 0;
  const categories = categoriesResult.data;
  const brands = brandsResult.data;

  const totalPages = Math.ceil(totalProducts / SHOP_PAGE_SIZE);

  // Build search params for pagination links (exclude page)
  const searchParamsForPagination: Record<string, string> = {};
  if (params.q) searchParamsForPagination.q = params.q;
  if (params.category) searchParamsForPagination.category = params.category;
  if (params.brand) searchParamsForPagination.brand = params.brand;
  if (params.minPrice) searchParamsForPagination.minPrice = params.minPrice;
  if (params.maxPrice) searchParamsForPagination.maxPrice = params.maxPrice;
  if (params.sort) searchParamsForPagination.sort = params.sort;
  if (params.inStock) searchParamsForPagination.inStock = params.inStock;

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

          <div className="flex items-center justify-between">
            <div>
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
            <div className="hidden sm:block text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{totalProducts}</span> produit{totalProducts !== 1 ? 's' : ''}
              {totalPages > 1 && (
                <span className="ml-2">
                  · Page {currentPage} sur {totalPages}
                </span>
              )}
            </div>
          </div>
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/shop"
          searchParams={searchParamsForPagination}
        />
      </div>
    </div>
  );
}
