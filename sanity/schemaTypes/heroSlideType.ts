import { PlayIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const heroSlideType = defineType({
  name: "heroSlide",
  title: "Hero Slide",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "image",
      title: "Image de fond",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => [rule.required().error("L'image est requise")],
    }),
    defineField({
      name: "headline",
      title: "Titre Principal",
      type: "string",
      description: "Ex: علاش Dodo Nutrition ?",
      validation: (rule) => [rule.required().error("Le titre est requis")],
    }),
    defineField({
      name: "subtitle",
      type: "string",
      description: "Sous-titre optionnel",
    }),
    defineField({
      name: "ctaLabel",
      title: "Bouton Principal — Texte",
      type: "string",
      description: "Ex: أدخل شوف",
    }),
    defineField({
      name: "ctaLink",
      title: "Bouton Principal — Lien",
      type: "string",
      description: "Ex: /shop",
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Bouton Secondaire — Texte",
      type: "string",
      description: "Ex: شوف الباكات",
    }),
    defineField({
      name: "secondaryCtaLink",
      title: "Bouton Secondaire — Lien",
      type: "string",
    }),
    defineField({
      name: "isActive",
      title: "Actif",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "headline",
      media: "image",
      isActive: "isActive",
    },
    prepare({ title, media, isActive }) {
      return {
        title: title ?? "Hero Slide",
        subtitle: isActive ? "Actif" : "Inactif",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Ordre d'affichage",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
