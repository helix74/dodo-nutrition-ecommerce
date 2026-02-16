"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PackProduct {
  quantity: number;
  product: {
    _id: string;
    name: string | null;
    slug: { current?: string } | null;
    imageUrl: string | null;
  } | null;
}

interface Pack {
  _id: string;
  name: string | null;
  slug: { current?: string } | null;
  tagline: string | null;
  imageUrl: string | null;
  priceOriginal: number | null;
  priceBundle: number | null;
  packCategory: string | null;
  stock: number | null;
  products?: PackProduct[] | null;
  productCount?: number | null;
}

interface FeaturedPackCardProps {
  pack: Pack;
}

export function FeaturedPackCard({ pack }: FeaturedPackCardProps) {
  const savings =
    pack.priceOriginal != null && pack.priceBundle != null
      ? Math.round(pack.priceOriginal - pack.priceBundle)
      : 0;
  const products = pack.products ?? [];
  const productCount = pack.productCount ?? products.length;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Large pack image at top */}
      <Link href={`/packs/${pack.slug?.current ?? pack._id}`} className="block">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-secondary">
          {pack.imageUrl ? (
            <Image
              src={pack.imageUrl}
              alt={pack.name ?? "Pack image"}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Package className="h-16 w-16 opacity-30" />
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {/* Pack name + tagline */}
        <Link href={`/packs/${pack.slug?.current ?? pack._id}`} className="block">
          <h3 className="text-lg font-bold text-foreground line-clamp-2">
            {pack.name}
          </h3>
          {pack.tagline && (
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
              {pack.tagline}
            </p>
          )}
        </Link>

        {/* Pricing block */}
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          {pack.priceOriginal != null &&
            pack.priceBundle != null &&
            pack.priceOriginal > pack.priceBundle && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(pack.priceOriginal)}
              </span>
            )}
          <span className="text-xl font-bold text-dodo-yellow">
            {formatPrice(pack.priceBundle)}
          </span>
          {savings > 0 && (
            <span className="rounded-full bg-dodo-red px-2.5 py-0.5 text-xs font-bold text-white">
              -{savings} TND
            </span>
          )}
        </div>

        {/* List of included products */}
        {products.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1.5">
            {products.slice(0, 4).map((item) => {
              const prod = item.product;
              if (!prod?.name) return null;
              return (
                <li key={prod._id} className="flex items-center gap-2 text-sm">
                  {prod.imageUrl ? (
                    <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded">
                      <Image
                        src={prod.imageUrl}
                        alt=""
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted">
                      <Package className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}
                  <span className="line-clamp-1 text-muted-foreground">
                    {item.quantity > 1 ? `${item.quantity}× ` : ""}
                    {prod.name}
                  </span>
                </li>
              );
            })}
            {productCount > 4 && (
              <li className="text-xs text-muted-foreground">
                +{productCount - 4} produits
              </li>
            )}
          </ul>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4">
          <Link
            href={`/packs/${pack.slug?.current ?? pack._id}`}
            className="inline-flex w-full items-center justify-center rounded-lg bg-dodo-yellow px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-dodo-yellow-hover"
          >
            Voir le pack
          </Link>
        </div>
      </div>
    </article>
  );
}
