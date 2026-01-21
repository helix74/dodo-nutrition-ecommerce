import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { PACK_BY_SLUG_QUERY } from "@/lib/sanity/queries/packs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingCart, ArrowLeft, CheckCircle } from "lucide-react";
import { AddPackToCart } from "@/components/app/AddPackToCart";

interface PackProduct {
  quantity: number | null;
  product: {
    _id: string;
    name: string | null;
    slug: { current: string } | null;
    priceRetail: number | null;
    stock: number | null;
    imageUrl: string | null;
    brand: string | null;
    category: string | null;
  } | null;
}

interface PackPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PackPage({ params }: PackPageProps) {
  const { slug } = await params;

  const { data: pack } = await sanityFetch({
    query: PACK_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!pack) {
    notFound();
  }

  const savings = pack.priceOriginal && pack.priceBundle
    ? Math.round(((pack.priceOriginal - pack.priceBundle) / pack.priceOriginal) * 100)
    : 0;

  const isOutOfStock = (pack.stock ?? 0) <= 0;
  const productCount = pack.products?.length ?? 0;

  const categoryLabels: Record<string, string> = {
    masse: "Prise de Masse",
    seche: "Sèche / Définition",
    performance: "Performance",
    debutant: "Débutant",
    force: "Force",
    endurance: "Endurance",
    sante: "Santé Générale",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la boutique
        </Link>

        {/* Hero Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Pack Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
            {pack.imageUrl ? (
              <Image
                src={pack.imageUrl}
                alt={pack.name ?? "Pack image"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Package className="h-24 w-24 opacity-30" />
              </div>
            )}
            
            {/* PACK badge */}
            <Badge className="absolute left-4 top-4 rounded-full bg-dodo-yellow px-4 py-2 text-sm font-bold text-black shadow-lg">
              <Package className="mr-2 h-4 w-4" />
              PACK
            </Badge>
            
            {/* Savings badge */}
            {savings > 0 && (
              <Badge className="absolute right-4 top-4 rounded-full bg-dodo-red px-3 py-2 text-sm font-bold text-white shadow-lg">
                -{savings}% d'économie
              </Badge>
            )}
          </div>

          {/* Pack Info */}
          <div className="flex flex-col">
            {/* Category */}
            {pack.packCategory && (
              <span className="text-sm font-medium uppercase tracking-wider text-dodo-yellow">
                {categoryLabels[pack.packCategory] ?? pack.packCategory}
              </span>
            )}

            {/* Name */}
            <h1 className="mt-2 text-3xl font-bold text-foreground lg:text-4xl">
              {pack.name}
            </h1>

            {/* Tagline */}
            {pack.tagline && (
              <p className="mt-2 text-lg text-muted-foreground">
                {pack.tagline}
              </p>
            )}

            {/* Pricing */}
            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-4xl font-bold text-foreground">
                {formatPrice(pack.priceBundle)}
              </span>
              {pack.priceOriginal && pack.priceOriginal > (pack.priceBundle ?? 0) && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(pack.priceOriginal)}
                </span>
              )}
            </div>

            {/* Savings message */}
            {savings > 0 && (
              <p className="mt-2 text-sm text-dodo-yellow">
                Économisez {formatPrice((pack.priceOriginal ?? 0) - (pack.priceBundle ?? 0))} en achetant ce pack !
              </p>
            )}

            {/* Stock */}
            <div className="mt-4">
              {isOutOfStock ? (
                <Badge variant="destructive">Rupture de Stock</Badge>
              ) : (pack.stock ?? 0) <= 5 ? (
                <Badge variant="secondary" className="text-dodo-yellow">
                  Plus que {pack.stock} en stock
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-green-900/30 text-green-400">
                  En Stock
                </Badge>
              )}
            </div>

            {/* Description */}
            {pack.description && (
              <p className="mt-6 text-muted-foreground">
                {pack.description}
              </p>
            )}

            {/* Add to Cart */}
            <div className="mt-8">
              <AddPackToCart pack={pack} />
            </div>
          </div>
        </div>

        {/* Products Included */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            {productCount} Produits Inclus
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(pack.products as PackProduct[] | null)?.map((item: PackProduct, index: number) => {
              const product = item.product;
              if (!product) return null;

              return (
                <Link
                  key={product._id ?? index}
                  href={`/products/${product.slug?.current}`}
                  className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-dodo-yellow/50 hover:shadow-lg"
                >
                  {/* Product Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name ?? "Product"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                        N/A
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="font-medium text-foreground group-hover:text-muted-foreground transition-colors">
                        {product.name}
                      </span>
                    </div>
                    {product.brand && (
                      <span className="text-xs text-dodo-yellow">{product.brand}</span>
                    )}
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        x{item.quantity}
                      </span>
                      <span className="text-foreground font-medium">
                        {formatPrice(product.priceRetail)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Back to Shop */}
        <div className="mt-12 text-center">
          <Link href="/shop">
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voir tous les produits
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
