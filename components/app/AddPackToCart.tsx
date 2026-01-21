"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store-provider";

interface Pack {
  _id: string;
  name: string | null;
  priceBundle: number | null;
  imageUrl: string | null;
  stock: number | null;
}

interface AddPackToCartProps {
  pack: Pack;
}

export function AddPackToCart({ pack }: AddPackToCartProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const isOutOfStock = (pack.stock ?? 0) <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    addItem({
      productId: pack._id,
      name: pack.name ?? "Pack",
      price: pack.priceBundle ?? 0,
      image: pack.imageUrl ?? undefined,
      type: "pack",
    });
    
    openCart();
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      size="lg"
      className="w-full bg-dodo-yellow text-black hover:bg-dodo-yellow-hover disabled:bg-muted disabled:text-muted-foreground"
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {isOutOfStock ? "Rupture de Stock" : "Ajouter le Pack au Panier"}
    </Button>
  );
}
