import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dodonutrition.tn";

const SITEMAP_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
] | order(name asc) {
  "slug": slug.current,
  _updatedAt
}`);

const SITEMAP_CATEGORIES_QUERY = defineQuery(`*[
  _type == "category"
] | order(title asc) {
  "slug": slug.current,
  _updatedAt
}`);

const SITEMAP_BRANDS_QUERY = defineQuery(`*[
  _type == "brand"
] | order(name asc) {
  "slug": slug.current,
  _updatedAt
}`);

const SITEMAP_PACKS_QUERY = defineQuery(`*[
  _type == "pack"
] | order(name asc) {
  "slug": slug.current,
  _updatedAt
}`);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, brands, packs] = await Promise.all([
    client.fetch(SITEMAP_PRODUCTS_QUERY),
    client.fetch(SITEMAP_CATEGORIES_QUERY),
    client.fetch(SITEMAP_BRANDS_QUERY),
    client.fetch(SITEMAP_PACKS_QUERY),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/packs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/promotions`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.3,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products.map(
    (p: { slug: string | null; _updatedAt: string | null }) => ({
      url: `${siteUrl}/products/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  const categoryPages: MetadataRoute.Sitemap = categories.map(
    (c: { slug: string | null; _updatedAt: string | null }) => ({
      url: `${siteUrl}/categories/${c.slug}`,
      lastModified: c._updatedAt ? new Date(c._updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  const brandPages: MetadataRoute.Sitemap = brands.map(
    (b: { slug: string | null; _updatedAt: string | null }) => ({
      url: `${siteUrl}/brands/${b.slug}`,
      lastModified: b._updatedAt ? new Date(b._updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  const packPages: MetadataRoute.Sitemap = packs.map(
    (p: { slug: string | null; _updatedAt: string | null }) => ({
      url: `${siteUrl}/packs/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }),
  );

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...brandPages,
    ...packPages,
  ];
}
