import { defineQuery } from "next-sanity";

// Get all active banners, sorted by order
export const ACTIVE_BANNERS_QUERY = defineQuery(`
  *[_type == "banner" && isActive == true && (
    !defined(startDate) || startDate <= now()
  ) && (
    !defined(endDate) || endDate > now()
  )] | order(order asc) {
    _id,
    title,
    image {
      asset-> {
        _id,
        url
      }
    },
    alt,
    link,
    order
  }
`);
