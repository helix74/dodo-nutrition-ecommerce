"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store-provider";
import type { Slug } from "@/sanity.types";

export interface Pack {
  _id: string;
  name: string | null;
  slug: Slug | null;
  tagline: string | null;
  description?: string | null;
  imageUrl: string | null;
  priceOriginal: number | null;
  priceBundle: number | null;
  featured?: boolean | null;
  packCategory: string | null;
  stock: number | null;
  products?: Array<{
    quantity: number | null;
    product: {
      _id: string;
      name: string | null;
      slug: Slug | null;
      priceRetail: number | null;
      stock: number | null;
      imageUrl: string | null;
    } | null;
  }> | null;
  productCount?: number | null;
}

interface PackCardProps {
  pack: Pack;
}

export function PackCard({ pack }: PackCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = (pack.stock ?? 0) <= 0;
  const savings = pack.priceOriginal && pack.priceBundle
    ? Math.round(((pack.priceOriginal - pack.priceBundle) / pack.priceOriginal) * 100)
    : 0;
  
  const productCount = pack.productCount ?? pack.products?.length ?? 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    addItem({
      productId: pack._id,
      name: pack.name ?? "Pack",
      price: pack.priceBundle ?? 0,
      image: pack.imageUrl ?? undefined,
      type: "pack",
    });
  };

  const categoryLabels: Record<string, string> = {
    masse: "Prise de Masse",
    seche: "Sèche",
    performance: "Performance",
    debutant: "Débutant",
    force: "Force",
    endurance: "Endurance",
    sante: "Santé",
  };

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-none bg-transparent p-0 shadow-none transition-all duration-300 hover:-translate-y-1">
      <Link href={`/packs/${pack.slug?.current}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
          {pack.imageUrl ? (
            <Image
              src={pack.imageUrl}
              alt={pack.name ?? "Pack image"}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Package className="h-16 w-16 opacity-30" />
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* PACK badge */}
          <Badge className="absolute left-3 top-3 rounded-full bg-dodo-yellow px-3 py-1 text-xs font-bold text-black shadow-lg">
            <Package className="mr-1 h-3 w-3" />
            PACK
          </Badge>
          
          {/* Out of stock badge */}
          {isOutOfStock && (
            <Badge
              variant="destructive"
              className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium shadow-lg"
            >
              Rupture de Stock
            </Badge>
          )}
          
          {/* Savings badge */}
          {savings > 0 && !isOutOfStock && (
            <Badge className="absolute right-3 bottom-3 rounded-full bg-dodo-red px-2 py-1 text-xs font-bold text-white shadow-lg">
              -{savings}%
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="flex grow flex-col justify-between gap-2 p-5">
        {/* Category */}
        {pack.packCategory && (
          <span className="text-xs font-medium uppercase tracking-wider text-dodo-yellow">
            {categoryLabels[pack.packCategory] ?? pack.packCategory}
          </span>
        )}
        
        <Link href={`/packs/${pack.slug?.current}`} className="block">
          <h3 className="line-clamp-2 text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-muted-foreground">
            {pack.name}
          </h3>
        </Link>
        
        {/* Tagline */}
        {pack.tagline && (
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {pack.tagline}
          </p>
        )}
        
        {/* Product count */}
        <span className="text-sm text-muted-foreground">
          {productCount} produits inclus
        </span>
        
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex flex-col">
            {/* Original price */}
            {pack.priceOriginal && pack.priceOriginal > (pack.priceBundle ?? 0) && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(pack.priceOriginal)}
              </span>
            )}
            {/* Bundle price */}
            <p className="text-xl font-bold tracking-tight text-foreground">
              {formatPrice(pack.priceBundle)}
            </p>
          </div>
          
          {/* Stock indicator */}
          {!isOutOfStock && (pack.stock ?? 0) <= 5 && (
            <Badge variant="secondary" className="text-xs">
              {pack.stock} restants
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto p-5 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full bg-dodo-yellow text-black hover:bg-dodo-yellow-hover disabled:bg-muted disabled:text-muted-foreground"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? "Indisponible" : "Ajouter au Panier"}
        </Button>
      </CardFooter>
    </Card>
  );
}
