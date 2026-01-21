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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { submitReview } from "@/lib/actions/reviews";

interface Review {
  _id: string;
  authorName: string | null;
  rating: number | null;
  title: string | null;
  content: string | null;
  verifiedPurchase: boolean | null;
  createdAt: string | null;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
  reviews: Review[];
  averageRating: number | null;
  reviewCount: number;
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
          className={star <= rating ? "text-yellow-400" : "text-zinc-300 dark:text-zinc-600"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="text-3xl transition-transform hover:scale-110"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
        >
          <span
            className={
              star <= (hover || value)
                ? "text-yellow-400"
                : "text-zinc-300 dark:text-zinc-600"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-TN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (

    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">
              {review.authorName ?? "Anonymous"}
            </span>
            {review.verifiedPurchase && (
              <Badge variant="secondary" className="text-xs">
                ✓ Achat vérifié
              </Badge>
            )}
          </div>
          <StarRating rating={review.rating ?? 0} size="sm" />
        </div>
        <span className="text-sm text-muted-foreground">
          {formatDate(review.createdAt)}
        </span>
      </div>
      {review.title && (
        <h4 className="mb-1 font-medium text-foreground">{review.title}</h4>
      )}
      {review.content && (
        <p className="text-sm text-muted-foreground">{review.content}</p>
      )}
    </div>
  );
}

export function ProductReviews({
  productId,
  productName,
  reviews,
  averageRating,
  reviewCount,
}: ProductReviewsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    authorName: "",
    title: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0 || !formData.authorName.trim()) return;

    setIsSubmitting(true);
    try {
      await submitReview({
        productId,
        authorName: formData.authorName,
        rating: formData.rating,
        title: formData.title || undefined,
        content: formData.content || undefined,
      });
      setSubmitted(true);
      setFormData({ rating: 0, authorName: "", title: "", content: "" });
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Avis Clients
          </h2>
          {reviewCount > 0 && averageRating !== null && (
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={Math.round(averageRating)} size="md" />
              <span className="text-lg font-semibold text-foreground">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({reviewCount} avis)
              </span>
            </div>
          )}
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-dodo-yellow text-black hover:bg-dodo-yellow-hover">
              Laisser un avis
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Votre avis sur {productName}</DialogTitle>
            </DialogHeader>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="mb-4 text-4xl">✅</div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Merci pour votre avis !</h3>
                <p className="text-sm text-muted-foreground">
                  Votre avis sera publié après modération.
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setIsOpen(false);
                  }}
                  className="mt-4 bg-dodo-yellow text-black hover:bg-dodo-yellow-hover"
                >
                  Fermer
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-foreground">Votre note *</Label>
                  <div className="mt-2">
                    <StarRatingInput
                      value={formData.rating}
                      onChange={(rating) => setFormData((d) => ({ ...d, rating }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="authorName" className="text-foreground">Votre nom *</Label>
                  <Input
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) =>
                      setFormData((d) => ({ ...d, authorName: e.target.value }))
                    }
                    placeholder="Ahmed"
                    required
                    className="bg-background border-input text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="title" className="text-foreground">Titre de l'avis</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((d) => ({ ...d, title: e.target.value }))}
                    placeholder="Excellent produit !"
                    className="bg-background border-input text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="content" className="text-foreground">Votre commentaire</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData((d) => ({ ...d, content: e.target.value }))}
                    placeholder="Partagez votre expérience avec ce produit..."
                    rows={4}
                    className="bg-background border-input text-foreground"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || formData.rating === 0 || !formData.authorName}
                  className="w-full bg-dodo-yellow text-black hover:bg-dodo-yellow-hover"
                >
                  {isSubmitting ? "Envoi..." : "Envoyer mon avis"}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-card/50 py-12 text-center">
          <p className="text-muted-foreground">
            Aucun avis pour le moment. Soyez le premier !
          </p>
        </div>
      )}
    </div>
  );
}
