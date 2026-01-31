import { client } from "@/sanity/lib/client";
import { MegaMenu, CategoriesMegaMenu, BrandsMegaMenu } from "./MegaMenu";

// Sanity Queries
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

// Server component to fetch and render Categories Mega Menu
export async function CategoriesMegaMenuServer() {
  const categories = await client.fetch(CATEGORIES_QUERY);
  
  return (
    <MegaMenu label="التصنيفات" href="/categories">
      <CategoriesMegaMenu categories={categories} />
    </MegaMenu>
  );
}

// Server component to fetch and render Brands Mega Menu
export async function BrandsMegaMenuServer() {
  const brands = await client.fetch(BRANDS_QUERY);
  
  return (
    <MegaMenu label="الماركات" href="/brands">
      <BrandsMegaMenu brands={brands} />
    </MegaMenu>
  );
}
