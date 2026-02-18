import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";

const CART_UPSELL_QUERY = defineQuery(`*[
  _type == "product"
  && category._ref in $categoryIds
  && !(_id in $excludeIds)
  && stock > 0
] | order(featured desc, name asc) [0...3] {
  _id,
  name,
  "slug": slug.current,
  priceRetail,
  "imageUrl": images[0].asset->url
}`);

const PRODUCT_CATEGORIES_QUERY = defineQuery(`*[
  _type == "product"
  && _id in $ids
] {
  _id,
  "categoryId": category._ref
}`);

export async function POST(request: Request) {
  try {
    const { productIds } = await request.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const productCategories = await client.fetch(PRODUCT_CATEGORIES_QUERY, {
      ids: productIds,
    });

    const categoryIds = [
      ...new Set(
        productCategories
          .map((p: { categoryId: string | null }) => p.categoryId)
          .filter(Boolean)
      ),
    ] as string[];

    if (categoryIds.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await client.fetch(CART_UPSELL_QUERY, {
      categoryIds,
      excludeIds: productIds,
    });

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
