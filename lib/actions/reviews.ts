"use server";

import { writeClient } from "@/sanity/lib/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ============================================
// Types
// ============================================

interface SubmitReviewData {
  authorName: string;
  rating: number;
  title?: string;
  content?: string;
  reviewType: "general" | "category";
  categoryId?: string;
}

// ============================================
// Public Actions
// ============================================

/**
 * Submit a new review from the frontend
 * Reviews are created with pending status
 */
export async function submitReview(data: SubmitReviewData) {
  // Validate input
  if (!data.authorName || !data.rating) {
    throw new Error("Nom et note sont requis");
  }

  if (data.rating < 1 || data.rating > 5) {
    throw new Error("La note doit être entre 1 et 5");
  }

  if (data.reviewType === "category" && !data.categoryId) {
    throw new Error("Catégorie requise pour ce type d'avis");
  }

  try {
    // Get current user if logged in
    const { userId } = await auth();

    // TODO: Check if user has purchased from this category for verifiedPurchase
    // For now, just mark as verified if logged in
    const verifiedPurchase = !!userId;

    const review = await writeClient.create({
      _type: "review",
      reviewType: data.reviewType,
      authorName: data.authorName.trim(),
      rating: data.rating,
      title: data.title?.trim() || null,
      content: data.content?.trim() || null,
      category: data.categoryId
        ? { _type: "reference", _ref: data.categoryId }
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
