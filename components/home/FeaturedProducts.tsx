import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/app/ProductCard";
import type { FEATURED_PRODUCTS_QUERYResult } from "@/sanity.types";

interface FeaturedProductsProps {
  products: FEATURED_PRODUCTS_QUERYResult;
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-sm font-medium text-dodo-yellow uppercase tracking-wider">
              Best-sellers
            </span>
            <h2 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
              Produits Vedettes
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="hidden sm:flex border-border text-foreground hover:bg-secondary"
          >
            <Link href="/shop">
              Voir tout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product as unknown as Parameters<typeof ProductCard>[0]['product']} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Button
            asChild
            className="bg-dodo-yellow text-black font-semibold hover:bg-dodo-yellow/90"
          >
            <Link href="/shop">
              Voir tous les produits
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
