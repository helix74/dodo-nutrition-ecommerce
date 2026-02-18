"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { updateProductField } from "@/lib/actions/admin-mutations";

interface PriceInputProps {
  productId: string;
  initialPrice: number;
}

export function PriceInput({ productId, initialPrice }: PriceInputProps) {
  const [price, setPrice] = useState(initialPrice);
  const [isPending, startTransition] = useTransition();
  const hasChanged = price !== initialPrice;

  function handleSave() {
    startTransition(async () => {
      await updateProductField(productId, "price", price);
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        value={price ?? ""}
        onChange={(e) => setPrice(Number(e.target.value))}
        min={0}
        step={0.01}
        className={`w-24 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-dodo-yellow focus:outline-none focus:ring-1 focus:ring-dodo-yellow ${isPending ? "opacity-50" : ""}`}
      />
      {hasChanged && (
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex h-7 items-center gap-1 rounded-md bg-dodo-yellow px-2 text-xs font-medium text-black transition-colors hover:bg-dodo-yellow/90 disabled:opacity-50"
          title="Sauvegarder"
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Check className="h-3 w-3" />
          )}
        </button>
      )}
    </div>
  );
}
