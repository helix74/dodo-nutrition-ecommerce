"use client";

import { useState, useTransition } from "react";
import { Star, Check, Loader2 } from "lucide-react";
import { updateProductField } from "@/lib/actions/admin-mutations";

interface FeaturedToggleProps {
  productId: string;
  initialFeatured: boolean;
}

export function FeaturedToggle({ productId, initialFeatured }: FeaturedToggleProps) {
  const [featured, setFeatured] = useState(initialFeatured);
  const [isPending, startTransition] = useTransition();
  const hasChanged = featured !== initialFeatured;

  function handleToggle() {
    setFeatured(!featured);
  }

  function handleSave() {
    startTransition(async () => {
      await updateProductField(productId, "featured", featured);
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className={`transition-colors ${isPending ? "opacity-50" : ""}`}
        aria-label={featured ? "Retirer des vedettes" : "Ajouter aux vedettes"}
      >
        <Star
          className={`h-5 w-5 ${
            featured
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground hover:text-amber-400"
          }`}
        />
      </button>
      {hasChanged && (
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex h-6 items-center gap-1 rounded-md bg-dodo-yellow px-1.5 text-xs font-medium text-black transition-colors hover:bg-dodo-yellow/90 disabled:opacity-50"
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
