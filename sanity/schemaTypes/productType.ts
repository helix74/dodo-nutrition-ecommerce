import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  groups: [
    { name: "basic", title: "Basic Info", default: true },
    { name: "specifications", title: "Specifications" },
    { name: "storytelling", title: "Storytelling" },
    { name: "media", title: "Media" },
    { name: "pricing", title: "Pricing" },
    { name: "inventory", title: "Inventory" },
    { name: "seo", title: "SEO (Optional)" },
  ],
  fields: [
    // BASIC INFO
    defineField({
      name: "name",
      type: "string",
      group: "basic",
      validation: (rule) => [rule.required().error("Product name is required")],
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "basic",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => [
        rule.required().error("Slug is required for URL generation"),
      ],
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      group: "basic",
      validation: (rule) => [rule.required().error("Brand is required")],
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      group: "basic",
      validation: (rule) => [rule.required().error("Category is required")],
    }),
    defineField({
      name: "description",
      type: "text",
      group: "basic",
      rows: 3,
      description: "Short product description",
    }),
    defineField({
      name: "content",
      title: "Product Content (Rich Text)",
      type: "array",
      group: "storytelling",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", title: "URL" }],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      description:
        "Rich content for product page storytelling (headings, lists, images)",
    }),

    // NUTRITION-SPECIFIC FIELDS
    defineField({
      name: "unit",
      title: "Unit Type",
      type: "string",
      group: "specifications",
      options: {
        list: [
          { title: "Gramme (g)", value: "gramme" },
          { title: "Kilogramme (kg)", value: "kilogramme" },
          { title: "Millilitre (ml)", value: "millilitre" },
          { title: "Gélule", value: "gélule" },
          { title: "Capsule", value: "capsule" },
          { title: "Comprimé", value: "comprimé" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => [rule.required().error("Unit type is required")],
    }),
    defineField({
      name: "quantity",
      title: "Quantity Value",
      type: "number",
      group: "specifications",
      description: "e.g., 500 (for 500g), 2 (for 2kg)",
      validation: (rule) => [
        rule.required().error("Quantity is required"),
        rule.positive().error("Quantity must be positive"),
      ],
    }),
    defineField({
      name: "servings",
      title: "Number of Servings",
      type: "number",
      group: "specifications",
      description: "Total servings per container",
    }),
    defineField({
      name: "flavors",
      title: "Available Flavors",
      type: "array",
      of: [{ type: "string" }],
      group: "specifications",
      options: { layout: "tags" },
      description: "e.g., Vanille, Chocolat, Fraise",
    }),
    defineField({
      name: "benefits",
      title: "Key Benefits",
      type: "array",
      of: [{ type: "text", rows: 2 }],
      group: "storytelling",
      description: "Main product benefits (bullet points)",
    }),
    defineField({
      name: "allergens",
      title: "Allergens",
      type: "text",
      group: "storytelling",
      rows: 2,
      description: "Allergen information and warnings",
    }),
    defineField({
      name: "certifications",
      title: "Certifications",
      type: "array",
      of: [{ type: "string" }],
      group: "storytelling",
      options: { layout: "tags" },
      description: "e.g., GMP Certified, ISO 9001, Halal",
    }),
    defineField({
      name: "dosage",
      title: "Recommended Dosage",
      type: "text",
      group: "storytelling",
      rows: 3,
      description: "How to use this product",
    }),

    // PRICING
    defineField({
      name: "priceRetail",
      title: "Retail Price (TND)",
      type: "number",
      group: "pricing",
      description: "Price for regular customers",
      validation: (rule) => [
        rule.required().error("Retail price is required"),
        rule.positive().error("Price must be positive"),
      ],
    }),
    defineField({
      name: "pricePurchase",
      title: "Purchase Price (TND)",
      type: "number",
      group: "pricing",
      description: "Your purchase/cost price",
    }),
    defineField({
      name: "priceWholesale",
      title: "Wholesale Price (TND)",
      type: "number",
      group: "pricing",
      description: "Price for wholesale customers",
    }),
    defineField({
      name: "priceSlashed",
      title: "Slashed Price (TND)",
      type: "number",
      group: "pricing",
      description: "Original price if on sale (shows as crossed out)",
    }),

    // MEDIA
    defineField({
      name: "images",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (rule) => [
        rule.min(1).error("At least one image is required"),
      ],
    }),

    // INVENTORY
    defineField({
      name: "stock",
      type: "number",
      group: "inventory",
      initialValue: 0,
      description: "Number of items in stock",
      validation: (rule) => [
        rule.min(0).error("Stock cannot be negative"),
        rule.integer().error("Stock must be a whole number"),
      ],
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "inventory",
      initialValue: false,
      description: "Show on homepage and promotions",
    }),

    // SEO
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      group: "seo",
      description: "SEO title (max 60 chars recommended)",
      validation: (rule) => [
        rule.max(60).warning("Meta title should be under 60 characters"),
      ],
    }),

    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      group: "seo",
      rows: 2,
      description: "SEO description (max 160 chars recommended)",
      validation: (rule) => [
        rule
          .max(160)
          .warning("Meta description should be under 160 characters"),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      brand: "brand.name",
      unit: "unit",
      quantity: "quantity",
      media: "images.0",
      price: "priceRetail",
    },
    prepare({ title, brand, unit, quantity, media, price }) {
      const quantityUnit =
        quantity && unit
          ? `${quantity}${
              unit === "gramme"
                ? "g"
                : unit === "kilogramme"
                ? "kg"
                : unit === "millilitre"
                ? "ml"
                : " " + unit
            }`
          : "";
      return {
        title,
        subtitle: `${brand ?? "No brand"} • ${quantityUnit} • ${
          price ?? 0
        } TND`,
        media,
      };
    },
  },
});
