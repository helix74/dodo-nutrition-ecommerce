"use client";

import { useState, useTransition } from "react";
import { updateProductField } from "@/lib/actions/admin-mutations";

interface PriceInputProps {
  productId: string;
  initialPrice: number;
}

export function PriceInput({ productId, initialPrice }: PriceInputProps) {
  const [price, setPrice] = useState(initialPrice);
  const [isPending, startTransition] = useTransition();

  function handleBlur() {
    if (price !== initialPrice) {
      startTransition(async () => {
        await updateProductField(productId, "price", price);
      });
    }
  }

  return (
    <input
      type="number"
      value={price ?? ""}
      onChange={(e) => setPrice(Number(e.target.value))}
      onBlur={handleBlur}
      min={0}
      step={0.01}
      className={`w-24 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-dodo-yellow focus:outline-none focus:ring-1 focus:ring-dodo-yellow ${isPending ? "opacity-50" : ""}`}
    />
  );
}
