import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries/categories";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catégories | Dodo Nutrition",
  description: "Explorez toutes nos catégories de suppléments et nutrition sportive : protéines, créatine, pre-workout, vitamines et plus.",
};

// Icons for each category
const categoryIcons: Record<string, string> = {
  proteines: "🥛",
  creatine: "💪",
  "pre-workout": "⚡",
  vitamines: "💊",
  mineraux: "🧬",
  "bruleurs-de-graisse": "🔥",
  "boosters-hormonaux": "🚀",
  supplements: "✨",
};

export default async function CategoriesPage() {
  const { data: categories } = await sanityFetch({
    query: ALL_CATEGORIES_QUERY,
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
            <span className="text-foreground">Catégories</span>
          </nav>

          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Toutes les Catégories
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Parcourez notre sélection complète de suppléments par catégorie
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const slug = category.slug ?? "";
            const icon = categoryIcons[slug] || "📦";

            return (
              <Link
                key={category._id}
                href={`/shop?category=${slug}`}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-dodo-yellow hover:shadow-xl hover:shadow-dodo-yellow/10"
              >
                {/* Icon */}
                <span className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
                  {icon}
                </span>

                {/* Title */}
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {category.title}
                </h2>

                {/* Description */}
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                {/* CTA */}
                <div className="mt-auto flex items-center gap-2 text-sm font-medium text-dodo-yellow opacity-0 transition-opacity group-hover:opacity-100">
                  <span>Explorer cette catégorie</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
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
