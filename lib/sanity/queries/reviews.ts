import { defineQuery } from "next-sanity";

// ============================================
// Reviews Queries - Dodo Nutrition
// ============================================

/**
 * Get featured reviews for homepage testimonials section
 * Only approved reviews marked as featured
 */
export const FEATURED_REVIEWS_QUERY = defineQuery(`*[
  _type == "review"
  && status == "approved"
  && featured == true
] | order(createdAt desc) [0...8] {
  _id,
  authorName,
  rating,
  title,
  content,
  reviewType,
  source,
  verifiedPurchase,
  createdAt,
  category->{
    _id,
    title,
    "slug": slug.current
  }
}`);

/**
 * Get reviews for a specific category
 * Shows on all products in that category
 */
export const CATEGORY_REVIEWS_QUERY = defineQuery(`*[
  _type == "review"
  && status == "approved"
  && reviewType == "category"
  && category._ref == $categoryId
] | order(createdAt desc) [0...6] {
  _id,
  authorName,
  rating,
  title,
  content,
  verifiedPurchase,
  createdAt
}`);

/**
 * Get rating stats for a category
 */
export const CATEGORY_RATING_QUERY = defineQuery(`{
  "average": math::avg(*[
    _type == "review"
    && status == "approved"
    && reviewType == "category"
    && category._ref == $categoryId
  ].rating),
  "count": count(*[
    _type == "review"
    && status == "approved"
    && reviewType == "category"
    && category._ref == $categoryId
  ])
}`);

/**
 * Get overall site review stats (for homepage)
 */
export const REVIEW_STATS_QUERY = defineQuery(`{
  "average": math::avg(*[
    _type == "review"
    && status == "approved"
  ].rating),
  "count": count(*[
    _type == "review"
    && status == "approved"
  ])
}`);

// ============================================
// Admin Queries
// ============================================

/**
 * Get all reviews for admin moderation
 * Includes all statuses
 */
export const ALL_REVIEWS_ADMIN_QUERY = defineQuery(`*[
  _type == "review"
] | order(createdAt desc) {
  _id,
  authorName,
  rating,
  title,
  content,
  reviewType,
  status,
  source,
  featured,
  verifiedPurchase,
  createdAt,
  category->{
    _id,
    title
  }
}`);

/**
 * Get pending reviews count for admin badge
 */
export const PENDING_REVIEWS_COUNT_QUERY = defineQuery(`
  count(*[_type == "review" && status == "pending"])
`);

/**
 * Get reviews by status for admin tabs
 */
export const REVIEWS_BY_STATUS_QUERY = defineQuery(`*[
  _type == "review"
  && status == $status
] | order(createdAt desc) {
  _id,
  authorName,
  rating,
  title,
  content,
  reviewType,
  status,
  source,
  featured,
  verifiedPurchase,
  createdAt,
  category->{
    _id,
    title
  }
}`);

/**
 * Get Google reviews for admin
 */
export const GOOGLE_REVIEWS_QUERY = defineQuery(`*[
  _type == "review"
  && source == "google"
] | order(createdAt desc) {
  _id,
  authorName,
  rating,
  title,
  content,
  status,
  googleReviewId,
  createdAt
}`);
