import { sanityFetch } from "@/sanity/lib/live";
import {
  ALL_REVIEWS_ADMIN_QUERY,
  PENDING_REVIEWS_COUNT_QUERY,
} from "@/lib/sanity/queries/reviews";
import { ReviewsAdminClient } from "./ReviewsAdminClient";

export const metadata = {
  title: "Gestion des Avis | Admin",
};

export default async function AdminReviewsPage() {
  const [reviewsResult, pendingCountResult] = await Promise.all([
    sanityFetch({ query: ALL_REVIEWS_ADMIN_QUERY }),
    sanityFetch({ query: PENDING_REVIEWS_COUNT_QUERY }),
  ]);

  const reviews = reviewsResult.data || [];
  const pendingCount = pendingCountResult.data || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Gestion des Avis
          </h1>
          <p className="text-muted-foreground">
            Modérez et gérez les avis clients
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-dodo-yellow/10 px-4 py-2 text-dodo-yellow">
            <span className="text-2xl font-bold">{pendingCount}</span>
            <span className="text-sm">en attente</span>
          </div>
        )}
      </div>

      {/* Client Component for Interactive Features */}
      <ReviewsAdminClient initialReviews={reviews} />
    </div>
  );
}
