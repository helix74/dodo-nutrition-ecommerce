"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTotalPrice, useTotalItems } from "@/lib/store/cart-store-provider";

export function CartSummary() {
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();

  if (totalItems === 0) return null;

  return (
    <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex justify-between text-base font-medium text-zinc-900 dark:text-zinc-100">
        <span>Subtotal</span>
        <span>£{totalPrice.toFixed(2)}</span>
      </div>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Shipping calculated at checkout
      </p>
      <div className="mt-4">
        <Button asChild className="w-full">
          <Link href="/checkout">Checkout</Link>
        </Button>
      </div>
      <div className="mt-3 text-center">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
}

