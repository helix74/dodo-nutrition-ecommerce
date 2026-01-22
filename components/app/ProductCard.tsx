"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/app/AddToCartButton";
import { WishlistButton } from "@/components/app/WishlistButton";

import { StockBadge } from "@/components/app/StockBadge";
import type { FILTER_PRODUCTS_BY_NAME_QUERYResult } from "@/sanity.types";

type Product = FILTER_PRODUCTS_BY_NAME_QUERYResult[number];

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(
    null,
  );

  const images = product.images ?? [];
  const mainImageUrl = images[0]?.asset?.url;
  const displayedImageUrl =
    hoveredImageIndex !== null
      ? images[hoveredImageIndex]?.asset?.url
      : mainImageUrl;

  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const hasMultipleImages = images.length > 1;

  // Format unit display
  const formatUnit = (unit: string | null | undefined) => {
    const unitMap: Record<string, string> = {
      gramme: 'g',
      kilogramme: 'kg',
      millilitre: 'ml',
      gélule: 'gél',
      capsule: 'caps',
      comprimé: 'comp',
    };
    return unit ? unitMap[unit] || unit : '';
  };

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-transparent bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-dodo-yellow/50 hover:shadow-[0_10px_40px_-10px_rgba(254,226,87,0.15)] dark:bg-zinc-900/50">
      <div
        className={cn(
          "relative overflow-hidden",
          hasMultipleImages ? "aspect-square" : "aspect-4/5",
        )}
      >
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {displayedImageUrl ? (
            <Image
              src={displayedImageUrl}
              alt={product.name ?? "Product image"}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
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
          {/* Gradient overlay for text contrast */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        {/* Wishlist Button - Top Right */}
        <div className="absolute right-3 top-3 z-20">
          <WishlistButton 
            product={{
              _id: product._id,
              name: product.name ?? "",
              priceRetail: product.priceRetail ?? 0,
              image: mainImageUrl ? { asset: { url: mainImageUrl } } : undefined,
              slug: product.slug ? { current: product.slug } : undefined
            }} 
          />
        </div>

        {/* Stock Badge - Top Left */}
        {isOutOfStock && (
          <Badge
            variant="destructive"
            className="absolute left-3 top-3 z-20 rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm"
          >
            Rupture
          </Badge>
        )}

        {/* Category badge - Top Left (only if in stock) */}
        {product.category && !isOutOfStock && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur-sm dark:bg-zinc-900/90 dark:text-zinc-300">
            {product.category.title}
          </span>
        )}

        {/* Slashed price badge - Bottom Right */}
        {product.priceSlashed && product.priceSlashed > (product.priceRetail ?? 0) && (
          <Badge className="absolute right-3 bottom-3 z-10 rounded-full bg-dodo-red px-2.5 py-1 text-xs font-bold text-white shadow-lg shadow-red-500/20 animate-pulse">
            PROMO
          </Badge>
        )}
      </div>

      {/* Thumbnail strip - only show if multiple images */}
      {hasMultipleImages && (
        <div className="flex gap-2 border-t border-border bg-card p-3">
          {images.map((image, index) => (
            <button
              key={image._key ?? index}
              type="button"
              className={cn(
                "relative h-14 flex-1 overflow-hidden rounded-lg transition-all duration-200",
                hoveredImageIndex === index
                  ? "ring-2 ring-zinc-900 ring-offset-2 dark:ring-white dark:ring-offset-zinc-900"
                  : "opacity-50 hover:opacity-100",
              )}
              onMouseEnter={() => setHoveredImageIndex(index)}
              onMouseLeave={() => setHoveredImageIndex(null)}
            >
              {image.asset?.url && (
                <Image
                  src={image.asset.url}
                  alt={`${product.name} - view ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <CardContent className="flex grow flex-col justify-between gap-2 p-5">
        {/* Brand name */}
        {product.brand && (
          <span className="text-xs font-medium uppercase tracking-wider text-dodo-yellow">
            {product.brand.name}
          </span>
        )}
        
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-2 text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-muted-foreground">
            {product.name}
          </h3>
        </Link>
        
        {/* Quantity info */}
        {product.quantity && product.unit && (
          <span className="text-sm text-muted-foreground">
            {product.quantity}{formatUnit(product.unit)}
          </span>
        )}
        
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex flex-col">
            {/* Slashed price */}
            {product.priceSlashed && product.priceSlashed > (product.priceRetail ?? 0) && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.priceSlashed)}
              </span>
            )}
            {/* Main price */}
            <p className="text-xl font-bold tracking-tight text-foreground">
              {formatPrice(product.priceRetail)}
            </p>
          </div>
          <StockBadge productId={product._id} stock={stock} />
        </div>
      </CardContent>

      <CardFooter className="mt-auto p-5 pt-0">
        <AddToCartButton
          productId={product._id}
          name={product.name ?? "Unknown Product"}
          price={product.priceRetail ?? 0}
          image={mainImageUrl ?? undefined}
          stock={stock}
        />
      </CardFooter>
    </Card>
  );
}
