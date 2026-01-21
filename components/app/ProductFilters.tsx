"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { SORT_OPTIONS } from "@/lib/constants/filters";
import type { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

interface Brand {
  _id: string;
  name: string | null;
  slug: string | null;
}

interface ProductFiltersProps {
  categories: ALL_CATEGORIES_QUERYResult;
  brands?: Brand[];
}

export function ProductFilters({ categories, brands = [] }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("q") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentBrand = searchParams.get("brand") ?? "";
  const currentSort = searchParams.get("sort") ?? "name";
  const urlMinPrice = Number(searchParams.get("minPrice")) || 0;
  const urlMaxPrice = Number(searchParams.get("maxPrice")) || 500;
  const currentInStock = searchParams.get("inStock") === "true";

  // Local state for price range (for smooth slider dragging)
  const [priceRange, setPriceRange] = useState<[number, number]>([
    urlMinPrice,
    urlMaxPrice,
  ]);

  // Sync local state when URL changes
  useEffect(() => {
    setPriceRange([urlMinPrice, urlMaxPrice]);
  }, [urlMinPrice, urlMaxPrice]);

  // Check which filters are active
  const isSearchActive = !!currentSearch;
  const isCategoryActive = !!currentCategory;
  const isBrandActive = !!currentBrand;
  const isPriceActive = urlMinPrice > 0 || urlMaxPrice < 500;
  const isInStockActive = currentInStock;

  const hasActiveFilters =
    isSearchActive ||
    isCategoryActive ||
    isBrandActive ||
    isPriceActive ||
    isInStockActive;

  // Count active filters
  const activeFilterCount = [
    isSearchActive,
    isCategoryActive,
    isBrandActive,
    isPriceActive,
    isInStockActive,
  ].filter(Boolean).length;

  const updateParams = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === 0) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    updateParams({ q: searchQuery || null });
  };

  const handleClearFilters = () => {
    router.push("/", { scroll: false });
  };

  const clearSingleFilter = (key: string) => {
    if (key === "price") {
      updateParams({ minPrice: null, maxPrice: null });
    } else {
      updateParams({ [key]: null });
    }
  };

  // Helper for filter label with active indicator
  const FilterLabel = ({
    children,
    isActive,
    filterKey,
  }: {
    children: React.ReactNode;
    isActive: boolean;
    filterKey: string;
  }) => (
    <div className="mb-2 flex items-center justify-between">
      <span
        className={`block text-sm font-medium ${
          isActive
            ? "text-zinc-900 dark:text-zinc-100"
            : "text-zinc-700 dark:text-zinc-300"
        }`}
      >
        {children}
        {isActive && (
          <Badge className="ml-2 h-5 bg-amber-500 px-1.5 text-xs text-white hover:bg-amber-500">
            Actif
          </Badge>
        )}
      </span>
      {isActive && (
        <button
          type="button"
          onClick={() => clearSingleFilter(filterKey)}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          aria-label={`Effacer le filtre ${filterKey}`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-6">
      {/* Clear Filters - Show at top when active */}
      {hasActiveFilters && (
        <div className="rounded-lg border border-dodo-yellow/20 bg-dodo-yellow/10 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-dodo-yellow">
              {activeFilterCount}{" "}
              {activeFilterCount === 1 ? "filtre actif" : "filtres actifs"}
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleClearFilters}
            className="w-full bg-dodo-yellow text-black hover:bg-dodo-yellow-hover"
          >
            <X className="mr-2 h-4 w-4" />
            Effacer tous les filtres
          </Button>
        </div>
      )}

      {/* Search */}
      <div>
        <FilterLabel isActive={isSearchActive} filterKey="q">
          Rechercher
        </FilterLabel>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            name="search"
            placeholder="Rechercher un produit..."
            defaultValue={currentSearch}
            className={`flex-1 bg-background border-input ${
              isSearchActive
                ? "border-dodo-yellow ring-1 ring-dodo-yellow"
                : ""
            }`}
          />
          <Button type="submit" size="sm" variant="secondary">
            OK
          </Button>
        </form>
      </div>

      {/* Category */}
      <div>
        <FilterLabel isActive={isCategoryActive} filterKey="category">
          Catégorie
        </FilterLabel>
        <Select
          value={currentCategory || "all"}
          onValueChange={(value) =>
            updateParams({ category: value === "all" ? null : value })
          }
        >
          <SelectTrigger
            className={`bg-background border-input ${
              isCategoryActive
                ? "border-dodo-yellow ring-1 ring-dodo-yellow"
                : ""
            }`}
          >
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category.slug ?? ""}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div>
        <FilterLabel isActive={isBrandActive} filterKey="brand">
          Marque
        </FilterLabel>
        <Select
          value={currentBrand || "all"}
          onValueChange={(value) =>
            updateParams({ brand: value === "all" ? null : value })
          }
        >
          <SelectTrigger
            className={`bg-background border-input ${
              isBrandActive
                ? "border-dodo-yellow ring-1 ring-dodo-yellow"
                : ""
            }`}
          >
            <SelectValue placeholder="Toutes les marques" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les marques</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand._id} value={brand.slug ?? ""}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <FilterLabel isActive={isPriceActive} filterKey="price">
          Prix: {priceRange[0]} - {priceRange[1]} TND
        </FilterLabel>
        <Slider
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          onValueCommit={([min, max]) =>
            updateParams({
              minPrice: min > 0 ? min : null,
              maxPrice: max < 500 ? max : null,
            })
          }
          className={`mt-4 ${isPriceActive ? "[&_[role=slider]]:border-dodo-yellow [&_[role=slider]]:ring-dodo-yellow" : ""}`}
        />
      </div>

      {/* In Stock Only */}
      <div>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={currentInStock}
            onChange={(e) =>
              updateParams({ inStock: e.target.checked ? "true" : null })
            }
            className="h-5 w-5 rounded border-input bg-background text-dodo-yellow focus:ring-dodo-yellow"
          />
          <span
            className={`text-sm font-medium ${
              isInStockActive
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            En stock uniquement
            {isInStockActive && (
              <Badge className="ml-2 h-5 bg-dodo-yellow px-1.5 text-xs text-black hover:bg-dodo-yellow-hover">
                Actif
              </Badge>
            )}
          </span>
        </label>
      </div>

      {/* Sort */}
      <div>
        <span className="mb-2 block text-sm font-medium text-muted-foreground">
          Trier par
        </span>
        <Select
          value={currentSort}
          onValueChange={(value) => updateParams({ sort: value })}
        >
          <SelectTrigger className="bg-background border-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
