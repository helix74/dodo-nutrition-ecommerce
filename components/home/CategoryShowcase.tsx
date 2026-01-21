import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

// Icons for each category (matching nutrition categories)
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

interface CategoryShowcaseProps {
  categories: ALL_CATEGORIES_QUERYResult;
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Nos Catégories
            </h2>
            <p className="mt-2 text-muted-foreground">
              Trouvez les suppléments adaptés à vos objectifs
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-dodo-yellow hover:underline"
          >
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {categories.map((category) => {
            const slug = category.slug ?? "";
            const icon = categoryIcons[slug] || "📦";
            
            return (
              <Link
                key={category._id}
                href={`/shop?category=${slug}`}
                className="group relative flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-dodo-yellow hover:shadow-lg hover:shadow-dodo-yellow/10"
              >
                {/* Icon */}
                <span className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">
                  {icon}
                </span>

                {/* Title */}
                <h3 className="text-sm font-semibold text-foreground text-center">
                  {category.title}
                </h3>

                {/* Hover indicator */}
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  <span>Explorer</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile "See All" link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-medium text-dodo-yellow"
          >
            Voir toutes les catégories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
