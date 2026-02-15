/**
 * csv-to-ndjson.ts
 *
 * Reads data/products-final.csv (clean format) and generates:
 * - Brand documents
 * - Category documents (with proper titles)
 * - Product documents (with references to brands & categories)
 *
 * Output: scripts/output/dodo-nutrition.ndjson
 *
 * Run: npx tsx scripts/csv-to-ndjson.ts
 * Import: npx sanity dataset import scripts/output/dodo-nutrition.ndjson production --replace
 */

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// ─── Types ──────────────────────────────────────────────────────────────

interface CSVRow {
  name: string;
  brand: string;
  category: string;
  description: string;
  unit: string;
  quantity: string;
  servings: string;
  flavors: string;
  benefits: string;
  allergens: string;
  certifications: string;
  dosage: string;
  priceRetail: string;
  pricePurchase: string;
  priceWholesale: string;
  priceSlashed: string;
  stock: string;
  featured: string;
  metaTitle: string;
  metaDescription: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseNumber(value: string): number | undefined {
  if (!value || value.trim() === "") return undefined;
  const n = parseFloat(value);
  return isNaN(n) ? undefined : n;
}

function parsePipeArray(value: string): string[] {
  if (!value || value.trim() === "") return [];
  return value
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ─── Category Titles ────────────────────────────────────────────────────

const CATEGORY_TITLES: Record<string, string> = {
  proteines: "Protéines",
  creatine: "Créatine",
  "pre-workout": "Pre-Workout",
  gainers: "Gainers",
  bruleurs: "Brûleurs de Graisse",
  "acides-amines": "Acides Aminés",
  vitamines: "Vitamines & Minéraux",
  boosters: "Boosters Hormonaux",
  "barres-snacks": "Barres & Snacks",
  accessoires: "Accessoires",
};

// ─── Category Descriptions ──────────────────────────────────────────────

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  proteines:
    "Whey, isolat, caséine et protéines végétales pour la croissance et la récupération musculaire.",
  creatine:
    "Créatine monohydrate et formules avancées pour la force, la puissance et les performances.",
  "pre-workout":
    "Boosters pré-entraînement pour l'énergie, le focus et l'endurance pendant vos séances.",
  gainers:
    "Gainers et mass builders riches en protéines et glucides pour la prise de masse.",
  bruleurs:
    "Brûleurs de graisse, L-carnitine et CLA pour la sèche et la perte de poids.",
  "acides-amines":
    "BCAA, EAA, glutamine et acides aminés pour la récupération et l'anti-catabolisme.",
  vitamines:
    "Vitamines, minéraux, oméga-3, collagène et compléments pour la santé globale.",
  boosters:
    "Boosters de testostérone, maca, ashwagandha et adaptogènes pour la vitalité masculine.",
  "barres-snacks":
    "Barres protéinées, cookies et snacks sains pour un apport en protéines au quotidien.",
  accessoires:
    "Shakers, accessoires d'entraînement et équipement pour la musculation.",
};

// ─── Main ───────────────────────────────────────────────────────────────

function main() {
  console.log("=== CSV to NDJSON Conversion ===\n");

  // Read clean CSV
  const csvPath = path.join(process.cwd(), "data/products-final.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CSVRow[];

  console.log(`Loaded ${records.length} products\n`);

  const outputLines: string[] = [];

  // ─── 1. Collect unique brands ──────────────────────────────────────────

  const brandsSet = new Set<string>();
  records.forEach((row) => {
    if (row.brand) brandsSet.add(row.brand.trim());
  });
  const brands = Array.from(brandsSet).sort();

  console.log(`Generating ${brands.length} brand documents...`);
  brands.forEach((brandName) => {
    const doc = {
      _type: "brand",
      _id: `brand-${createSlug(brandName)}`,
      name: brandName,
      slug: {
        _type: "slug",
        current: createSlug(brandName),
      },
    };
    outputLines.push(JSON.stringify(doc));
  });

  // ─── 2. Collect unique categories ──────────────────────────────────────

  const categoriesSet = new Set<string>();
  records.forEach((row) => {
    if (row.category) categoriesSet.add(row.category.trim());
  });
  const categories = Array.from(categoriesSet).sort();

  console.log(`Generating ${categories.length} category documents...`);
  categories.forEach((catSlug) => {
    const doc = {
      _type: "category",
      _id: `category-${catSlug}`,
      title: CATEGORY_TITLES[catSlug] || catSlug,
      slug: {
        _type: "slug",
        current: catSlug,
      },
      description: CATEGORY_DESCRIPTIONS[catSlug] || "",
    };
    outputLines.push(JSON.stringify(doc));
  });

  // ─── 3. Generate product documents ─────────────────────────────────────

  console.log(`Generating ${records.length} product documents...`);
  let successCount = 0;
  let errorCount = 0;

  records.forEach((row, index) => {
    try {
      const productSlug = createSlug(row.name);
      const brandSlug = createSlug(row.brand);
      const categorySlug = row.category.trim();
      // Unique ID = brand + product slug to avoid collisions
      const productId = `product-${brandSlug}-${productSlug}`;

      // Build product document
      const doc: Record<string, unknown> = {
        _type: "product",
        _id: productId,
        name: row.name,
        slug: {
          _type: "slug",
          current: productSlug,
        },
        brand: {
          _type: "reference",
          _ref: `brand-${brandSlug}`,
        },
        category: {
          _type: "reference",
          _ref: `category-${categorySlug}`,
        },
        description: row.description || undefined,
        unit: row.unit || undefined,
        quantity: parseNumber(row.quantity),
        servings: parseNumber(row.servings),
        flavors: parsePipeArray(row.flavors),
        benefits: parsePipeArray(row.benefits),
        allergens: row.allergens || undefined,
        certifications: parsePipeArray(row.certifications),
        dosage: row.dosage || undefined,
        priceRetail: parseNumber(row.priceRetail),
        pricePurchase: parseNumber(row.pricePurchase),
        priceWholesale: parseNumber(row.priceWholesale),
        priceSlashed: parseNumber(row.priceSlashed),
        stock: parseNumber(row.stock) ?? 100,
        featured: row.featured === "true",
        metaTitle: row.metaTitle || undefined,
        metaDescription: row.metaDescription || undefined,
      };

      // Remove undefined/empty values
      for (const key of Object.keys(doc)) {
        const val = doc[key];
        if (val === undefined || val === null) {
          delete doc[key];
        }
        if (Array.isArray(val) && val.length === 0) {
          delete doc[key];
        }
      }

      outputLines.push(JSON.stringify(doc));
      successCount++;
    } catch (error) {
      console.error(`  ERROR row ${index + 1} (${row.name}): ${error}`);
      errorCount++;
    }
  });

  // ─── 4. Write output ──────────────────────────────────────────────────

  const outputDir = path.join(process.cwd(), "scripts/output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "dodo-nutrition.ndjson");
  fs.writeFileSync(outputPath, outputLines.join("\n"), "utf-8");

  // ─── Report ───────────────────────────────────────────────────────────

  console.log(`\n=== Results ===`);
  console.log(`Total NDJSON documents: ${outputLines.length}`);
  console.log(`  Brands: ${brands.length}`);
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Products: ${successCount} (${errorCount} errors)`);
  console.log(`\nOutput: ${outputPath}`);

  // Sanity check: verify all category references exist
  const catIds = new Set(categories.map((c) => `category-${c}`));
  const brandIds = new Set(brands.map((b) => `brand-${createSlug(b)}`));
  let refErrors = 0;

  records.forEach((row) => {
    const catRef = `category-${row.category.trim()}`;
    if (!catIds.has(catRef)) {
      console.error(`  MISSING category ref: ${catRef} for ${row.name}`);
      refErrors++;
    }
    const brandRef = `brand-${createSlug(row.brand)}`;
    if (!brandIds.has(brandRef)) {
      console.error(`  MISSING brand ref: ${brandRef} for ${row.name}`);
      refErrors++;
    }
  });

  if (refErrors === 0) {
    console.log("\nAll references validated OK!");
  } else {
    console.error(`\n${refErrors} reference errors found!`);
  }

  console.log(
    `\nTo import: npx sanity dataset import ${outputPath} production --replace`
  );
}

main();
