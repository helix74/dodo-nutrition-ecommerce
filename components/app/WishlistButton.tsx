"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWishlistActions, useWishlistStore } from "@/lib/store/wishlist-store-provider";
import { toast } from "sonner";

interface WishlistButtonProps {
  product: {
    _id: string;
    name: string;
    priceRetail?: number;
    image?: { asset?: { url?: string } };
    slug?: { current?: string };
  };
  variant?: "icon" | "full";
  className?: string;
}

export function WishlistButton({ product, variant = "icon", className }: WishlistButtonProps) {
  const { addItem, removeItem } = useWishlistActions();
  const isInWishlist = useWishlistStore((state) => 
    state.items.some((item) => item.productId === product._id)
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (isInWishlist) {
      removeItem(product._id);
      toast.success("Retiré de la wishlist", {
        description: product.name,
        duration: 2000,
      });
    } else {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.priceRetail ?? 0,
        image: product.image?.asset?.url,
        slug: product.slug?.current ?? "",
        addedAt: Date.now(),
      });
      toast.success("Ajouté à la wishlist", {
        description: product.name,
        duration: 2000,
        icon: "❤️",
      });
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("text-muted-foreground", className)}
        disabled
      >
        <Heart className="h-5 w-5" />
      </Button>
    );
  }

  if (variant === "full") {
    return (
      <Button
        variant="outline"
        onClick={handleToggle}
        className={cn(
          "gap-2 transition-all duration-300",
          isInWishlist 
            ? "border-dodo-red text-dodo-red hover:bg-dodo-red/10" 
            : "hover:border-dodo-red hover:text-dodo-red",
          className
        )}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-transform duration-300",
            isInWishlist ? "fill-current" : "",
            isAnimating ? "scale-125" : "scale-100"
          )}
        />
        {isInWishlist ? "Dans la wishlist" : "Ajouter à la wishlist"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "rounded-full transition-all duration-300 hover:bg-secondary",
        isInWishlist ? "text-dodo-red hover:text-dodo-red" : "text-muted-foreground hover:text-dodo-red",
        className
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-transform duration-300",
          isInWishlist ? "fill-current" : "",
          isAnimating ? "scale-125" : "scale-100"
        )}
      />
      <span className="sr-only">
        {isInWishlist ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
      </span>
    </Button>
  );
}
