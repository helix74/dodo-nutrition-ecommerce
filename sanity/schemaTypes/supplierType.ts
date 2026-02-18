import { UsersIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const supplierType = defineType({
  name: "supplier",
  title: "Fournisseur",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (rule) => [
        rule.required().error("Le nom du fournisseur est requis"),
      ],
    }),
    defineField({
      name: "contactName",
      title: "Personne de contact",
      type: "string",
      description: "Nom du contact principal chez ce fournisseur",
    }),
    defineField({
      name: "phone",
      title: "Téléphone",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => [
        rule.email().error("Adresse email invalide"),
      ],
    }),
    defineField({
      name: "address",
      title: "Adresse",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 4,
      description: "Notes internes sur ce fournisseur",
    }),
    defineField({
      name: "products",
      title: "Produits fournis",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "product" }],
        }),
      ],
      description: "Produits fournis par ce fournisseur",
    }),
  ],
  preview: {
    select: {
      title: "name",
      contactName: "contactName",
      phone: "phone",
      products: "products",
    },
    prepare({ title, contactName, phone }) {
      const parts = [contactName, phone].filter(Boolean);
      return {
        title: title ?? "Fournisseur sans nom",
        subtitle: parts.join(" • ") || "Aucun contact",
      };
    },
  },
});
