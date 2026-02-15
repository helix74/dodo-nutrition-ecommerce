import { defineQuery } from "next-sanity";

/**
 * Get all packs with product details
 */
export const ALL_PACKS_QUERY = defineQuery(`*[_type == "pack"] | order(featured desc, name asc) {
  _id,
  name,
  slug,
  tagline,
  description,
  "imageUrl": image.asset->url,
  priceOriginal,
  priceBundle,
  featured,
  packCategory,
  stock,
  products[] {
    quantity,
    "product": product-> {
      _id,
      name,
      slug,
      priceRetail,
      stock,
      "imageUrl": images[0].asset->url
    }
  }
}`);

/**
 * Get featured packs for homepage
 */
export const FEATURED_PACKS_QUERY = defineQuery(`*[_type == "pack" && featured == true] | order(name asc) [0...4] {
  _id,
  name,
  slug,
  tagline,
  "imageUrl": image.asset->url,
  priceOriginal,
  priceBundle,
  packCategory,
  stock,
  "productCount": count(products),
  products[] {
    quantity,
    "product": product-> {
      _id,
      name,
      slug,
      "imageUrl": images[0].asset->url
    }
  }
}`);

/**
 * Get single pack by slug with full product details
 */
export const PACK_BY_SLUG_QUERY = defineQuery(`*[_type == "pack" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  tagline,
  description,
  "imageUrl": image.asset->url,
  priceOriginal,
  priceBundle,
  featured,
  packCategory,
  stock,
  products[] {
    quantity,
    "product": product-> {
      _id,
      name,
      slug,
      priceRetail,
      stock,
      "imageUrl": images[0].asset->url,
      "brand": brand->name,
      "category": category->title
    }
  }
}`);

/**
 * Get packs by category
 */
export const PACKS_BY_CATEGORY_QUERY = defineQuery(`*[_type == "pack" && packCategory == $category] | order(featured desc, name asc) {
  _id,
  name,
  slug,
  tagline,
  "imageUrl": image.asset->url,
  priceOriginal,
  priceBundle,
  packCategory,
  stock,
  "productCount": count(products)
}`);
