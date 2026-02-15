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
    <section className="relative w-full bg-background">
      {/* Full-bleed banner — edge-to-edge, no padding */}
      <div className="relative group w-full">
        {currentBanner.link ? (
          <Link href={currentBanner.link} className="block w-full">
            <div className="relative aspect-[2/1] md:aspect-[2.5/1] w-full overflow-hidden">
              <Image
                src={imageUrl}
                alt={currentBanner.alt ?? "Banner promotionnel"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="100vw"
                priority
              />
            </div>
          </Link>
        ) : (
          <div className="relative aspect-[2/1] md:aspect-[2.5/1] w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={currentBanner.alt ?? "Banner promotionnel"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="100vw"
              priority
            />
          </div>
        )}

        {/* Nav arrows — overlaid on banner */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60"
              aria-label="Banner précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60"
              aria-label="Banner suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots — overlaid at bottom */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-dodo-yellow"
                    : "w-2 bg-white/50 hover:bg-white/80"
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
