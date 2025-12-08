import { PackageSearch } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { FILTER_PRODUCTS_BY_NAME_QUERYResult } from "@/sanity.types";

interface ProductGridProps {
  products: FILTER_PRODUCTS_BY_NAME_QUERYResult;
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
        <PackageSearch className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
        <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
          No products found
        </p>
        <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-500">
          Try adjusting your search or filters to find what you&apos;re looking
          for
        </p>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @md:grid-cols-2 @xl:grid-cols-3 @6xl:grid-cols-4 @md:gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
