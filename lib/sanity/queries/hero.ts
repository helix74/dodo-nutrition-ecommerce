import { defineQuery } from "next-sanity";

export const ACTIVE_HERO_SLIDES_QUERY = defineQuery(`
  *[
    _type == "heroSlide"
    && isActive == true
  ] | order(order asc) {
    _id,
    image {
      asset-> {
        _id,
        url
      }
    },
    headline,
    subtitle,
    ctaLabel,
    ctaLink,
    secondaryCtaLabel,
    secondaryCtaLink
  }
`);
