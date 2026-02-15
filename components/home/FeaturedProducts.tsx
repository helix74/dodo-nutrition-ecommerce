"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AddToCartButton } from "@/components/app/AddToCartButton";
import { formatPrice } from "@/lib/utils";

type FeaturedProduct = {
  _id: string;
  name: string | null;
  slug: string | null;
  priceRetail: number | null;
  priceSlashed?: number | null;
  images?: Array<{ asset?: { _id?: string; url?: string } | null } | null>;
  brand?: { name?: string | null } | null;
  stock?: number | null;
};

type BadgeType = "best-seller" | "new" | "promo";

interface FeaturedProductsProps {
  featured: FeaturedProduct[];
  newProducts: FeaturedProduct[];
  promoProducts: FeaturedProduct[];
}

function getPromoPercent(priceRetail: number, priceSlashed: number): number {
  if (priceSlashed <= 0) return 0;
  return Math.round(((priceSlashed - priceRetail) / priceSlashed) * 100);
}

function ProductCard({
  product,
  badge,
}: {
  product: FeaturedProduct;
  badge: BadgeType;
}) {
  const images = product.images ?? [];
  const mainImage = images[0]?.asset?.url;
  const priceRetail = product.priceRetail ?? 0;
  const priceSlashed = product.priceSlashed ?? 0;
  const hasPromo = priceSlashed > priceRetail;
  const stock = product.stock ?? 0;

  const badgeEl =
    badge === "best-seller" ? (
      <span className="absolute left-3 top-3 z-10 rounded-full bg-dodo-yellow px-3 py-1 text-xs font-bold text-black shadow-lg">
        Best-seller
      </span>
    ) : badge === "new" ? (
      <span className="absolute left-3 top-3 z-10 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
        جديد
      </span>
    ) : badge === "promo" && hasPromo ? (
      <span className="absolute left-3 top-3 z-10 rounded-full bg-dodo-red px-3 py-1 text-xs font-bold text-white shadow-lg">
        -{getPromoPercent(priceRetail, priceSlashed)}%
      </span>
    ) : null;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-transparent bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-dodo-yellow/50 hover:shadow-[0_10px_40px_-10px_rgba(254,226,87,0.15)] dark:bg-zinc-900/50">
      <div className="relative aspect-4/5 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name ?? "Product"}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 75vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              <svg
                className="h-16 w-16 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </Link>
        {badgeEl}
      </div>

      <div className="flex grow flex-col justify-between gap-2 p-5">
        {product.brand?.name && (
          <span className="text-xs font-medium uppercase tracking-wider text-dodo-yellow">
            {product.brand.name}
          </span>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-muted-foreground">
            {product.name}
          </h3>
        </Link>
        <div className="flex flex-col gap-1">
          {hasPromo && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(priceSlashed)}
            </span>
          )}
          <p className="text-xl font-bold tracking-tight text-foreground">
            {formatPrice(priceRetail)}
          </p>
        </div>
        <AddToCartButton
          productId={product._id}
          name={product.name ?? "Unknown Product"}
          price={priceRetail}
          image={mainImage}
          stock={stock}
          label="زيدو للقضية"
          className="mt-auto bg-dodo-yellow text-black font-semibold hover:bg-dodo-yellow/90"
        />
      </div>
    </div>
  );
}

export function FeaturedProducts({
  featured,
  newProducts,
  promoProducts,
}: FeaturedProductsProps) {
  const hasAny =
    featured.length > 0 || newProducts.length > 0 || promoProducts.length > 0;
  if (!hasAny) return null;

  const tabContent = (
    products: FeaturedProduct[],
    badge: BadgeType,
    emptyMessage: string
  ) => {
    if (products.length === 0) {
      return (
        <p className="py-12 text-center text-muted-foreground">
          {emptyMessage}
        </p>
      );
    }

    return (
      <>
        {/* Desktop: Grid 4 columns */}
        <div className="hidden grid-cols-1 gap-6 sm:grid-cols-2 md:grid lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} badge={badge} />
          ))}
        </div>
        {/* Mobile: Embla Carousel */}
        <div className="md:hidden">
          <Carousel
            opts={{ align: "start", loop: false, dragFree: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {products.map((product) => (
                <CarouselItem
                  key={product._id}
                  className="pl-4 basis-[75%] sm:basis-1/2"
                >
                  <ProductCard product={product} badge={badge} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-2 border-border bg-card text-foreground hover:bg-secondary" />
            <CarouselNext className="-right-2 border-border bg-card text-foreground hover:bg-secondary" />
          </Carousel>
        </div>
      </>
    );
  };

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-sm font-medium text-dodo-yellow uppercase tracking-wider">
              Best-sellers
            </span>
            <h2 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
              الأفضل عندنا
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

        <Tabs defaultValue="best-sellers" className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md grid-cols-3 bg-muted p-1">
            <TabsTrigger value="best-sellers">Best-sellers</TabsTrigger>
            <TabsTrigger value="new">جداد</TabsTrigger>
            <TabsTrigger value="promos">Promos</TabsTrigger>
          </TabsList>

          <TabsContent value="best-sellers">
            {tabContent(
              featured,
              "best-seller",
              "Aucun produit vedette pour le moment."
            )}
          </TabsContent>
          <TabsContent value="new">
            {tabContent(
              newProducts,
              "new",
              "Aucun nouveau produit pour le moment."
            )}
          </TabsContent>
          <TabsContent value="promos">
            {tabContent(
              promoProducts,
              "promo",
              "Aucune promo pour le moment."
            )}
          </TabsContent>
        </Tabs>

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
