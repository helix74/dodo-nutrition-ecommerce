"use client";

import { useEffect, useState } from "react";
import { getLowStockCount } from "@/lib/actions/admin-data";

export function LowStockBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    getLowStockCount().then(setCount).catch(() => setCount(null));
  }, []);

  if (!count) return null;

  return (
    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/20 px-1.5 text-xs font-semibold text-amber-500">
      {count}
    </span>
  );
}
