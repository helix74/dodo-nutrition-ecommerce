"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  _id: string;
  title: string | null;
  image: {
    asset: {
      _id: string;
      url: string | null;
    } | null;
  } | null;
  alt: string | null;
  link: string | null;
  order: number | null;
}

interface BannerSectionProps {
  banners: Banner[];
}

const AUTO_SLIDE_DELAY = 5000; // 5 seconds

export function BannerSection({ banners }: BannerSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset and start the auto-slide timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (banners.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, AUTO_SLIDE_DELAY);
    }
  }, [banners.length]);

  // Manual navigation - resets timer
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    resetTimer();
  }, [resetTimer]);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % banners.length);
  }, [currentIndex, banners.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + banners.length) % banners.length);
  }, [currentIndex, banners.length, goToSlide]);

  // Start timer on mount
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetTimer]);

  if (!banners || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];
  const imageUrl = currentBanner.image?.asset?.url;

  if (!imageUrl) {
    return null;
  }

  return (
    <section className="py-8 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            🔥 Offres Spéciales
          </h2>
          {banners.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-secondary hover:border-dodo-yellow"
                aria-label="Banner précédent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-muted-foreground tabular-nums">
                {currentIndex + 1} / {banners.length}
              </span>
              <button
                onClick={nextSlide}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-secondary hover:border-dodo-yellow"
                aria-label="Banner suivant"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Banner - TALLER aspect ratio to fit image */}
        <div className="relative group">
          {currentBanner.link ? (
            <Link href={currentBanner.link} className="block">
              <div className="relative aspect-[2/1] md:aspect-[2.5/1] w-full overflow-hidden rounded-xl">
                <Image
                  src={imageUrl}
                  alt={currentBanner.alt ?? "Banner promotionnel"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 1280px"
                  priority
                />
              </div>
            </Link>
          ) : (
            <div className="relative aspect-[2/1] md:aspect-[2.5/1] w-full overflow-hidden rounded-xl">
              <Image
                src={imageUrl}
                alt={currentBanner.alt ?? "Banner promotionnel"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 1280px"
                priority
              />
            </div>
          )}
        </div>

        {/* Dots */}
        {banners.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-dodo-yellow"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Aller au banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
