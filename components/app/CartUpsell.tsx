"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  useCartItems,
  useCartActions,
} from "@/lib/store/cart-store-provider";
import { toast } from "sonner";

interface UpsellProduct {
  _id: string;
  name: string;
  slug: string;
  priceRetail: number | null;
  imageUrl: string | null;
}

export function CartUpsell() {
  const items = useCartItems();
  const { addItem } = useCartActions();
  const [suggestions, setSuggestions] = useState<UpsellProduct[]>([]);

  const cartKey = items.map((i) => i.productId).join(",");

  useEffect(() => {
    if (items.length === 0) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const productIds = items.map((i) => i.productId);

    fetch("/api/cart-upsell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setSuggestions(data.products ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey]);

  if (items.length === 0 || suggestions.length === 0) return null;

  const handleAdd = (product: UpsellProduct) => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.priceRetail ?? 0,
      image: product.imageUrl ?? undefined,
    });
    toast.success(`${product.name} ajout\u00e9 au panier`);
  };

  return (
    <div className="border-t border-border px-5 py-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Sparkles className="h-4 w-4 text-dodo-yellow" />
        Vous aimerez aussi
      </h4>
      <div className="space-y-2">
        {suggestions.map((product) => (
          <div
            key={product._id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-2"
          >
            <Link
              href={`/products/${product.slug}`}
              className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary"
            >
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  N/A
                </div>
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {product.name}
              </p>
              <p className="text-xs font-semibold text-dodo-yellow">
                {formatPrice(product.priceRetail)}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 gap-1 text-xs h-8 border-dodo-yellow/30 text-dodo-yellow hover:bg-dodo-yellow hover:text-black"
              onClick={() => handleAdd(product)}
            >
              <Plus className="h-3 w-3" />
              Ajouter
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
