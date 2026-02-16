import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface RelatedProduct {
  _id: string;
  name: string | null;
  slug: string | null;
  priceRetail: number | null;
  priceSlashed: number | null;
  image: {
    asset: {
      _id: string;
      url: string | null;
    } | null;
  } | null;
  brand: {
    _id: string;
    name: string | null;
  } | null;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

function ProductCard({ product }: { product: RelatedProduct }) {
  const imageUrl = product.image?.asset?.url;
  const productName = product.name ?? "Product";
  const productSlug = product.slug ?? "";

  if (!productSlug) return null;

  return (

    <Link
      href={`/products/${productSlug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg hover:border-dodo-yellow/50"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Pas d&apos;image
          </div>
        )}
        {product.priceSlashed && product.priceSlashed > (product.priceRetail ?? 0) && (
          <div className="absolute right-2 top-2 rounded bg-dodo-red px-2 py-0.5 text-xs font-bold text-white">
            -{Math.round(((product.priceSlashed - (product.priceRetail ?? 0)) / product.priceSlashed) * 100)}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        {product.brand && (
          <span className="text-xs font-medium uppercase tracking-wider text-dodo-yellow">
            {product.brand.name}
          </span>
        )}
        <h3 className="mt-1 line-clamp-2 flex-1 text-sm font-medium text-foreground">
          {productName}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-bold text-foreground">
            {formatPrice(product.priceRetail)}
          </span>
          {product.priceSlashed && product.priceSlashed > (product.priceRetail ?? 0) && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.priceSlashed)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-bold text-foreground">
        Produits similaires
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
