import { DocumentIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const invoiceType = defineType({
  name: "invoice",
  title: "Facture",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "details", title: "Détails", default: true },
    { name: "items", title: "Articles" },
  ],
  fields: [
    defineField({
      name: "invoiceNumber",
      title: "Numéro de facture",
      type: "string",
      group: "details",
      validation: (rule) => [
        rule.required().error("Le numéro de facture est requis"),
      ],
    }),
    defineField({
      name: "supplier",
      title: "Fournisseur",
      type: "reference",
      to: [{ type: "supplier" }],
      group: "details",
      validation: (rule) => [
        rule.required().error("Le fournisseur est requis"),
      ],
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      group: "details",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => [
        rule.required().error("La date est requise"),
      ],
    }),
    defineField({
      name: "items",
      title: "Articles",
      type: "array",
      group: "items",
      of: [
        defineArrayMember({
          type: "object",
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
              validation: (rule) => [
                rule.required().error("La quantité est requise"),
                rule.min(1).error("Minimum 1"),
              ],
            }),
            defineField({
              name: "unitPrice",
              title: "Prix unitaire (TND)",
              type: "number",
              validation: (rule) => [
                rule.required().error("Le prix unitaire est requis"),
                rule.positive().error("Le prix doit être positif"),
              ],
            }),
          ],
          preview: {
            select: {
              title: "product.name",
              quantity: "quantity",
              unitPrice: "unitPrice",
              media: "product.images.0",
            },
            prepare({ title, quantity, unitPrice, media }) {
              return {
                title: title ?? "Produit",
                subtitle: `${quantity ?? 0} × ${unitPrice ?? 0} TND = ${((quantity ?? 0) * (unitPrice ?? 0)).toFixed(2)} TND`,
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalAmount",
      title: "Montant total (TND)",
      type: "number",
      group: "details",
      description: "Montant total de la facture",
      validation: (rule) => [
        rule.positive().error("Le montant doit être positif"),
      ],
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      group: "details",
      initialValue: "pending",
      options: {
        list: [
          { title: "En attente", value: "pending" },
          { title: "Payée", value: "paid" },
          { title: "En retard", value: "overdue" },
        ],
        layout: "radio",
      },
      validation: (rule) => [
        rule.required().error("Le statut est requis"),
      ],
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      group: "details",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      invoiceNumber: "invoiceNumber",
      supplierName: "supplier.name",
      date: "date",
      totalAmount: "totalAmount",
      status: "status",
    },
    prepare({ invoiceNumber, supplierName, date, totalAmount, status }) {
      const statusLabels: Record<string, string> = {
        pending: "En attente",
        paid: "Payée",
        overdue: "En retard",
      };
      return {
        title: `Facture ${invoiceNumber ?? "N/A"}`,
        subtitle: `${supplierName ?? "?"} • ${date ?? "?"} • ${totalAmount ?? 0} TND • ${statusLabels[status ?? ""] ?? status}`,
      };
    },
  },
  orderings: [
    {
      title: "Date récente",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Statut",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
});
