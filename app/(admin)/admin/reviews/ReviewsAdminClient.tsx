"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  X,
  Star,
  MoreVertical,
  Trash2,
  MapPin,
  Globe,
} from "lucide-react";
import {
  approveReview,
  rejectReview,
  toggleFeatured,
  deleteReview,
} from "@/lib/actions/reviews";
import { useRouter } from "next/navigation";

interface Review {
  _id: string;
  authorName: string | null;
  rating: number | null;
  title: string | null;
  content: string | null;
  reviewType: string | null;
  status: string | null;
  source: string | null;
  featured: boolean | null;
  verifiedPurchase: boolean | null;
  createdAt: string | null;
  category: {
    _id: string;
    title: string | null;
  } | null;
}

interface ReviewsAdminClientProps {
  initialReviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
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

function ReviewCard({
  review,
  onAction,
}: {
  review: Review;
  onAction: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await approveReview(review._id);
      onAction();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await rejectReview(review._id);
      onAction();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFeatured = async () => {
    setIsLoading(true);
    try {
      await toggleFeatured(review._id, !review.featured);
      onAction();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer cet avis définitivement ?")) return;
    setIsLoading(true);
    try {
      await deleteReview(review._id);
      onAction();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-TN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">
                {review.authorName || "Anonyme"}
              </span>
              {review.verifiedPurchase && (
                <Badge variant="secondary" className="text-xs">
                  ✓ Vérifié
                </Badge>
              )}
              {review.featured && (
                <Badge className="bg-dodo-yellow text-black text-xs">
                  ⭐ Vedette
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={review.rating || 0} />
              <span className="text-xs text-muted-foreground">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isLoading}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleToggleFeatured}>
              <Star className="mr-2 h-4 w-4" />
              {review.featured ? "Retirer vedette" : "Mettre en vedette"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Meta badges */}
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge variant="outline" className="text-xs">
          {review.source === "google" ? (
            <>
              <MapPin className="mr-1 h-3 w-3" /> Google
            </>
          ) : (
            <>
              <Globe className="mr-1 h-3 w-3" /> Site
            </>
          )}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {review.reviewType === "category"
            ? review.category?.title || "Catégorie"
            : "Général"}
        </Badge>
        <Badge
          variant={
            review.status === "approved"
              ? "default"
              : review.status === "rejected"
                ? "destructive"
                : "secondary"
          }
          className="text-xs"
        >
          {review.status === "approved"
            ? "✅ Approuvé"
            : review.status === "rejected"
              ? "❌ Rejeté"
              : "⏳ En attente"}
        </Badge>
      </div>

      {/* Content */}
      {review.title && (
        <h4 className="mb-1 font-medium text-foreground">{review.title}</h4>
      )}
      {review.content && (
        <p className="text-sm text-muted-foreground line-clamp-3">
          {review.content}
        </p>
      )}

      {/* Actions for pending */}
      {review.status === "pending" && (
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="mr-1 h-4 w-4" />
            Approuver
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
          >
            <X className="mr-1 h-4 w-4" />
            Rejeter
          </Button>
        </div>
      )}
    </div>
  );
}

export function ReviewsAdminClient({ initialReviews }: ReviewsAdminClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pending");

  const handleAction = () => {
    router.refresh();
  };

  const filterReviews = (status: string) => {
    if (status === "google") {
      return initialReviews.filter((r) => r.source === "google");
    }
    return initialReviews.filter((r) => r.status === status);
  };

  const pendingReviews = filterReviews("pending");
  const approvedReviews = filterReviews("approved");
  const rejectedReviews = filterReviews("rejected");
  const googleReviews = filterReviews("google");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="pending" className="relative">
          En attente
          {pendingReviews.length > 0 && (
            <span className="ml-2 rounded-full bg-dodo-yellow px-2 py-0.5 text-xs font-bold text-black">
              {pendingReviews.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="approved">
          Approuvés ({approvedReviews.length})
        </TabsTrigger>
        <TabsTrigger value="google">
          Google ({googleReviews.length})
        </TabsTrigger>
        <TabsTrigger value="rejected">
          Rejetés ({rejectedReviews.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="mt-6">
        {pendingReviews.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 py-12 text-center">
            <p className="text-muted-foreground">
              🎉 Aucun avis en attente de modération
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pendingReviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="approved" className="mt-6">
        {approvedReviews.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 py-12 text-center">
            <p className="text-muted-foreground">Aucun avis approuvé</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {approvedReviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="google" className="mt-6">
        {googleReviews.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 py-12 text-center">
            <p className="text-muted-foreground">
              Aucun avis Google importé
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              L&apos;import Google Maps sera disponible prochainement
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {googleReviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="rejected" className="mt-6">
        {rejectedReviews.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 py-12 text-center">
            <p className="text-muted-foreground">Aucun avis rejeté</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {rejectedReviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
