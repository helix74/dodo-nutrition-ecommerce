import { defineQuery } from "next-sanity";

export const ALL_INVOICES_QUERY = defineQuery(`*[
  _type == "invoice"
] | order(date desc) {
  _id,
  invoiceNumber,
  "supplierName": supplier->name,
  date,
  totalAmount,
  status,
  notes,
  "itemCount": count(items)
}`);

export const INVOICE_BY_ID_QUERY = defineQuery(`*[
  _type == "invoice"
  && _id == $id
][0] {
  _id,
  invoiceNumber,
  supplier->{
    _id,
    name
  },
  date,
  totalAmount,
  status,
  notes,
  "items": items[]{
    _key,
    "product": product->{
      _id,
      name,
      "slug": slug.current
    },
    quantity,
    unitPrice
  }
}`);
