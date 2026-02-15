/**
 * cleanup-sanity.ts
 * 
 * Analyzes duplicates between old and new products in Sanity,
 * verifies new versions cover old fields, then generates
 * an NDJSON mutation file to delete old documents.
 * 
 * Run: npx tsx scripts/cleanup-sanity.ts
 * Then: npx sanity dataset import scripts/output/delete-old.ndjson production
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// ─── Query Sanity ───────────────────────────────────────────────────────

function querySanity(groq: string): unknown[] {
  const result = execSync(
    `npx sanity documents query "${groq.replace(/"/g, "'")}" --apiVersion 2024-01-01`,
    { cwd: process.cwd(), encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
  );
  return JSON.parse(result);
}

// ─── Main ───────────────────────────────────────────────────────────────

function main() {
  console.log("=== Sanity Cleanup Analysis ===\n");

  // 1. Get ALL products with details
  console.log("Fetching all products...");
  const allProducts = querySanity(
    `*[_type == 'product']{_id, name, description, priceRetail, stock, featured, unit, quantity, 'brandName': brand->name, 'categorySlug': category->slug.current, 'hasBenefits': defined(benefits), 'hasCertifications': defined(certifications), 'hasImages': defined(images)}`
  ) as Array<{
    _id: string;
    name: string;
    description: string | null;
    priceRetail: number | null;
    stock: number | null;
    featured: boolean;
    unit: string | null;
    quantity: number | null;
    brandName: string | null;
    categorySlug: string | null;
    hasBenefits: boolean;
    hasCertifications: boolean;
    hasImages: boolean;
  }>;

  console.log(`Total products in Sanity: ${allProducts.length}\n`);

  // 2. Separate old vs new
  const OLD_PATTERN = /^product-\d+$/;  // product-1, product-2, etc.
  const NEW_PATTERN = /^product-[a-z]+-/; // product-brand-name-...
  
  const oldProducts = allProducts.filter(p => OLD_PATTERN.test(p._id));
  const newProducts = allProducts.filter(p => NEW_PATTERN.test(p._id));
  const otherProducts = allProducts.filter(p => !OLD_PATTERN.test(p._id) && !NEW_PATTERN.test(p._id));

  console.log(`Old products (product-N): ${oldProducts.length}`);
  console.log(`New products (product-brand-slug): ${newProducts.length}`);
  console.log(`Other/manual products: ${otherProducts.length}`);
  
  if (otherProducts.length > 0) {
    console.log("  Other IDs:");
    otherProducts.forEach(p => console.log(`    ${p._id}: ${p.name}`));
  }

  // 3. Match old → new by name
  console.log("\n=== MATCHING OLD → NEW ===\n");
  
  const newByName: Record<string, typeof newProducts[0][]> = {};
  newProducts.forEach(p => {
    const key = p.name?.toLowerCase().trim() || "";
    if (!newByName[key]) newByName[key] = [];
    newByName[key].push(p);
  });

  let matchedCount = 0;
  let unmatchedOld: typeof oldProducts = [];
  const coverageIssues: string[] = [];

  oldProducts.forEach(old => {
    const key = old.name?.toLowerCase().trim() || "";
    const matches = newByName[key];

    if (!matches || matches.length === 0) {
      unmatchedOld.push(old);
      return;
    }

    matchedCount++;
    const newProd = matches[0]; // Take first match

    // Verify coverage: new has at least what old had
    const issues: string[] = [];
    
    if (old.description && !newProd.description) {
      issues.push("description missing in new");
    }
    if (old.unit && !newProd.unit) {
      issues.push("unit missing in new");
    }
    if (old.hasBenefits && !newProd.hasBenefits) {
      issues.push("benefits missing in new");
    }
    if (old.hasCertifications && !newProd.hasCertifications) {
      issues.push("certifications missing in new");
    }
    if (old.hasImages && !newProd.hasImages) {
      // Images from old won't be in new (expected — user adds manually)
      // Don't flag as issue
    }

    if (issues.length > 0) {
      coverageIssues.push(`${old.name}: ${issues.join(", ")}`);
    }
  });

  console.log(`Matched (old has new equivalent): ${matchedCount}/${oldProducts.length}`);
  
  if (unmatchedOld.length > 0) {
    console.log(`\nUNMATCHED old products (${unmatchedOld.length}) — no new equivalent found:`);
    unmatchedOld.forEach(p => console.log(`  ${p._id}: "${p.name}" (brand: ${p.brandName})`));
  }

  if (coverageIssues.length > 0) {
    console.log(`\nCoverage issues (${coverageIssues.length}):`);
    coverageIssues.forEach(i => console.log(`  ⚠ ${i}`));
  } else {
    console.log("\n✅ All matched products: new version covers old version fields!");
  }

  // 4. Categories analysis
  console.log("\n=== CATEGORIES ===\n");
  const allCategories = querySanity(
    `*[_type == 'category']{_id, title, 'slug': slug.current}`
  ) as Array<{ _id: string; title: string; slug: string }>;

  console.log(`Total categories: ${allCategories.length}`);
  
  // Group by slug to find duplicates
  const catBySlug: Record<string, typeof allCategories> = {};
  allCategories.forEach(c => {
    const slug = c.slug || "no-slug";
    if (!catBySlug[slug]) catBySlug[slug] = [];
    catBySlug[slug].push(c);
  });

  const KEEP_CATEGORY_IDS = new Set([
    "category-proteines", "category-creatine", "category-pre-workout",
    "category-gainers", "category-bruleurs", "category-acides-amines",
    "category-vitamines", "category-boosters", "category-barres-snacks",
    "category-accessoires",
  ]);

  const categoriesToDelete: string[] = [];
  
  Object.entries(catBySlug).forEach(([slug, cats]) => {
    const kept = cats.filter(c => KEEP_CATEGORY_IDS.has(c._id));
    const toDelete = cats.filter(c => !KEEP_CATEGORY_IDS.has(c._id));
    
    if (cats.length > 1) {
      console.log(`  DUPLICATE slug "${slug}":`);
      cats.forEach(c => {
        const status = KEEP_CATEGORY_IDS.has(c._id) ? "✅ KEEP" : "❌ DELETE";
        console.log(`    ${status} ${c._id} — "${c.title}"`);
      });
    }
    
    toDelete.forEach(c => categoriesToDelete.push(c._id));
  });

  // Also delete invalid categories
  const invalidCats = allCategories.filter(c => 
    !KEEP_CATEGORY_IDS.has(c._id) && 
    !categoriesToDelete.includes(c._id)
  );
  invalidCats.forEach(c => {
    if (!categoriesToDelete.includes(c._id)) {
      categoriesToDelete.push(c._id);
      console.log(`  INVALID: ${c._id} — "${c.title}" (slug: ${c.slug}) ❌ DELETE`);
    }
  });

  // 5. Brands analysis
  console.log("\n=== BRANDS ===\n");
  const allBrands = querySanity(
    `*[_type == 'brand']{_id, name, 'slug': slug.current}`
  ) as Array<{ _id: string; name: string; slug: string }>;

  const brandBySlug: Record<string, typeof allBrands> = {};
  allBrands.forEach(b => {
    const slug = b.slug || "no-slug";
    if (!brandBySlug[slug]) brandBySlug[slug] = [];
    brandBySlug[slug].push(b);
  });

  const brandsToDelete: string[] = [];
  Object.entries(brandBySlug).forEach(([slug, brands]) => {
    if (brands.length > 1) {
      console.log(`  DUPLICATE slug "${slug}":`);
      // Keep the one with deterministic ID
      brands.forEach(b => {
        const shouldKeep = b._id.startsWith("brand-");
        const status = shouldKeep ? "✅ KEEP" : "❌ DELETE";
        console.log(`    ${status} ${b._id} — "${b.name}"`);
        if (!shouldKeep) brandsToDelete.push(b._id);
      });
    }
  });

  // Check for "william-bonac" duplicate brand
  if (brandBySlug["william-bonac"]) {
    const wb = brandBySlug["william-bonac"];
    if (wb.length === 1 && wb[0]._id === "brand-william-bonac") {
      // Old brand with different name from new
      console.log(`  ORPHAN: brand-william-bonac — "William Bonac" (replaced by "William Bonac / The Legend Series") ❌ DELETE`);
      brandsToDelete.push("brand-william-bonac");
    }
  }

  console.log(`\nBrands total: ${allBrands.length}, to delete: ${brandsToDelete.length}`);

  // 6. Build deletion list
  console.log("\n=== DELETION SUMMARY ===\n");
  
  const idsToDelete: string[] = [];

  // Old products
  oldProducts.forEach(p => idsToDelete.push(p._id));
  console.log(`Old products to delete: ${oldProducts.length}`);

  // Draft products
  const drafts = allProducts.filter(p => p._id.startsWith("drafts."));
  drafts.forEach(p => idsToDelete.push(p._id));
  console.log(`Draft products to delete: ${drafts.length}`);

  // Manual/test products (non-standard IDs)
  otherProducts.filter(p => !p._id.startsWith("drafts.")).forEach(p => {
    idsToDelete.push(p._id);
  });
  console.log(`Other/test products to delete: ${otherProducts.filter(p => !p._id.startsWith("drafts.")).length}`);

  // Old categories
  categoriesToDelete.forEach(id => idsToDelete.push(id));
  console.log(`Categories to delete: ${categoriesToDelete.length}`);

  // Old brands
  brandsToDelete.forEach(id => idsToDelete.push(id));
  console.log(`Brands to delete: ${brandsToDelete.length}`);

  console.log(`\nTOTAL documents to delete: ${idsToDelete.length}`);
  console.log(`Documents to keep: ${allProducts.length + allCategories.length + allBrands.length - idsToDelete.length}`);

  // 7. Generate deletion mutations NDJSON
  const mutations = idsToDelete.map(id => 
    JSON.stringify({ delete: { id } })
  );

  const outputPath = path.join(process.cwd(), "scripts/output/delete-old.ndjson");
  fs.writeFileSync(outputPath, mutations.join("\n"), "utf-8");
  
  console.log(`\nDeletion file: ${outputPath}`);
  console.log(`\nTo execute deletion:`);
  console.log(`  npx sanity documents delete ${idsToDelete.slice(0, 3).join(" ")} ...`);
  console.log(`  (or use the script's bulk delete below)`);

  // Also write a simple list of IDs for bulk deletion via CLI
  const idsPath = path.join(process.cwd(), "scripts/output/ids-to-delete.txt");
  fs.writeFileSync(idsPath, idsToDelete.join("\n"), "utf-8");
  console.log(`\nID list: ${idsPath}`);
}

main();
