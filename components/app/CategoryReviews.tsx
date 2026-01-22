"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReviewFormDialog } from "./ReviewFormDialog";

interface Review {
  _id: string;
  authorName: string | null;
  rating: number | null;
  title: string | null;
  content: string | null;
  verifiedPurchase: boolean | null;
  createdAt: string | null;
}

interface CategoryReviewsProps {
  categoryId: string;
  categoryName: string;
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
          className={star <= rating ? "text-yellow-400" : "text-zinc-600"}
        >
          ★
        </span>
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
              {review.authorName ?? "Anonyme"}
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

export function CategoryReviews({
  categoryId,
  categoryName,
  reviews,
  averageRating,
  reviewCount,
}: CategoryReviewsProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            💬 Avis sur {categoryName}
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

        <ReviewFormDialog
          trigger={
            <Button className="bg-dodo-yellow text-black hover:bg-dodo-yellow-hover">
              Laisser un avis
            </Button>
          }
          defaultCategoryId={categoryId}
          defaultCategoryName={categoryName}
        />
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
            Aucun avis pour cette catégorie. Soyez le premier !
          </p>
        </div>
      )}
    </div>
  );
}
