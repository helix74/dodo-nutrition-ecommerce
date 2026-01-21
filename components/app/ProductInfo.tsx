import Link from "next/link";
import { AddToCartButton } from "@/components/app/AddToCartButton";
import { AskAISimilarButton } from "@/components/app/AskAISimilarButton";
import { StockBadge } from "@/components/app/StockBadge";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";

interface ProductInfoProps {
  product: NonNullable<PRODUCT_BY_SLUG_QUERYResult>;
  averageRating?: number | null;
  reviewCount?: number;
}

export function ProductInfo({ product, averageRating, reviewCount = 0 }: ProductInfoProps) {
  const imageUrl = product.images?.[0]?.asset?.url;

  // Format unit for display
  const formatUnit = (unit: string | null | undefined) => {
    const unitMap: Record<string, string> = {
      gramme: 'grammes',
      kilogramme: 'kg',
      millilitre: 'ml',
      gélule: 'gélules',
      capsule: 'capsules',
      comprimé: 'comprimés',
    };
    return unit ? unitMap[unit] || unit : '';
  };

  return (
    <div className="flex flex-col">
      {/* Category */}
      {product.category && (
        <Link
          href={`/?category=${product.category.slug}`}
          className="text-sm text-muted-foreground hover:text-dodo-yellow transition-colors"
        >
          {product.category.title}
        </Link>
      )}

      {/* Brand */}
      {product.brand && (
        <Link
          href={`/?brand=${product.brand.slug}`}
          className="mt-1 text-sm font-medium uppercase tracking-wider text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
        >
          {product.brand.name}
        </Link>
      )}

      {/* Title */}
      <h1 className="mt-2 text-3xl font-bold text-foreground">
        {product.name}
      </h1>

      {/* Rating */}
      {reviewCount > 0 && averageRating != null && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-lg ${star <= Math.round(averageRating) ? "text-dodo-yellow" : "text-muted-foreground"}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {averageRating.toFixed(1)} ({reviewCount} avis)
          </span>
        </div>
      )}

      {/* Quantity & Unit */}
      {product.quantity && product.unit && (
        <p className="mt-2 text-lg text-muted-foreground">
          {product.quantity} {formatUnit(product.unit)}
          {product.servings && ` • ${product.servings} portions`}
        </p>
      )}

      {/* Price Section */}
      <div className="mt-4 flex items-baseline gap-3">
        {product.priceSlashed && product.priceSlashed > (product.priceRetail ?? 0) && (
          <span className="text-xl text-muted-foreground line-through">
            {formatPrice(product.priceSlashed)}
          </span>
        )}
        <p className="text-3xl font-bold text-dodo-yellow">
          {formatPrice(product.priceRetail)}
        </p>
        {product.priceSlashed && product.priceSlashed > (product.priceRetail ?? 0) && (
          <Badge className="bg-dodo-red text-white">
            -{Math.round(((product.priceSlashed - (product.priceRetail ?? 0)) / product.priceSlashed) * 100)}%
          </Badge>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="mt-4 text-muted-foreground">
          {product.description}
        </p>
      )}

      {/* Flavors */}
      {product.flavors && product.flavors.length > 0 && (
        <div className="mt-4">
          <span className="text-sm font-medium text-foreground">
            Saveurs disponibles :
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.flavors.map((flavor, index) => (
              <Badge key={index} variant="secondary" className="bg-secondary text-secondary-foreground">
                {flavor}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Stock & Add to Cart */}
      <div className="mt-6 flex flex-col gap-3">
        <StockBadge productId={product._id} stock={product.stock ?? 0} />
        <AddToCartButton
          productId={product._id}
          name={product.name ?? "Unknown Product"}
          price={product.priceRetail ?? 0}
          image={imageUrl ?? undefined}
          stock={product.stock ?? 0}
        />
        <AskAISimilarButton productName={product.name ?? "this product"} />
      </div>
    </div>
  );
}


