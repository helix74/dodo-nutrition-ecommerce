"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  useTotalPrice,
  useTotalItems,
  useCartActions,
} from "@/lib/store/cart-store-provider";

interface CartSummaryProps {
  hasStockIssues?: boolean;
}

export function CartSummary({ hasStockIssues = false }: CartSummaryProps) {
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const { closeCart } = useCartActions();

  if (totalItems === 0) return null;

  return (
    <div className="border-t border-border p-4">
      <div className="flex justify-between text-base font-medium text-foreground">
        <span>Sous-total</span>
        <span className="text-dodo-yellow">{formatPrice(totalPrice)}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Livraison calculée à la commande
      </p>
      <div className="mt-4">
        {hasStockIssues ? (
          <Button disabled className="w-full">
            Résoudre les problèmes de stock
          </Button>
        ) : (
          <Button asChild className="w-full bg-dodo-yellow hover:bg-dodo-yellow-hover text-black">
            <Link href="/checkout" onClick={() => closeCart()}>
              Commander
            </Link>
          </Button>
        )}
      </div>
      <div className="mt-3 text-center">
        <Link
          href="/shop"
          className="text-sm text-muted-foreground hover:text-dodo-yellow transition-colors"
        >
          Continuer vos achats →
        </Link>
      </div>
    </div>
  );
}
