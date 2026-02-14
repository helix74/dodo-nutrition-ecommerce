"use client";

import { useTransition } from "react";
import { Star } from "lucide-react";
import { updateProductField } from "@/lib/actions/admin-mutations";

interface FeaturedToggleProps {
  productId: string;
  initialFeatured: boolean;
}

export function FeaturedToggle({ productId, initialFeatured }: FeaturedToggleProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await updateProductField(productId, "featured", !initialFeatured);
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`transition-colors ${isPending ? "opacity-50" : ""}`}
      aria-label={initialFeatured ? "Remove from featured" : "Add to featured"}
    >
      <Star
        className={`h-5 w-5 ${
          initialFeatured
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground hover:text-amber-400"
        }`}
      />
    </button>
  );
}
