import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const bannerType = defineType({
  name: "banner",
  title: "Banner",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "title",
      title: "Titre interne",
      type: "string",
      description: "Titre pour identifier le banner dans le studio (non affiché)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Texte alternatif",
      type: "string",
      description: "Recommandé pour l'accessibilité et SEO (mais optionnel)",
    }),
    defineField({
      name: "link",
      title: "Lien",
      type: "string",
      description: "URL de destination (ex: /shop, /promotions)",
    }),
    defineField({
      name: "isActive",
      title: "Actif",
      type: "boolean",
      initialValue: true,
      description: "Afficher ce banner sur le site",
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 0,
      description: "Les banners sont affichés du plus petit au plus grand",
    }),
    defineField({
      name: "startDate",
      title: "Date de début",
      type: "datetime",
      description: "Optionnel: date à partir de laquelle le banner est visible",
    }),
    defineField({
      name: "endDate",
      title: "Date de fin",
      type: "datetime",
      description: "Optionnel: date après laquelle le banner n'est plus visible",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      isActive: "isActive",
    },
    prepare({ title, media, isActive }) {
      return {
        title: title ?? "Banner",
        subtitle: isActive ? "✅ Actif" : "❌ Inactif",
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
