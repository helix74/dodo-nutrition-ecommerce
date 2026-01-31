import { client } from "@/sanity/lib/client";

// Types
export interface Category {
  _id: string;
  title: string;
  slug: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
}

// Queries
const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  _id, 
  title, 
  "slug": slug.current
}`;

const BRANDS_QUERY = `*[_type == "brand"] | order(name asc) {
  _id, 
  name, 
  "slug": slug.current, 
  "logo": logo.asset->url
}`;

// Data fetching functions
export async function getCategories(): Promise<Category[]> {
  return client.fetch(CATEGORIES_QUERY);
}

export async function getBrands(): Promise<Brand[]> {
  return client.fetch(BRANDS_QUERY);
}
