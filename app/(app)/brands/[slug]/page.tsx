import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { BRAND_BY_SLUG_QUERY } from "@/lib/sanity/queries/brands";
import { PRODUCTS_BY_BRAND_SLUG_QUERY } from "@/lib/sanity/queries/products";
import { ProductGrid } from "@/components/app/ProductGrid";
import { ArrowRight } from "lucide-react";
import type { PROMOTIONS_QUERYResult } from "@/sanity.types";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dodonutrition.tn";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: brand } = await sanityFetch({
    query: BRAND_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!brand) {
    return { title: "Marque introuvable" };
  }

  const title = `${brand.name} — Nutrition Sportive`;
  const description =
    brand.description ??
    `Découvrez tous les produits ${brand.name} chez Dodo Nutrition. Livraison rapide en Tunisie.`;

  return {
    title,
    description,
    openGraph: {
      title: `${brand.name} | Dodo Nutrition`,
      description,
      type: "website",
      url: `${siteUrl}/brands/${brand.slug}`,
      ...(brand.logo?.asset?.url && {
        images: [
          { url: brand.logo.asset.url, alt: brand.name ?? "Dodo Nutrition" },
        ],
      }),
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;

  const [brandResult, productsResult] = await Promise.all([
    sanityFetch({ query: BRAND_BY_SLUG_QUERY, params: { slug } }),
    sanityFetch({ query: PRODUCTS_BY_BRAND_SLUG_QUERY, params: { slug } }),
  ]);

  const brand = brandResult.data;
  const products = (productsResult.data ?? []) as unknown as PROMOTIONS_QUERYResult;

  if (!brand) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-dodo-yellow">
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <Link href="/brands" className="hover:text-dodo-yellow">
              Marques
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{brand.name}</span>
          </nav>

          <div className="flex items-center gap-6">
            {brand.logo?.asset?.url && (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-border bg-white p-3">
                <Image
                  src={brand.logo.asset.url}
                  alt={brand.name ?? "Brand"}
                  width={80}
                  height={80}
                  className="h-auto max-h-14 w-auto max-w-full object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {brand.name}
              </h1>
              {brand.description && (
                <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                  {brand.description}
                </p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {brand.productCount ?? products.length}
                </span>{" "}
                produit
                {(brand.productCount ?? products.length) !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ProductGrid products={products} />

        <div className="mt-12 flex items-center justify-center gap-6">
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-dodo-yellow"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Toutes les marques
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-dodo-yellow"
          >
            Voir tous les produits
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
