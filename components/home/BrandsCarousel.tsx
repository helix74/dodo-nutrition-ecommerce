"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { ALL_BRANDS_QUERYResult } from "@/sanity.types";

interface BrandsCarouselProps {
  brands: ALL_BRANDS_QUERYResult;
}

export function BrandsCarousel({ brands }: BrandsCarouselProps) {
  if (brands.length === 0) return null;

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Nos Marques
            </h2>
            <p className="mt-2 text-muted-foreground">
              Les meilleures marques de nutrition sportive
            </p>
          </div>
          <Link
            href="/brands"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-dodo-yellow hover:underline"
          >
            Voir toutes les marques
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Brands Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {brands.map((brand) => (
              <CarouselItem
                key={brand._id}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <Link
                  href={`/shop?brand=${brand.slug}`}
                  className="group flex h-24 items-center justify-center rounded-lg border border-border bg-background p-4 transition-all hover:border-dodo-yellow hover:shadow-lg hover:shadow-dodo-yellow/5"
                >
                  {brand.logo?.asset?.url ? (
                    <Image
                      src={brand.logo.asset.url}
                      alt={brand.name || "Brand"}
                      width={120}
                      height={60}
                      className="h-12 w-auto object-contain opacity-60 transition-opacity group-hover:opacity-100"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
                      {brand.name}
                    </span>
                  )}
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 border-border bg-card text-foreground hover:bg-secondary" />
          <CarouselNext className="hidden md:flex -right-4 border-border bg-card text-foreground hover:bg-secondary" />
        </Carousel>

        {/* Mobile link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-sm font-medium text-dodo-yellow"
          >
            Voir toutes les marques
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
