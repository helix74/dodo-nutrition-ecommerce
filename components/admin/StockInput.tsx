"use client";

import { useState, useTransition } from "react";
import { updateProductField } from "@/lib/actions/admin-mutations";

interface StockInputProps {
  productId: string;
  initialStock: number;
}

export function StockInput({ productId, initialStock }: StockInputProps) {
  const [stock, setStock] = useState(initialStock);
  const [isPending, startTransition] = useTransition();

  function handleBlur() {
    if (stock !== initialStock) {
      startTransition(async () => {
        await updateProductField(productId, "stock", stock);
      });
    }
  }

  return (
    <input
      type="number"
      value={stock ?? ""}
      onChange={(e) => setStock(Number(e.target.value))}
      onBlur={handleBlur}
      min={0}
      className={`w-20 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-dodo-yellow focus:outline-none focus:ring-1 focus:ring-dodo-yellow ${isPending ? "opacity-50" : ""}`}
    />
  );
}
