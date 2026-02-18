import { defineQuery } from "next-sanity";

export const ALL_SUPPLIERS_QUERY = defineQuery(`*[
  _type == "supplier"
] | order(name asc) {
  _id,
  name,
  contactName,
  phone,
  email,
  address,
  notes,
  "productCount": count(products)
}`);

export const SUPPLIER_BY_ID_QUERY = defineQuery(`*[
  _type == "supplier"
  && _id == $id
][0] {
  _id,
  name,
  contactName,
  phone,
  email,
  address,
  notes,
  "products": products[]->{
    _id,
    name,
    "slug": slug.current,
    priceRetail,
    stock
  }
}`);

export const SUPPLIER_NAMES_QUERY = defineQuery(`*[
  _type == "supplier"
] | order(name asc) {
  _id,
  name
}`);
