"use client";

import { Suspense } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockInputProps extends DocumentHandle {
  showButtons?: boolean;
}

function StockInputContent({ showButtons = true, ...handle }: StockInputProps) {
  const { data: stock } = useDocument({ ...handle, path: "stock" });
  const editStock = useEditDocument({ ...handle, path: "stock" });

  const stockValue = (stock as number) ?? 0;
  const isLowStock = stockValue > 0 && stockValue <= 10;
  const isOutOfStock = stockValue <= 0;

  const handleIncrement = () => {
    editStock(stockValue + 1);
  };

  const handleDecrement = () => {
    if (stockValue > 0) {
      editStock(stockValue - 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {showButtons && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={handleDecrement}
          disabled={stockValue <= 0}
        >
          <Minus className="h-3 w-3" />
        </Button>
      )}
      
      <Input
        type="number"
        min={0}
        value={stockValue}
        onChange={(e) => editStock(parseInt(e.target.value) || 0)}
        className={cn(
          "h-8 w-16 text-center",
          isOutOfStock &&
            "border-dodo-red/50 bg-dodo-red/10 text-dodo-red",
          isLowStock &&
            "border-amber-500/50 bg-amber-500/10 text-amber-400",
        )}
      />
      
      {showButtons && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={handleIncrement}
        >
          <Plus className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

function StockInputSkeleton({ showButtons = true }: { showButtons?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {showButtons && <Skeleton className="h-8 w-8" />}
      <Skeleton className="h-8 w-16" />
      {showButtons && <Skeleton className="h-8 w-8" />}
    </div>
  );
}

export function StockInput(props: StockInputProps) {
  return (
    <Suspense fallback={<StockInputSkeleton showButtons={props.showButtons} />}>
      <StockInputContent {...props} />
    </Suspense>
  );
}
