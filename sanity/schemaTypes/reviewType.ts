import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const reviewType = defineType({
  name: "review",
  title: "Avis",
  type: "document",
  icon: StarIcon,
  groups: [
    { name: "content", title: "Contenu", default: true },
    { name: "categorization", title: "Catégorisation" },
    { name: "moderation", title: "Modération" },
    { name: "metadata", title: "Métadonnées" },
  ],
  fields: [
    // ============================================
    // Content Group
    // ============================================
    defineField({
      name: "reviewType",
      title: "Type d'avis",
      type: "string",
      group: "content",
      initialValue: "general",
      options: {
        list: [
          { title: "🌐 Général (expérience globale)", value: "general" },
          { title: "📦 Catégorie (type de produit)", value: "category" },
        ],
        layout: "radio",
      },
      description: "Général = témoignage global, Catégorie = avis sur un type de produit",
    }),
    defineField({
      name: "authorName",
      title: "Nom de l'auteur",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().error("Le nom est requis"),
    }),
    defineField({
      name: "rating",
      title: "Note (1-5)",
      type: "number",
      group: "content",
      validation: (rule) => [
        rule.required().error("La note est requise"),
        rule.min(1).error("Minimum 1 étoile"),
        rule.max(5).error("Maximum 5 étoiles"),
      ],
    }),
    defineField({
      name: "title",
      title: "Titre de l'avis",
      type: "string",
      group: "content",
      description: "Court résumé de l'avis (optionnel)",
    }),
    defineField({
      name: "content",
      title: "Commentaire",
      type: "text",
      group: "content",
      rows: 4,
      description: "Texte complet de l'avis",
    }),

    // ============================================
    // Categorization Group
    // ============================================
    defineField({
      name: "category",
      title: "Catégorie",
      type: "reference",
      to: [{ type: "category" }],
      group: "categorization",
      description: "Si type = catégorie, l'avis s'affiche sur les produits de cette catégorie",
      hidden: ({ document }) => document?.reviewType !== "category",
    }),
    defineField({
      name: "product",
      title: "Produit (legacy)",
      type: "reference",
      to: [{ type: "product" }],
      group: "categorization",
      description: "Référence produit spécifique (optionnel, pour compatibilité)",
      hidden: true, // Hidden but kept for data migration
    }),

    // ============================================
    // Moderation Group
    // ============================================
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      group: "moderation",
      initialValue: "pending",
      options: {
        list: [
          { title: "⏳ En attente", value: "pending" },
          { title: "✅ Approuvé", value: "approved" },
          { title: "❌ Rejeté", value: "rejected" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "featured",
      title: "⭐ En vedette",
      type: "boolean",
      group: "moderation",
      initialValue: false,
      description: "Afficher sur la page d'accueil dans la section témoignages",
    }),
    defineField({
      name: "verifiedPurchase",
      title: "Achat vérifié",
      type: "boolean",
      group: "moderation",
      initialValue: false,
      description: "Ce client a-t-il acheté chez nous ?",
    }),

    // ============================================
    // Metadata Group
    // ============================================
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      group: "metadata",
      initialValue: "website",
      options: {
        list: [
          { title: "🌐 Site Web", value: "website" },
          { title: "📍 Google Maps", value: "google" },
        ],
      },
    }),
    defineField({
      name: "googleReviewId",
      title: "ID Google Review",
      type: "string",
      group: "metadata",
      hidden: ({ document }) => document?.source !== "google",
      description: "Identifiant unique de l'avis Google (pour éviter les doublons)",
    }),
    defineField({
      name: "clerkId",
      title: "Clerk User ID",
      type: "string",
      group: "metadata",
      description: "ID de l'utilisateur connecté (si applicable)",
    }),
    defineField({
      name: "order",
      title: "Commande liée",
      type: "reference",
      to: [{ type: "order" }],
      group: "metadata",
      description: "Commande associée pour vérification d'achat",
    }),
    defineField({
      name: "createdAt",
      title: "Date de création",
      type: "datetime",
      group: "metadata",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      authorName: "authorName",
      rating: "rating",
      reviewType: "reviewType",
      categoryTitle: "category.title",
      status: "status",
      source: "source",
      featured: "featured",
    },
    prepare({ authorName, rating, reviewType, categoryTitle, status, source, featured }) {
      const stars = "⭐".repeat(rating || 0);
      const statusEmoji = status === "approved" ? "✅" : status === "rejected" ? "❌" : "⏳";
      const sourceEmoji = source === "google" ? "📍" : "🌐";
      const featuredEmoji = featured ? "⭐ " : "";
      const typeLabel = reviewType === "category" ? categoryTitle || "Catégorie" : "Général";
      
      return {
        title: `${featuredEmoji}${authorName} - ${stars}`,
        subtitle: `${typeLabel} • ${sourceEmoji} ${source} • ${statusEmoji} ${status}`,
      };
    },
  },
  orderings: [
    {
      title: "Plus récents",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "En attente d'abord",
      name: "pendingFirst",
      by: [{ field: "status", direction: "asc" }],
    },
    {
      title: "En vedette",
      name: "featuredFirst",
      by: [{ field: "featured", direction: "desc" }],
    },
  ],
});
