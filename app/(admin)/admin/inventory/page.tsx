"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  useDocuments,
  useApplyDocumentActions,
  createDocumentHandle,
  createDocument,
} from "@sanity/sdk-react";
import { Plus, Package, Loader2, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ProductRow,
  ProductRowSkeleton,
  AdminSearch,
  useProductSearchFilter,
  ProductTableHeader,
} from "@/components/admin";

// Stock status tabs
const STOCK_TABS = [
  { value: "all", label: "Tous", filter: undefined },
  { value: "low", label: "Stock faible", filter: "stock > 0 && stock <= 10", icon: AlertTriangle },
  { value: "out", label: "Rupture", filter: "stock <= 0", icon: XCircle },
];

interface ProductListContentProps {
  filter?: string;
  onCreateProduct: () => void;
  isCreating: boolean;
}

function ProductListContent({
  filter,
  onCreateProduct,
  isCreating,
}: ProductListContentProps) {
  const {
    data: products,
    hasMore,
    loadMore,
    isPending,
  } = useDocuments({
    documentType: "product",
    filter,
    orderings: [
      { field: "stock", direction: "asc" },
      { field: "name", direction: "asc" },
    ],
    batchSize: 20,
  });

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={filter ? "Aucun produit trouvé" : "Aucun produit"}
        description={
          filter
            ? "Essayez d'ajuster vos termes de recherche."
            : "Commencez par ajouter votre premier produit."
        }
        action={
          !filter
            ? {
                label: "Ajouter un produit",
                onClick: onCreateProduct,
                disabled: isCreating,
                icon: isCreating ? Loader2 : Plus,
              }
            : undefined
        }
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table className="min-w-[800px]">
          <ProductTableHeader />
          <TableBody>
            {products.map((handle) => (
              <ProductRow key={handle.documentId} {...handle} />
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={() => loadMore()}
            disabled={isPending}
          >
            {isPending ? "Chargement..." : "Charger plus"}
          </Button>
        </div>
      )}
    </>
  );
}

function ProductListSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <ProductTableHeader />
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <ProductRowSkeleton key={i} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function InventoryContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [stockTab, setStockTab] = useState("all");
  const [isPending, startTransition] = useTransition();
  const { filter: searchFilter, isSearching } = useProductSearchFilter(searchQuery);
  const apply = useApplyDocumentActions();

  // Combine search filter with stock tab filter
  const stockTabConfig = STOCK_TABS.find((t) => t.value === stockTab);
  const stockFilter = stockTabConfig?.filter;
  
  // Build combined filter
  let combinedFilter: string | undefined;
  if (searchFilter && stockFilter) {
    combinedFilter = `(${searchFilter}) && (${stockFilter})`;
  } else if (searchFilter) {
    combinedFilter = searchFilter;
  } else if (stockFilter) {
    combinedFilter = stockFilter;
  }

  const handleCreateProduct = () => {
    startTransition(async () => {
      const newDocHandle = createDocumentHandle({
        documentId: crypto.randomUUID(),
        documentType: "product",
      });
      await apply(createDocument(newDocHandle));
      router.push(`/admin/inventory/${newDocHandle.documentId}`);
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
      {isSearching ? (
        <ProductListSkeleton />
      ) : (
        <Suspense key={`${combinedFilter ?? "all"}`} fallback={<ProductListSkeleton />}>
          <ProductListContent
            filter={combinedFilter}
            onCreateProduct={handleCreateProduct}
            isCreating={isPending}
          />
        </Suspense>
      )}
    </div>
  );
}

export default function InventoryPage() {
  return <InventoryContent />;
}
