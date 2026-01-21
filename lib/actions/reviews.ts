"use server";

import { writeClient } from "@/sanity/lib/client";

interface SubmitReviewData {
  productId: string;
  authorName: string;
  rating: number;
  title?: string;
  content?: string;
}

export async function submitReview(data: SubmitReviewData) {
  // Validate input
  if (!data.productId || !data.authorName || !data.rating) {
    throw new Error("Missing required fields");
  }

  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  try {
    const review = await writeClient.create({
      _type: "review",
      product: {
        _type: "reference",
        _ref: data.productId,
      },
      authorName: data.authorName.trim(),
      rating: data.rating,
      title: data.title?.trim() || null,
      content: data.content?.trim() || null,
      status: "pending",
      verifiedPurchase: false, // TODO: Check if user has purchased this product
      createdAt: new Date().toISOString(),
    });

    return { success: true, id: review._id };
  } catch (error) {
    console.error("Failed to create review:", error);
    throw new Error("Failed to submit review");
  }
}
