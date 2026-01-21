import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const reviewType = defineType({
  name: "review",
  title: "Review",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (rule) => rule.required().error("Product is required"),
    }),
    defineField({
      name: "authorName",
      title: "Author Name",
      type: "string",
      validation: (rule) => rule.required().error("Author name is required"),
    }),
    defineField({
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      validation: (rule) => [
        rule.required().error("Rating is required"),
        rule.min(1).error("Rating must be at least 1"),
        rule.max(5).error("Rating cannot exceed 5"),
      ],
    }),
    defineField({
      name: "title",
      title: "Review Title",
      type: "string",
      description: "Short summary of the review",
    }),
    defineField({
      name: "content",
      title: "Review Content",
      type: "text",
      rows: 4,
      description: "Full review text",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "pending",
      options: {
        list: [
          { title: "⏳ Pending", value: "pending" },
          { title: "✅ Approved", value: "approved" },
          { title: "❌ Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "verifiedPurchase",
      title: "Verified Purchase",
      type: "boolean",
      initialValue: false,
      description: "Did this customer actually purchase this product?",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      authorName: "authorName",
      rating: "rating",
      productName: "product.name",
      status: "status",
    },
    prepare({ authorName, rating, productName, status }) {
      const stars = "⭐".repeat(rating || 0);
      const statusEmoji = status === "approved" ? "✅" : status === "rejected" ? "❌" : "⏳";
      return {
        title: `${authorName} - ${stars}`,
        subtitle: `${productName || "Unknown Product"} • ${statusEmoji} ${status}`,
      };
    },
  },
  orderings: [
    {
      title: "Newest First",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Pending First",
      name: "pendingFirst",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
});
