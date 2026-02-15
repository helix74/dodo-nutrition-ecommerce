/**
 * export-products-csv.ts
 * 
 * Reads the exported JSON from Sanity and creates a clean CSV
 * for the user to fill in real prices and featured flags.
 * 
 * Run: npx tsx scripts/export-products-csv.ts
 */

import fs from "fs";
import path from "path";
import { stringify } from "csv-stringify/sync";

interface Product {
  _id: string;
  name: string;
  brand: string | null;
  category: string | null;
  description: string | null;
  unit: string | null;
  quantity: number | null;
  servings: number | null;
  flavors: string[] | null;
  benefits: string[] | null;
  allergens: string | null;
  certifications: string[] | null;
  dosage: string | null;
  priceRetail: number | null;
  pricePurchase: number | null;
  priceWholesale: number | null;
  priceSlashed: number | null;
  stock: number | null;
  featured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
}

function main() {
  const jsonPath = path.join(process.cwd(), "scripts/output/current-products-full.json");
  let raw = fs.readFileSync(jsonPath, "utf-8");
  // Remove BOM if present
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  const products: Product[] = JSON.parse(raw);

  console.log(`Loaded ${products.length} products from Sanity export\n`);

  const rows = products.map((p) => ({
    _id: p._id,
    name: p.name || "",
    brand: p.brand || "",
    category: p.category || "",
    description: p.description || "",
    unit: p.unit || "",
    quantity: p.quantity != null ? String(p.quantity) : "",
    servings: p.servings != null ? String(p.servings) : "",
    flavors: (p.flavors || []).join("|"),
    benefits: (p.benefits || []).join("|"),
    allergens: p.allergens || "",
    certifications: (p.certifications || []).join("|"),
    dosage: p.dosage || "",
    priceRetail: p.priceRetail != null ? String(p.priceRetail) : "",
    pricePurchase: p.pricePurchase != null ? String(p.pricePurchase) : "",
    priceWholesale: p.priceWholesale != null ? String(p.priceWholesale) : "",
    priceSlashed: p.priceSlashed != null ? String(p.priceSlashed) : "",
    stock: p.stock != null ? String(p.stock) : "100",
    featured: p.featured ? "true" : "false",
    metaTitle: p.metaTitle || "",
    metaDescription: p.metaDescription || "",
  }));

  const output = stringify(rows, {
    header: true,
    columns: [
      "_id", "name", "brand", "category", "description", "unit", "quantity",
      "servings", "flavors", "benefits", "allergens", "certifications",
      "dosage", "priceRetail", "pricePurchase", "priceWholesale",
      "priceSlashed", "stock", "featured", "metaTitle", "metaDescription",
    ],
  });

  const outputPath = path.join(process.cwd(), "data/products-database.csv");
  fs.writeFileSync(outputPath, output, "utf-8");
  console.log(`Exported to: ${outputPath}`);
  console.log(`${products.length} products with all fields.`);
  console.log(`\nColumns you need to fill/update:`);
  console.log(`  - priceRetail (REQUIRED — currently placeholder)`);
  console.log(`  - pricePurchase (optional — your cost price)`);
  console.log(`  - priceWholesale (optional — wholesale price)`);
  console.log(`  - priceSlashed (optional — old price for promos)`);
  console.log(`  - featured (true/false — max 8 best-sellers)`);
  console.log(`  - stock (real stock numbers)`);
}

main();
