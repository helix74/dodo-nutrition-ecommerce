import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_BRANDS_QUERY } from "@/lib/sanity/queries/products";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marques | Dodo Nutrition",
  description: "Découvrez toutes les grandes marques de nutrition sportive disponibles chez Dodo Nutrition. Real Pharm, BioTech USA, Muscletech et plus.",
};

export default async function BrandsPage() {
  const { data: brands } = await sanityFetch({
    query: ALL_BRANDS_QUERY,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm text-muted-foreground">
            <a href="/" className="hover:text-dodo-yellow">Accueil</a>
            <span className="mx-2">/</span>
            <span className="text-foreground">Marques</span>
          </nav>

          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Toutes les Marques
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Les meilleures marques internationales de nutrition sportive
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/shop?brand=${brand.slug}`}
              className="group relative flex flex-col items-center rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-dodo-yellow hover:shadow-xl hover:shadow-dodo-yellow/10"
            >
              {/* Logo */}
              {brand.logo?.asset?.url ? (
                <div className="mb-4 flex h-24 w-full items-center justify-center">
                  <Image
                    src={brand.logo.asset.url}
                    alt={brand.name || "Brand"}
                    width={160}
                    height={96}
                    className="h-auto max-h-24 w-auto max-w-full object-contain opacity-70 transition-opacity group-hover:opacity-100"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-24 w-full items-center justify-center rounded-lg bg-secondary">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {brand.name?.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Brand Name */}
              <h2 className="text-center text-lg font-semibold text-foreground mb-2">
                {brand.name}
              </h2>

              {/* Description */}
              {brand.description && (
                <p className="text-xs text-muted-foreground text-center mb-3 line-clamp-2">
                  {brand.description}
                </p>
              )}

              {/* CTA */}
              <div className="mt-auto flex items-center gap-1 text-xs font-medium text-dodo-yellow opacity-0 transition-opacity group-hover:opacity-100">
                <span>Voir les produits</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Back to Shop */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-dodo-yellow"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Retour au Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
