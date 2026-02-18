import { defineQuery } from "next-sanity";

/**
 * Get brand by slug (full details for SEO landing page)
 */
export const BRAND_BY_SLUG_QUERY = defineQuery(`*[
  _type == "brand"
  && slug.current == $slug
][0] {
  _id,
  name,
  description,
  "slug": slug.current,
  logo{
    asset->{
      _id,
      url
    }
  },
  "productCount": count(*[_type == "product" && references(^._id)])
}`);
