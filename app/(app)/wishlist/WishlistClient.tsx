"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useWishlistActions, useWishlistItems } from "@/lib/store/wishlist-store-provider";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/app/AddToCartButton";

export function WishlistClient() {
  const items = useWishlistItems();
  const { removeItem } = useWishlistActions();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 rounded-full bg-secondary/50 p-6">
          <ShoppingCart className="h-12 w-12 text-muted-foreground opacity-50" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Votre wishlist est vide</h2>
        <p className="mt-2 text-muted-foreground">
          Vous n&apos;avez pas encore ajouté de produits à votre wishlist.
        </p>
        <Button asChild className="mt-8 bg-dodo-yellow text-black hover:bg-dodo-yellow-hover">
          <Link href="/shop">Découvrir nos produits</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Ma Wishlist ({items.length})</h1>
        <Button asChild variant="outline">
          <Link href="/shop">Continuer mes achats</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <Card key={item.productId} className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-none bg-card shadow-sm transition-all hover:shadow-md">
            <div className="relative aspect-square overflow-hidden bg-secondary/20">
              <Link href={`/products/${item.slug}`} className="block h-full w-full">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Pas d'image
                  </div>
                )}
              </Link>
              
              <button
                onClick={() => removeItem(item.productId)}
                className="absolute right-3 top-3 rounded-full bg-background/80 p-2 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                aria-label="Retirer de la wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <CardContent className="flex grow flex-col gap-2 p-4">
              <Link href={`/products/${item.slug}`} className="block">
                <h3 className="line-clamp-2 font-semibold hover:text-dodo-yellow transition-colors">
                  {item.name}
                </h3>
              </Link>
              <p className="text-lg font-bold text-dodo-yellow">
                {formatPrice(item.price)}
              </p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <AddToCartButton
                productId={item.productId}
                name={item.name}
                price={item.price}
                image={item.image}
                stock={999} // Assuming in stock for wishlist display, or we'd need to fetch stock
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
