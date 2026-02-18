"use client";

import Image from "next/image";
import Link from "next/link";
import { CircleAlert, ExternalLink, Star } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { isLowStock, isOutOfStock } from "@/lib/constants/stock";
import { StockInput } from "./StockInput";
import { PriceInput } from "./PriceInput";
import { FeaturedToggle } from "./FeaturedToggle";
import { PublishButton, RevertButton } from "./PublishButton";

export interface ProductRowData {
  _id: string;
  name: string;
  slug: string;
  stock: number;
  price: number;
  featured: boolean;
  isDraft?: boolean;
  category?: { title?: string; name?: string } | null;
  image?: { asset?: { url?: string } | null } | null;
}

interface ProductRowProps {
  product: ProductRowData;
}

function ProductRowContent({ product }: ProductRowProps) {
  const lowStock = isLowStock(product.stock);
  const outOfStock = isOutOfStock(product.stock);
  const documentId = product._id.replace("drafts.", "");

  return (
    <TableRow className="group">
      {/* Image - Desktop only */}
      <TableCell className="hidden py-3 sm:table-cell">
        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-secondary">
          {product.image?.asset?.url ? (
            <Image
              src={product.image.asset.url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              ?
            </div>
          )}
        </div>
      </TableCell>

      {/* Name */}
      <TableCell className="py-3 sm:py-4 whitespace-normal max-w-[180px] sm:max-w-[300px]">
        <Link
          href={`/admin/inventory/${documentId}`}
          className="flex items-start gap-3 sm:block"
        >
          {/* Mobile image */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary sm:hidden">
            {product.image?.asset?.url ? (
              <Image
                src={product.image.asset.url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                ?
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground group-hover:text-dodo-yellow line-clamp-2">
                {product.name || "Produit sans nom"}
              </span>
              {product.featured && (
                <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400 sm:hidden" />
              )}
              {product.slug && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`/products/${product.slug}`, "_blank");
                  }}
                  className="hidden shrink-0 opacity-0 transition-opacity group-hover:opacity-100 sm:block"
                  aria-label="Voir le produit"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            {product.isDraft && (
              <div className="mt-1 flex items-center gap-1 sm:hidden">
                <Badge
                  variant="outline"
                  className="h-5 gap-1 border-orange-500/50 bg-orange-500/10 px-1.5 text-[10px] font-medium text-orange-400"
                >
                  <CircleAlert className="h-3 w-3" />
                  Brouillon
                </Badge>
              </div>
            )}
            {(product.category?.title || product.category?.name) && (
              <p className="truncate text-xs text-muted-foreground">
                {product.category.title || product.category.name}
              </p>
            )}
            {/* Mobile: show price and stock inline */}
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs sm:hidden">
              <span className="font-medium text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {product.stock} en stock
              </span>
              {outOfStock && (
                <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                  Rupture
                </Badge>
              )}
              {lowStock && (
                <Badge
                  variant="secondary"
                  className="h-5 bg-amber-500/20 px-1.5 text-[10px] text-amber-400"
                >
                  Faible
                </Badge>
              )}
            </div>
          </div>
        </Link>
      </TableCell>

      {/* Retail Price - Desktop only */}
      <TableCell className="hidden py-4 md:table-cell">
        <span className="text-sm font-medium text-foreground">
          {formatPrice(product.price)}
        </span>
      </TableCell>

      {/* Price Editor - Desktop only */}
      <TableCell className="hidden py-4 lg:table-cell">
        <PriceInput productId={documentId} initialPrice={product.price} />
      </TableCell>

      {/* Stock - Desktop only */}
      <TableCell className="hidden py-4 md:table-cell">
        <div className="flex items-center gap-2">
          <StockInput productId={documentId} initialStock={product.stock} />
          {outOfStock && (
            <Badge variant="destructive" className="text-xs">
              Rupture
            </Badge>
          )}
          {lowStock && (
            <Badge
              variant="secondary"
              className="bg-amber-500/20 text-amber-400"
            >
              Faible
            </Badge>
          )}
        </div>
      </TableCell>

      {/* Featured - Desktop only */}
      <TableCell className="hidden py-4 lg:table-cell">
        <FeaturedToggle productId={documentId} initialFeatured={product.featured} />
      </TableCell>

      {/* Actions - Desktop only */}
      <TableCell className="hidden py-4 sm:table-cell">
        <div className="flex items-center justify-end gap-2">
          <RevertButton documentId={documentId} isDraft={product.isDraft} size="sm" />
          <PublishButton documentId={documentId} isDraft={product.isDraft} size="sm" variant="outline" />
        </div>
      </TableCell>
    </TableRow>
  );
}

function ProductRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="hidden py-3 sm:table-cell">
        <Skeleton className="h-12 w-12 rounded-md" />
      </TableCell>
      <TableCell className="py-3 sm:py-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-md sm:hidden" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-1 h-3 w-20" />
            <div className="mt-1.5 flex gap-2 sm:hidden">
              <Skeleton className="h-3.5 w-14" />
              <Skeleton className="h-3.5 w-16" />
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden py-4 md:table-cell">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="hidden py-4 lg:table-cell">
        <Skeleton className="h-8 w-24" />
      </TableCell>
      <TableCell className="hidden py-4 md:table-cell">
        <Skeleton className="h-8 w-20" />
      </TableCell>
      <TableCell className="hidden py-4 lg:table-cell">
        <Skeleton className="h-8 w-8" />
      </TableCell>
      <TableCell className="hidden py-4 sm:table-cell">
        <Skeleton className="h-8 w-[100px]" />
      </TableCell>
    </TableRow>
  );
}

export function ProductRow({ product }: ProductRowProps) {
  return <ProductRowContent product={product} />;
}

export { ProductRowSkeleton };
