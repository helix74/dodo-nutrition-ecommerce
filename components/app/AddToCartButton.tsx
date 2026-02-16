"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartActions, useCartItem } from "@/lib/store/cart-store-provider";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
  className?: string;
  /** Custom label for the add button (default: "Add to Basket") */
  label?: string;
}

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  stock,
  className,
  label = "زيدو للقضيّة",
}: AddToCartButtonProps) {
  const { addItem, updateQuantity } = useCartActions();
  const cartItem = useCartItem(productId);

  const quantityInCart = cartItem?.quantity ?? 0;
  const isOutOfStock = stock <= 0;
  const isAtMax = quantityInCart >= stock;

  const handleAdd = () => {
    if (quantityInCart < stock) {
      addItem({ productId, name, price, image }, 1);
      toast.success(`Added ${name}`);
    }
  };

  const handleDecrement = () => {
    if (quantityInCart > 0) {
      updateQuantity(productId, quantityInCart - 1);
    }
  };

  // Out of stock
  if (isOutOfStock) {
    return (
      <Button
        disabled
        variant="secondary"
        className={cn("h-12 w-full text-sm", className)}
      >
        Rupture de stock
      </Button>
    );
  }

  // Not in cart - show Add to Basket button
  if (quantityInCart === 0) {
    return (
      <Button onClick={handleAdd} className={cn("h-12 w-full text-sm", className)}>
        <ShoppingBag className="mr-2 h-4 w-4" />
        {label}
      </Button>
    );
  }

  // In cart - show quantity controls
  return (
    <div
      className={cn(
        "flex h-12 w-full items-center rounded-md border border-zinc-200 bg-card dark:border-zinc-700 dark:bg-zinc-900",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-full flex-1 rounded-r-none text-foreground"
        onClick={handleDecrement}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="flex-1 text-center text-sm font-semibold tabular-nums text-foreground">
        {quantityInCart}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-full flex-1 rounded-l-none text-foreground disabled:opacity-20"
        onClick={handleAdd}
        disabled={isAtMax}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
