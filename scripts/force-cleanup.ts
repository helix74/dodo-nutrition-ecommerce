/**
 * force-cleanup.ts — Delete old/duplicate documents from Sanity
 * Run: npx tsx scripts/force-cleanup.ts
 */

import { createClient } from "@sanity/client";
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_WRITE_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function deleteOne(id: string): Promise<boolean> {
  try {
    await client.delete(id);
    return true;
  } catch {
    return false;
  }
}

async function deleteBatch(ids: string[], label: string) {
  if (ids.length === 0) {
    console.log(`  ${label}: nothing to delete`);
    return;
  }
  console.log(`  ${label}: ${ids.length} documents...`);
  let ok = 0;
  let fail = 0;
  for (const id of ids) {
    if (await deleteOne(id)) ok++;
    else fail++;
  }
  console.log(`    Done: ${ok} deleted, ${fail} failed`);
}

async function main() {
  console.log("=== Force Cleanup ===\n");

  // 1. Delete orders (they reference old products)
  const orders = await client.fetch<{ _id: string }[]>(`*[_type == "order"]{_id}`);
  await deleteBatch(orders.map(o => o._id), "Orders");

  // 2. Delete reviews
  const reviews = await client.fetch<{ _id: string }[]>(`*[_type == "review"]{_id}`);
  await deleteBatch(reviews.map(r => r._id), "Reviews");

  // 3. Delete test packs
  const packs = await client.fetch<{ _id: string; name: string }[]>(`*[_type == "pack"]{_id, name}`);
  const testPacks = packs.filter(p => !p.name || p.name === "r3ad");
  await deleteBatch(testPacks.map(p => p._id), "Test packs");

  // 4. Fetch ALL products, filter old ones in JS
  const allProducts = await client.fetch<{ _id: string }[]>(`*[_type == "product"]{_id}`);
  const OLD_RE = /^product-\d+$/;
  const oldProducts = allProducts.filter(p => OLD_RE.test(p._id));
  const draftProducts = allProducts.filter(p => p._id.startsWith("drafts."));
  const manualProducts = allProducts.filter(p =>
    !p._id.startsWith("product-") && !p._id.startsWith("drafts.")
  );

  console.log(`\n  All products: ${allProducts.length}`);
  console.log(`  Old (product-N): ${oldProducts.length}`);
  console.log(`  Drafts: ${draftProducts.length}`);
  console.log(`  Manual/test: ${manualProducts.length}\n`);

  await deleteBatch(oldProducts.map(p => p._id), "Old products");
  await deleteBatch(draftProducts.map(p => p._id), "Drafts");
  await deleteBatch(manualProducts.map(p => p._id), "Manual/test");

  // 5. Delete old categories
  const KEEP_CATS = new Set([
    "category-proteines", "category-creatine", "category-pre-workout",
    "category-gainers", "category-bruleurs", "category-acides-amines",
    "category-vitamines", "category-boosters", "category-barres-snacks",
    "category-accessoires",
  ]);
  const allCats = await client.fetch<{ _id: string }[]>(`*[_type == "category"]{_id}`);
  const oldCats = allCats.filter(c => !KEEP_CATS.has(c._id));
  await deleteBatch(oldCats.map(c => c._id), "Old categories");

  // 6. Final state
  console.log("\n=== Final State ===");
  const counts = await client.fetch<Record<string, number>>(`{
    "products": count(*[_type == "product"]),
    "categories": count(*[_type == "category"]),
    "brands": count(*[_type == "brand"]),
    "orders": count(*[_type == "order"]),
    "packs": count(*[_type == "pack"])
  }`);
  Object.entries(counts).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  console.log("\nDone!");
}

main().catch(e => { console.error(e); process.exit(1); });
