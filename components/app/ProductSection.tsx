"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "./ProductFilters";
import { ProductGrid } from "./ProductGrid";
import type {
  ALL_CATEGORIES_QUERYResult,
  PROMOTIONS_QUERYResult,
} from "@/sanity.types";

interface Brand {
  _id: string;
  name: string | null;
  slug: string | null;
}

interface ProductSectionProps {
  categories: ALL_CATEGORIES_QUERYResult;
  brands?: Brand[];
  products: PROMOTIONS_QUERYResult;
  searchQuery: string;
}

export function ProductSection({
  categories,
  brands = [],
  products,
  searchQuery,
}: ProductSectionProps) {
  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      {/* Header with results count and filter toggle */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {products.length} {products.length === 1 ? "produit" : "produits"}{" "}
          trouvé{products.length !== 1 ? "s" : ""}
          {searchQuery && (
            <span>
              {" "}
              pour &quot;<span className="font-medium">{searchQuery}</span>&quot;
            </span>
          )}
        </p>

        {/* Filter toggle button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 border-zinc-300 bg-white shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          aria-label={filtersOpen ? "Masquer les filtres" : "Afficher les filtres"}
        >
          {filtersOpen ? (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span className="hidden sm:inline">Masquer Filtres</span>
              <span className="sm:hidden">Masquer</span>
            </>
          ) : (
            <>
              <PanelLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Afficher Filtres</span>
              <span className="sm:hidden">Filtres</span>
            </>
          )}
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters - completely hidden when collapsed on desktop */}
        <aside
          className={`shrink-0 transition-all duration-300 ease-in-out ${
            filtersOpen ? "w-full lg:w-72 lg:opacity-100" : "hidden lg:hidden"
          }`}
        >
          <ProductFilters categories={categories} brands={brands} />
        </aside>

        {/* Product Grid - expands to full width when filters hidden */}
        <main className="flex-1 transition-all duration-300">
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}
