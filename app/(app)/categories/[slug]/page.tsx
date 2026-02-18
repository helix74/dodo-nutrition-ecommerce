import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { CATEGORY_BY_SLUG_QUERY } from "@/lib/sanity/queries/categories";
import { PRODUCTS_BY_CATEGORY_SLUG_QUERY } from "@/lib/sanity/queries/products";
import { ProductGrid } from "@/components/app/ProductGrid";
import { ArrowRight } from "lucide-react";
import type { PROMOTIONS_QUERYResult } from "@/sanity.types";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dodonutrition.tn";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: category } = await sanityFetch({
    query: CATEGORY_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!category) {
    return { title: "Catégorie introuvable" };
  }

  const title = `${category.title} — Suppléments`;
  const description =
    category.description ??
    `Découvrez notre sélection de ${category.title} chez Dodo Nutrition. Livraison rapide en Tunisie.`;

  return {
    title,
    description,
    openGraph: {
      title: `${category.title} | Dodo Nutrition`,
      description,
      type: "website",
      url: `${siteUrl}/categories/${category.slug}`,
      ...(category.image?.asset?.url && {
        images: [
          {
            url: category.image.asset.url,
            alt: category.title ?? "Dodo Nutrition",
          },
        ],
      }),
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [categoryResult, productsResult] = await Promise.all([
    sanityFetch({ query: CATEGORY_BY_SLUG_QUERY, params: { slug } }),
    sanityFetch({ query: PRODUCTS_BY_CATEGORY_SLUG_QUERY, params: { slug } }),
  ]);

  const category = categoryResult.data;
  const products = (productsResult.data ?? []) as unknown as PROMOTIONS_QUERYResult;

  if (!category) {
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
            <Link href="/categories" className="hover:text-dodo-yellow">
              Catégories
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{category.title}</span>
          </nav>

          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {category.title}
          </h1>
          {category.description && (
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              {category.description}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {category.productCount ?? products.length}
            </span>{" "}
            produit{(category.productCount ?? products.length) !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ProductGrid products={products} />

        <div className="mt-12 flex items-center justify-center gap-6">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-dodo-yellow"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Toutes les catégories
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
