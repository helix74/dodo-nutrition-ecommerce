"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, Banknote, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";

interface HeroSlide {
  _id: string;
  image?: {
    asset?: {
      _id: string;
      url: string | null;
    } | null;
  } | null;
  headline: string | null;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaLink?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaLink?: string | null;
}

interface HeroSectionProps {
  slides: HeroSlide[];
}

const AUTO_SLIDE_DELAY = 6000; // 6 seconds

const trustBadges = [
  { icon: Truck, text: "Livraison 24-48h" },
  { icon: ShieldCheck, text: "100% Authentique" },
  { icon: Banknote, text: "Paiement à la livraison" },
  { icon: RefreshCw, text: "Retour 14j" },
];

export function HeroSection({ slides }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset and start the auto-slide timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (slides.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, AUTO_SLIDE_DELAY);
    }
  }, [slides.length]);

  // Manual navigation - resets timer
  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      resetTimer();
    },
    [resetTimer]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % slides.length);
  }, [currentIndex, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  }, [currentIndex, slides.length, goToSlide]);

  // Start timer on mount
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetTimer]);

  // Fallback if no slides
  if (!slides || slides.length === 0) {
    return (
      <section className="relative min-h-[500px] md:min-h-[600px] overflow-hidden bg-linear-to-br from-dodo-yellow/10 via-background to-background">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Dodo Nutrition
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Suppléments premium pour athlètes exigeants
            </p>
            <Button asChild size="lg" className="bg-dodo-yellow text-black hover:bg-dodo-yellow-hover">
              <Link href="/shop">Découvrir le shop</Link>
            </Button>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4">
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 md:grid-cols-4 md:gap-4">
              {trustBadges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div key={index} className="flex items-center gap-2 md:justify-center">
                    <Icon className="h-5 w-5 text-dodo-yellow shrink-0" />
                    <span className="text-xs sm:text-sm text-foreground whitespace-nowrap">{badge.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentSlide = slides[currentIndex];
  const imageUrl = currentSlide.image?.asset?.url
    ? urlFor(currentSlide.image).width(1920).height(1080).url()
    : null;

  return (
    <section className="relative min-h-[380px] sm:min-h-[450px] md:min-h-[600px] overflow-hidden">
      {/* Background Image */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={currentSlide.headline ?? "Hero"}
          fill
          priority={currentIndex === 0}
          className="object-cover object-center"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-dodo-yellow/10 via-background to-background" />
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/30" />

      {/* Content */}
      <div className="relative h-full min-h-[380px] sm:min-h-[450px] md:min-h-[600px] flex items-end pb-24 sm:pb-28 md:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Headline */}
            {currentSlide.headline && (
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {currentSlide.headline}
              </h1>
            )}

            {/* Subtitle */}
            {currentSlide.subtitle && (
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 drop-shadow-md">
                {currentSlide.subtitle}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {currentSlide.ctaLabel && currentSlide.ctaLink && (
                <Button asChild className="h-12 px-8 text-base font-semibold bg-dodo-yellow text-black hover:bg-dodo-yellow-hover sm:h-14 sm:px-10 sm:text-lg">
                  <Link href={currentSlide.ctaLink}>{currentSlide.ctaLabel}</Link>
                </Button>
              )}
              {currentSlide.secondaryCtaLabel && currentSlide.secondaryCtaLink && (
                <Button asChild variant="outline" className="h-12 px-8 text-base font-semibold border-white text-white hover:bg-white/10 hover:text-white sm:h-14 sm:px-10 sm:text-lg">
                  <Link href={currentSlide.secondaryCtaLink}>{currentSlide.secondaryCtaLabel}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "w-8 bg-dodo-yellow" : "w-2 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Trust Strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4">
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 md:grid-cols-4 md:gap-4">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div key={index} className="flex items-center gap-2 md:justify-center">
                  <Icon className="h-5 w-5 text-dodo-yellow shrink-0" />
                  <span className="text-xs sm:text-sm text-foreground whitespace-nowrap">{badge.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
