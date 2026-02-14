"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Package, Loader2, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ProductRow,
  ProductRowSkeleton,
  AdminSearch,
  useDebouncedValue,
  ProductTableHeader,
} from "@/components/admin";
import type { ProductRowData } from "@/components/admin/ProductRow";

const STOCK_TABS: { value: string; label: string; icon?: typeof AlertTriangle }[] = [
  { value: "all", label: "Tous" },
  { value: "low", label: "Stock faible", icon: AlertTriangle },
  { value: "out", label: "Rupture", icon: XCircle },
];

interface InventoryClientProps {
  products: ProductRowData[];
}

export function InventoryClient({ products }: InventoryClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [stockTab, setStockTab] = useState("all");
  const [isPending, startTransition] = useTransition();
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Apply stock tab filter
    if (stockTab === "low") {
      result = result.filter((p) => p.stock > 0 && p.stock <= 10);
    } else if (stockTab === "out") {
      result = result.filter((p) => p.stock <= 0);
    }

    // Apply search filter
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.slug?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, stockTab, debouncedSearch]);

  const handleCreateProduct = () => {
    startTransition(async () => {
      // Create product via API
      const res = await fetch("/api/admin/products", { method: "POST" });
      if (res.ok) {
        const { id } = await res.json();
        router.push(`/admin/inventory/${id}`);
      }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Inventaire
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Gérer vos stocks et prix
          </p>
        </div>
        <Button
          onClick={handleCreateProduct}
          disabled={isPending}
          className="w-full sm:w-auto bg-dodo-yellow hover:bg-dodo-yellow-hover text-black"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Nouveau produit
        </Button>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearch
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:max-w-xs"
        />

        <Tabs value={stockTab} onValueChange={setStockTab}>
          <TabsList>
            {STOCK_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs sm:text-sm"
                >
                  {Icon && <Icon className="mr-1.5 h-3.5 w-3.5" />}
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title={debouncedSearch || stockTab !== "all" ? "Aucun produit trouvé" : "Aucun produit"}
          description={
            debouncedSearch || stockTab !== "all"
              ? "Essayez d'ajuster vos termes de recherche."
              : "Commencez par ajouter votre premier produit."
          }
          action={
            !debouncedSearch && stockTab === "all"
              ? {
                  label: "Ajouter un produit",
                  onClick: handleCreateProduct,
                  disabled: isPending,
                  icon: isPending ? Loader2 : Plus,
                }
              : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table className="min-w-[800px]">
            <ProductTableHeader />
            <TableBody>
              {filteredProducts.map((product) => (
                <ProductRow key={product._id} product={product} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
