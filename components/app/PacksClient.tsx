"use client";

import { useState, useMemo } from "react";
import { PackCard, type Pack } from "@/components/app/PackCard";
import { Package, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SortOption = "default" | "price_asc" | "price_desc" | "savings";

const PACK_CATEGORIES: { value: string; label: string }[] = [
  { value: "masse", label: "Prise de Masse" },
  { value: "seche", label: "S\u00e8che" },
  { value: "performance", label: "Performance" },
  { value: "debutant", label: "D\u00e9butant" },
  { value: "force", label: "Force" },
  { value: "endurance", label: "Endurance" },
  { value: "sante", label: "Sant\u00e9 G\u00e9n\u00e9rale" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Par d\u00e9faut" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix d\u00e9croissant" },
  { value: "savings", label: "Meilleures \u00e9conomies" },
];

interface PacksClientProps {
  packs: Pack[];
}

export function PacksClient({ packs }: PacksClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);

  const availableCategories = useMemo(() => {
    const categoriesInData = new Set(
      packs.map((p) => p.packCategory).filter(Boolean)
    );
    return PACK_CATEGORIES.filter((c) => categoriesInData.has(c.value));
  }, [packs]);

  const filteredAndSorted = useMemo(() => {
    let result = [...packs];

    if (activeCategory) {
      result = result.filter((p) => p.packCategory === activeCategory);
    }

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => (a.priceBundle ?? 0) - (b.priceBundle ?? 0));
        break;
      case "price_desc":
        result.sort((a, b) => (b.priceBundle ?? 0) - (a.priceBundle ?? 0));
        break;
      case "savings":
        result.sort((a, b) => {
          const savingsA = (a.priceOriginal ?? 0) - (a.priceBundle ?? 0);
          const savingsB = (b.priceOriginal ?? 0) - (b.priceBundle ?? 0);
          return savingsB - savingsA;
        });
        break;
    }

    return result;
  }, [packs, activeCategory, sortBy]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Desktop Sidebar Filters */}
      <aside className="hidden lg:block w-60 shrink-0 space-y-6">
        {availableCategories.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-dodo-yellow" />
              Type de Pack
            </h3>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  !activeCategory
                    ? "bg-dodo-yellow/10 font-medium text-dodo-yellow"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                Tous les packs
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === cat.value ? null : cat.value
                    )
                  }
                  className={cn(
                    "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    activeCategory === cat.value
                      ? "bg-dodo-yellow/10 font-medium text-dodo-yellow"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <ArrowUpDown className="h-4 w-4 text-dodo-yellow" />
            Trier par
          </h3>
          <div className="flex flex-col gap-1.5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSortBy(opt.value)}
                className={cn(
                  "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  sortBy === opt.value
                    ? "bg-dodo-yellow/10 font-medium text-dodo-yellow"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Mobile Filter Bar */}
        <div className="mb-4 flex flex-wrap items-center gap-2 lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtrer
          </Button>

          <div className="relative ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none rounded-lg border border-border bg-card px-3 py-2 pr-8 text-sm text-foreground"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Mobile Filter Pills */}
        {showFilters && availableCategories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
            <Badge
              variant={!activeCategory ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                !activeCategory && "bg-dodo-yellow text-black"
              )}
              onClick={() => setActiveCategory(null)}
            >
              Tous
            </Badge>
            {availableCategories.map((cat) => (
              <Badge
                key={cat.value}
                variant={activeCategory === cat.value ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  activeCategory === cat.value && "bg-dodo-yellow text-black"
                )}
                onClick={() =>
                  setActiveCategory(
                    activeCategory === cat.value ? null : cat.value
                  )
                }
              >
                {cat.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Result Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredAndSorted.length}
            </span>{" "}
            pack{filteredAndSorted.length !== 1 ? "s" : ""}{" "}
            {activeCategory
              ? "trouv\u00e9" + (filteredAndSorted.length !== 1 ? "s" : "")
              : "disponible" + (filteredAndSorted.length !== 1 ? "s" : "")}
          </p>
          {activeCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveCategory(null)}
              className="text-xs text-dodo-yellow hover:text-dodo-yellow/80"
            >
              Effacer le filtre
            </Button>
          )}
        </div>

        {/* Packs Grid */}
        {filteredAndSorted.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSorted.map((pack) => (
              <PackCard key={pack._id} pack={pack} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Aucun pack trouv\u00e9
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeCategory
                ? "Aucun pack dans cette cat\u00e9gorie. Essayez un autre filtre."
                : "Nos packs seront bient\u00f4t disponibles."}
            </p>
            {activeCategory && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setActiveCategory(null)}
              >
                Voir tous les packs
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
