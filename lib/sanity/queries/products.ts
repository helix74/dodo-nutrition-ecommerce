import { defineQuery } from "next-sanity";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants/stock";

// ============================================
// Shared Query Fragments (DRY) - Dodo Nutrition
// ============================================

/** Common filter conditions for product filtering - NUTRITION */
const PRODUCT_FILTER_CONDITIONS = `
  _type == "product"
  && ($categorySlug == "" || category->slug.current == $categorySlug)
  && ($brandSlug == "" || brand->slug.current == $brandSlug)
  && ($minPrice == 0 || priceRetail >= $minPrice)
  && ($maxPrice == 0 || priceRetail <= $maxPrice)
  && ($searchQuery == "" || name match $searchQuery + "*" || description match $searchQuery + "*")
  && ($inStock == false || stock > 0)
`;

/** Projection for filtered product lists - NUTRITION */
const FILTERED_PRODUCT_PROJECTION = `{
  _id,
  name,
  "slug": slug.current,
  priceRetail,
  priceSlashed,
  unit,
  quantity,
  "images": images[0...4]{
    _key,
    asset->{
      _id,
      url
    }
  },
  category->{
    _id,
    title,
    "slug": slug.current
  },
  brand->{
    _id,
    name,
    "slug": slug.current
  },
  flavors,
  certifications,
  stock
}`;

/** Scoring for relevance-based search */
const RELEVANCE_SCORE = `score(
  boost(name match $searchQuery + "*", 3),
  boost(description match $searchQuery + "*", 1),
  boost(brand->name match $searchQuery + "*", 2)
)`;

// ============================================
// All Products Query - NUTRITION
// ============================================

/**
 * Get all products with category and brand expanded
 * Used on landing page
 */
export const ALL_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  priceRetail,
  pricePurchase,
  priceWholesale,
  priceSlashed,
  unit,
  quantity,
  servings,
  "images": images[]{
    _key,
    asset->{
      _id,
      url
    },
    hotspot
  },
  category->{
    _id,
    title,
    "slug": slug.current
  },
  brand->{
    _id,
    name,
    "slug": slug.current
  },
  flavors,
  benefits,
  allergens,
  certifications,
  dosage,
  stock,
  featured
}`);

/**
 * Get featured products for homepage carousel
 */
export const FEATURED_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && featured == true
  && stock > 0
] | order(name asc) [0...6] {
  _id,
  name,
  "slug": slug.current,
  description,
  priceRetail,
  priceSlashed,
  unit,
  quantity,
  "images": images[]{
    _key,
    asset->{
      _id,
      url
    },
    hotspot
  },
  category->{
    _id,
    title,
    "slug": slug.current
  },
  brand->{
    _id,
    name,
    "slug": slug.current
  },
  stock
}`);

/**
 * Get products by category slug
 */
export const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`*[
  _type == "product"
  && category->slug.current == $categorySlug
] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  priceRetail,
  priceSlashed,
  unit,
  quantity,
  "image": images[0]{
    asset->{
      _id,
      url
    },
    hotspot
  },
  category->{
    _id,
    title,
    "slug": slug.current
  },
  brand->{
    _id,
    name,
    "slug": slug.current
  },
  stock
}`);

/**
 * Get single product by slug - FULL DETAILS for product page
 */
export const PRODUCT_BY_SLUG_QUERY = defineQuery(`*[
  _type == "product"
  && slug.current == $slug
][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  content,
  priceRetail,
  pricePurchase,
  priceWholesale,
  priceSlashed,
  unit,
  quantity,
  servings,
  "images": images[]{
    _key,
    asset->{
      _id,
      url
    },
    hotspot
  },
  category->{
    _id,
    title,
    "slug": slug.current
  },
  brand->{
    _id,
    name,
    "slug": slug.current,
    logo{
      asset->{
        _id,
        url
      }
    }
  },
  flavors,
  benefits,
  allergens,
  certifications,
  dosage,
  metaTitle,
  metaDescription,
  stock,
  featured
}`);

// ============================================
// Search & Filter Queries (Server-Side)
// Uses GROQ score() for relevance ranking
// ============================================

/**
 * Search products with relevance scoring
 * Uses score() + boost() for better ranking
 */
export const SEARCH_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && (
    name match $searchQuery + "*"
    || description match $searchQuery + "*"
    || brand->name match $searchQuery + "*"
  )
] | score(
  boost(name match $searchQuery + "*", 3),
  boost(description match $searchQuery + "*", 1),
  boost(brand->name match $searchQuery + "*", 2)
) | order(_score desc) {
  _id,
  _score,
  name,
  "slug": slug.current,
  priceRetail,
  priceSlashed,
  unit,
  quantity,
  "image": images[0]{
    asset->{
      _id,
      url
    },
    hotspot
  },
  category->{
    _id,
    title,
    "slug": slug.current
  },
  brand->{
    _id,
    name,
    "slug": slug.current
  },
  stock
}`);

/**
 * Filter products - ordered by name (A-Z)
 */
export const FILTER_PRODUCTS_BY_NAME_QUERY = defineQuery(
  `*[${PRODUCT_FILTER_CONDITIONS}] | order(name asc) ${FILTERED_PRODUCT_PROJECTION}`
);

/**
 * Filter products - ordered by price ascending
 */
export const FILTER_PRODUCTS_BY_PRICE_ASC_QUERY = defineQuery(
  `*[${PRODUCT_FILTER_CONDITIONS}] | order(priceRetail asc) ${FILTERED_PRODUCT_PROJECTION}`
);

/**
 * Filter products - ordered by price descending
 */
export const FILTER_PRODUCTS_BY_PRICE_DESC_QUERY = defineQuery(
  `*[${PRODUCT_FILTER_CONDITIONS}] | order(priceRetail desc) ${FILTERED_PRODUCT_PROJECTION}`
);

/**
 * Filter products - ordered by relevance (when searching)
 */
export const FILTER_PRODUCTS_BY_RELEVANCE_QUERY = defineQuery(
  `*[${PRODUCT_FILTER_CONDITIONS}] | ${RELEVANCE_SCORE} | order(_score desc, name asc) ${FILTERED_PRODUCT_PROJECTION}`
);

/**
 * Get products by IDs (for cart/checkout)
 */
export const PRODUCTS_BY_IDS_QUERY = defineQuery(`*[
  _type == "product"
  && _id in $ids
] {
  _id,
  name,
  "slug": slug.current,
  priceRetail,
  unit,
  quantity,
  "image": images[0]{
    asset->{
      _id,
      url
    },
    hotspot
  },
  stock
}`);

/**
 * Get low stock products (admin)
 */
export const LOW_STOCK_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && stock > 0
  && stock <= ${LOW_STOCK_THRESHOLD}
] | order(stock asc) {
  _id,
  name,
  "slug": slug.current,
  stock,
  priceRetail,
  brand->{name},
  "image": images[0]{
    asset->{
      _id,
      url
    }
  }
}`);

/**
 * Get out of stock products (admin)
 */
export const OUT_OF_STOCK_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && stock == 0
] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  brand->{name},
  "image": images[0]{
    asset->{
      _id,
      url
    }
  }
}`);

// ============================================
// AI Shopping Assistant Query
// ============================================

/**
 * Search products for AI shopping assistant
 * Full-featured search with all filters and product details
 */
export const AI_SEARCH_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && (
    $searchQuery == ""
    || name match $searchQuery + "*"
    || description match $searchQuery + "*"
    || category->title match $searchQuery + "*"
    || brand->name match $searchQuery + "*"
  )
  && ($categorySlug == "" || category->slug.current == $categorySlug)
  && ($brandSlug == "" || brand->slug.current == $brandSlug)
  && ($minPrice == 0 || priceRetail >= $minPrice)
  && ($maxPrice == 0 || priceRetail <= $maxPrice)
] | order(name asc) [0...20] {
  _id,
  name,
  "slug": slug.current,
  description,
  priceRetail,
  priceSlashed,
  unit,
  quantity,
  servings,
  "image": images[0]{
    asset->{
      _id,
      url
    }
  },
  category->{
    _id,
    title,
    "slug": slug.current
  },
  brand->{
    _id,
    name,
    "slug": slug.current
  },
  flavors,
  benefits,
  certifications,
  stock,
  featured
}`);

// ============================================
// Brand Queries
// ============================================

/**
 * Get all brands for filters
 */
export const ALL_BRANDS_QUERY = defineQuery(`*[
  _type == "brand"
] | order(name asc) {
  _id,
  name,
  description,
  "slug": slug.current,
  logo{
    asset->{
      _id,
  url
    }
  }
}`);

// ============================================
// Review Queries
// ============================================

/**
 * Get approved reviews for a product
 */
export const PRODUCT_REVIEWS_QUERY = defineQuery(`*[
  _type == "review"
  && product._ref == $productId
  && status == "approved"
] | order(createdAt desc) [0...10] {
  _id,
  authorName,
  rating,
  title,
  content,
  verifiedPurchase,
  createdAt
}`);

/**
 * Get average rating and count for a product
 */
export const PRODUCT_RATING_QUERY = defineQuery(`{
  "average": math::avg(*[
    _type == "review"
    && product._ref == $productId
    && status == "approved"
  ].rating),
  "count": count(*[
    _type == "review"
    && product._ref == $productId
    && status == "approved"
  ])
}`);

// ============================================
// Related Products Query
// ============================================

/**
 * Get related products (same category, exclude current)
 */
export const RELATED_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && category._ref == $categoryId
  && _id != $productId
  && stock > 0
] | order(featured desc, name asc) [0...4] {
  _id,
  name,
  "slug": slug.current,
  priceRetail,
  priceSlashed,
  "image": images[0]{
    asset->{
      _id,
      url
    }
  },
  brand->{
    _id,
    name
  }
}`);
