"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { ReviewFormDialog } from "@/components/app/ReviewFormDialog";

interface Review {
  _id: string;
  authorName: string | null;
  rating: number | null;
  title: string | null;
  content: string | null;
  reviewType: string | null;
  source: string | null;
  verifiedPurchase: boolean | null;
  createdAt: string | null;
  category: {
    _id: string;
    title: string | null;
    slug: string | null;
  } | null;
}

interface TestimonialsSectionProps {
  reviews: Review[];
  stats: {
    average: number | null;
    count: number;
  };
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`flex gap-0.5 ${sizeClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "text-yellow-400" : "text-zinc-600"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ review }: { review: Review }) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-TN", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-dodo-yellow/30">
      {/* Rating */}
      <StarRating rating={review.rating || 5} size="md" />

      {/* Content */}
      <p className="mt-4 flex-1 text-sm text-muted-foreground line-clamp-4">
        &ldquo;{review.content || review.title || "Excellent service!"}&rdquo;
      </p>

      {/* Author */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="font-medium text-foreground">
            {review.authorName || "Client satisfait"}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(review.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {review.verifiedPurchase && (
            <Badge variant="secondary" className="text-xs">
              ✓ Vérifié
            </Badge>
          )}
          {review.source === "google" ? (
            <MapPin className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Globe className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection({ reviews, stats }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, reviews.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + itemsPerView);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-arabic text-3xl font-bold text-foreground md:text-4xl">
            شنوا قالوا عليّنا ⭐
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Ce que disent nos clients
          </p>

          {/* Stats */}
          {stats.average && stats.count > 0 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <StarRating rating={Math.round(stats.average)} size="lg" />
              <span className="text-2xl font-bold text-foreground">
                {stats.average.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({stats.count}+ avis)
              </span>
            </div>
          )}
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          {reviews.length > itemsPerView && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card shadow-lg hover:bg-card/80 disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card shadow-lg hover:bg-card/80 disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Desktop: Carousel with 3 cards */}
          <div className="hidden md:grid gap-6 md:grid-cols-3">
            {visibleReviews.map((review) => (
              <TestimonialCard key={review._id} review={review} />
            ))}
          </div>

          {/* Mobile: Show first 2 only */}
          <div className="grid gap-4 md:hidden">
            {reviews.slice(0, 2).map((review) => (
              <TestimonialCard key={review._id} review={review} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <ReviewFormDialog
            trigger={
              <Button
                size="lg"
                className="bg-dodo-yellow text-black hover:bg-dodo-yellow-hover"
              >
                Laisser un avis
              </Button>
            }
          />
        </div>
      </div>
    </section>
  );
}
