import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

interface CategoryShowcaseProps {
  categories: ALL_CATEGORIES_QUERYResult;
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            التصنيفات متاعنا
          </h2>
          <p className="mt-2 text-muted-foreground">
            لقا المكمّلات اللي تناسب أهدافك
          </p>
        </div>

        {/* Categories Grid - 5 cols desktop, 2 cols mobile */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
          {categories.map((category) => {
            const slug = category.slug ?? "";
            const imageUrl = category.image?.asset?.url;
            const productCount = category.productCount ?? 0;

            return (
              <Link
                key={category._id}
                href={`/shop?category=${slug}`}
                className="group relative aspect-4/3 overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Image background or gradient placeholder */}
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={category.title ?? "Catégorie"}
                    fill
                    className="object-cover transition-all duration-300 group-hover:brightness-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-linear-to-br from-dodo-yellow/20 to-dodo-yellow/5"
                    aria-hidden
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/70 group-hover:via-black/30" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="text-sm font-semibold text-white drop-shadow-sm sm:text-base">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/90">
                    {productCount} produit{productCount !== 1 ? "s" : ""}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                    <span>Explorer</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* See All link */}
        <div className="mt-8 text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-md bg-dodo-yellow px-6 py-2.5 text-sm font-semibold text-black hover:bg-dodo-yellow/90 transition-colors"
          >
            شوف الكل
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
