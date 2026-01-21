import { CubeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const packType = defineType({
  name: "pack",
  title: "Pack / Bundle",
  type: "document",
  icon: CubeIcon,
  groups: [
    { name: "basic", title: "Informations", default: true },
    { name: "content", title: "Contenu" },
    { name: "pricing", title: "Prix" },
    { name: "options", title: "Options" },
  ],
  fields: [
    // === BASIC INFO ===
    defineField({
      name: "name",
      title: "Nom du Pack",
      type: "string",
      group: "basic",
      validation: (rule) => rule.required().error("Le nom est requis"),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "basic",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required().error("Le slug est requis"),
    }),
    defineField({
      name: "tagline",
      title: "Slogan",
      type: "string",
      group: "basic",
      description: 'Ex: "Pack Prise de Masse Ultime"',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "basic",
      rows: 4,
    }),
    defineField({
      name: "image",
      title: "Image Principale",
      type: "image",
      group: "basic",
      options: { hotspot: true },
    }),

    // === CONTENT (Products) ===
    defineField({
      name: "products",
      title: "Produits Inclus",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          name: "packItem",
          title: "Produit du Pack",
          fields: [
            defineField({
              name: "product",
              title: "Produit",
              type: "reference",
              to: [{ type: "product" }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "quantity",
              title: "Quantité",
              type: "number",
              initialValue: 1,
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              title: "product.name",
              quantity: "quantity",
              media: "product.images.0.asset",
            },
            prepare({ title, quantity, media }) {
              return {
                title: title || "Produit",
                subtitle: `x${quantity || 1}`,
                media,
              };
            },
          },
        },
      ],
      validation: (rule) =>
        rule.required().min(2).error("Un pack doit contenir au moins 2 produits"),
    }),

    // === PRICING ===
    defineField({
      name: "priceOriginal",
      title: "Prix Total Séparé (TND)",
      type: "number",
      group: "pricing",
      description: "Somme des prix individuels des produits",
      readOnly: true,
    }),
    defineField({
      name: "priceBundle",
      title: "Prix Pack (TND)",
      type: "number",
      group: "pricing",
      description: "Prix réduit du bundle",
      validation: (rule) => rule.required().error("Le prix du pack est requis"),
    }),

    // === OPTIONS ===
    defineField({
      name: "packCategory",
      title: "Type de Pack",
      type: "string",
      group: "options",
      options: {
        list: [
          { title: "Prise de Masse", value: "masse" },
          { title: "Sèche / Définition", value: "seche" },
          { title: "Performance", value: "performance" },
          { title: "Débutant", value: "debutant" },
          { title: "Force", value: "force" },
          { title: "Endurance", value: "endurance" },
          { title: "Santé Générale", value: "sante" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "featured",
      title: "Pack Vedette",
      type: "boolean",
      group: "options",
      initialValue: false,
      description: "Afficher ce pack en évidence sur la page d'accueil",
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      group: "options",
      initialValue: 10,
      validation: (rule) => rule.min(0),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "tagline",
      media: "image",
      price: "priceBundle",
    },
    prepare({ title, subtitle, media, price }) {
      return {
        title: title || "Pack",
        subtitle: subtitle || (price ? `${price} TND` : ""),
        media,
      };
    },
  },
});
