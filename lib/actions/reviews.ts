"use server";

import { writeClient } from "@/sanity/lib/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

// ============================================
// Validation Schemas
// ============================================

const SubmitReviewInputSchema = z.object({
  authorName: z.string().min(2, "Nom requis (min 2 caractères)"),
  rating: z.number().int().min(1, "Note minimum 1").max(5, "Note maximum 5"),
  title: z.string().optional(),
  content: z.string().optional(),
  reviewType: z.enum(["general", "category"]),
  categoryId: z.string().optional(),
}).refine(
  (data) => !(data.reviewType === "category" && !data.categoryId),
  { message: "Catégorie requise pour ce type d'avis", path: ["categoryId"] }
);

type SubmitReviewData = z.infer<typeof SubmitReviewInputSchema>;

// ============================================
// Public Actions
// ============================================

/**
 * Submit a new review from the frontend
 * Reviews are created with pending status
 */
export async function submitReview(data: SubmitReviewData) {
  // Validate input with Zod
  const validationResult = SubmitReviewInputSchema.safeParse(data);
  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues.map((e) => e.message).join(". ");
    throw new Error(errorMessages);
  }

  const validated = validationResult.data;

  // Rate limiting: max 3 reviews per hour per IP/user
  const { userId } = await auth();
  const identifier = userId || "anonymous";
  const rateLimitResult = rateLimit(
    `review:${identifier}`,
    3,
    60 * 60 * 1000 // 1 hour
  );

  if (!rateLimitResult.allowed) {
    throw new Error("Trop d'avis envoyés. Veuillez réessayer plus tard.");
  }

  try {
    // TODO: Check if user has purchased from this category for verifiedPurchase
    // For now, just mark as verified if logged in
    const verifiedPurchase = !!userId;

    const review = await writeClient.create({
      _type: "review",
      reviewType: validated.reviewType,
      authorName: validated.authorName.trim(),
      rating: validated.rating,
      title: validated.title?.trim() || null,
      content: validated.content?.trim() || null,
      category: validated.categoryId
        ? { _type: "reference", _ref: validated.categoryId }
        : null,
      status: "pending",
      source: "website",
      featured: false,
      verifiedPurchase,
      clerkId: userId || null,
      createdAt: new Date().toISOString(),
    });

    revalidatePath("/");
    revalidatePath("/admin/reviews");

    return { success: true, id: review._id };
  } catch (error) {
    console.error("Failed to create review:", error);
    throw new Error("Erreur lors de l'envoi de l'avis");
  }
}

// ============================================
// Admin Actions
// ============================================

/**
 * Approve a review
 */
export async function approveReview(reviewId: string) {
  try {
    await requireAdmin();
    await writeClient.patch(reviewId).set({ status: "approved" }).commit();

    revalidatePath("/");
    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    console.error("Failed to approve review:", error);
    throw new Error("Erreur lors de l'approbation");
  }
}

/**
 * Reject a review
 */
export async function rejectReview(reviewId: string) {
  try {
    await requireAdmin();
    await writeClient
      .patch(reviewId)
      .set({ status: "rejected", featured: false })
      .commit();

    revalidatePath("/");
    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    console.error("Failed to reject review:", error);
    throw new Error("Erreur lors du rejet");
  }
}

/**
 * Toggle featured status of a review
 */
export async function toggleFeatured(reviewId: string, featured: boolean) {
  try {
    await requireAdmin();
    await writeClient.patch(reviewId).set({ featured }).commit();

    revalidatePath("/");
    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    console.error("Failed to toggle featured:", error);
    throw new Error("Erreur lors de la modification");
  }
}

/**
 * Assign a category to a review
 */
export async function assignCategory(reviewId: string, categoryId: string) {
  try {
    await requireAdmin();
    await writeClient
      .patch(reviewId)
      .set({
        reviewType: "category",
        category: { _type: "reference", _ref: categoryId },
      })
      .commit();

    revalidatePath("/");
    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    console.error("Failed to assign category:", error);
    throw new Error("Erreur lors de l'assignation");
  }
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string) {
  try {
    await requireAdmin();
    await writeClient.delete(reviewId);

    revalidatePath("/");
    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete review:", error);
    throw new Error("Erreur lors de la suppression");
  }
}

/**
 * Bulk approve reviews
 */
export async function bulkApproveReviews(reviewIds: string[]) {
  try {
    await requireAdmin();
    const transaction = writeClient.transaction();

    for (const id of reviewIds) {
      transaction.patch(id, { set: { status: "approved" } });
    }

    await transaction.commit();

    revalidatePath("/");
    revalidatePath("/admin/reviews");

    return { success: true, count: reviewIds.length };
  } catch (error) {
    console.error("Failed to bulk approve:", error);
    throw new Error("Erreur lors de l'approbation en masse");
  }
}
