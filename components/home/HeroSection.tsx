"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    id: 1,
    title: "Performance. Force. Résultats.",
    subtitle: "Suppléments premium pour athlètes exigeants",
    cta: { label: "اكتشف المتجر", href: "/shop" },
    image: "/hero-1.jpg", // Placeholder - will use gradient fallback
    gradient: "from-amber-500/20 via-transparent to-transparent",
  },
  {
    id: 2,
    title: "Nouvelles Arrivées",
    subtitle: "Les dernières innovations en nutrition sportive",
    cta: { label: "الجديد", href: "/shop?sort=newest" },
    image: "/hero-2.jpg",
    gradient: "from-red-500/20 via-transparent to-transparent",
  },
  {
    id: 3,
    title: "Offres Exclusives",
    subtitle: "Jusqu'à -30% sur une sélection de produits",
    cta: { label: "العروض", href: "/promotions" },
    image: "/hero-3.jpg",
    gradient: "from-green-500/20 via-transparent to-transparent",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-background">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-radial ${slide.gradient} blur-3xl opacity-20`} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full flex-col items-center justify-center text-center">
          {/* Animated Container - Re-renders on slide change */}
          <div key={currentSlide} className="flex flex-col items-center">
            {/* Badge */}
            <span className="mb-6 inline-block rounded-full bg-dodo-yellow/10 px-4 py-1.5 text-sm font-medium text-dodo-yellow animate-fade-in-down">
              Dodo Nutrition
            </span>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-7xl lg:text-8xl animate-fade-in-up">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              {slide.subtitle}
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Button
                asChild
                size="lg"
                className="bg-dodo-yellow text-black font-bold text-lg h-14 px-8 hover:bg-dodo-yellow-hover hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(254,226,87,0.3)] hover:shadow-[0_0_30px_rgba(254,226,87,0.5)]"
              >
                <Link href={slide.cta.href}>
                  {slide.cta.label}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-zinc-700 text-foreground h-14 px-8 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all duration-300"
              >
                <Link href="/categories">
                  تصفح التصنيفات
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/50 text-foreground backdrop-blur-sm transition-all hover:bg-card sm:left-8 sm:h-12 sm:w-12"
        aria-label="Slide précédente"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/50 text-foreground backdrop-blur-sm transition-all hover:bg-card sm:right-8 sm:h-12 sm:w-12"
        aria-label="Slide suivante"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-dodo-yellow"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Aller à la slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
