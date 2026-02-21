/**
 * diagnose-csv-match.ts
 * 
 * Quick diagnostic to understand why the inject-storytelling script only matched
 * 5 out of 119 products. Compares naming between old and new CSV.
 * 
 * Run: npx tsx scripts/diagnose-csv-match.ts
 */

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

function normalizeForMatch(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function main() {
  const projectRoot = process.cwd();
  const oldCsvPath = path.join(projectRoot, "data/dodo_nutrition_120_produits_COMPLET.csv");
  const currentCsvPath = path.join(projectRoot, "data/products-database.csv");

  const oldCsvRaw = fs.readFileSync(oldCsvPath, "utf-8");
  const currentCsvRaw = fs.readFileSync(currentCsvPath, "utf-8");

  const oldRecords = parse(oldCsvRaw, {
    columns: true, skip_empty_lines: true, trim: true,
    relax_column_count: true, bom: true,
  }) as Record<string, string>[];

  const currentRecords = parse(currentCsvRaw, {
    columns: true, skip_empty_lines: true, trim: true,
    relax_column_count: true, bom: true,
  }) as Record<string, string>[];

  console.log(`=== CSV Match Diagnostic ===\n`);
  console.log(`Old CSV: ${oldRecords.length} records`);
  console.log(`Current CSV: ${currentRecords.length} records\n`);

  // Show old CSV columns
  if (oldRecords.length > 0) {
    console.log(`Old CSV columns: ${Object.keys(oldRecords[0]).join(", ")}\n`);
  }

  // Build lookup from current CSV
  const currentLookup = new Map<string, Record<string, string>>();
  for (const row of currentRecords) {
    const key = `${normalizeForMatch(row.name || "")}::${normalizeForMatch(row.brand || "")}`;
    currentLookup.set(key, row);
  }

  // Check old CSV data quality
  let withDesc = 0, withBen = 0, withCert = 0, withAllergens = 0, withPosologie = 0;
  for (const row of oldRecords) {
    if (row.description_longue_seo?.trim()) withDesc++;
    if (row.benefices_cles?.trim()) withBen++;
    if (row.certifications?.trim()) withCert++;
    if (row.allergenes?.trim()) withAllergens++;
    if (row.posologie_recommandee?.trim()) withPosologie++;
  }
  console.log(`--- Old CSV Data Quality ---`);
  console.log(`With description_longue_seo: ${withDesc}/${oldRecords.length}`);
  console.log(`With benefices_cles: ${withBen}/${oldRecords.length}`);
  console.log(`With certifications: ${withCert}/${oldRecords.length}`);
  console.log(`With allergenes: ${withAllergens}/${oldRecords.length}`);
  console.log(`With posologie_recommandee: ${withPosologie}/${oldRecords.length}\n`);

  // Check current CSV data quality
  let curBen = 0, curCert = 0, curAllergens = 0, curDosage = 0;
  for (const row of currentRecords) {
    if (row.benefits?.trim()) curBen++;
    if (row.certifications?.trim()) curCert++;
    if (row.allergens?.trim()) curAllergens++;
    if (row.dosage?.trim()) curDosage++;
  }
  console.log(`--- Current CSV Data Quality ---`);
  console.log(`With benefits: ${curBen}/${currentRecords.length}`);
  console.log(`With certifications: ${curCert}/${currentRecords.length}`);
  console.log(`With allergens: ${curAllergens}/${currentRecords.length}`);
  console.log(`With dosage: ${curDosage}/${currentRecords.length}\n`);

  // Match analysis
  let matched = 0;
  const unmatchedOld: string[] = [];
  for (const oldRow of oldRecords) {
    const key = `${normalizeForMatch(oldRow.nom_produit || "")}::${normalizeForMatch(oldRow.marque || "")}`;
    if (currentLookup.has(key)) {
      matched++;
    } else {
      unmatchedOld.push(`OLD: "${oldRow.nom_produit}" [${oldRow.marque}] → key: "${key}"`);
    }
  }

  console.log(`--- Match Results ---`);
  console.log(`Matched: ${matched}/${oldRecords.length}`);
  console.log(`Unmatched from old CSV: ${unmatchedOld.length}\n`);

  if (unmatchedOld.length > 0) {
    console.log(`First 20 unmatched old products:`);
    unmatchedOld.slice(0, 20).forEach(u => console.log(`  ${u}`));
    console.log();
  }

  // Show first 5 current keys for comparison
  console.log(`First 10 current CSV keys:`);
  let i = 0;
  for (const [key, row] of currentLookup.entries()) {
    if (i >= 10) break;
    console.log(`  "${row.name}" [${row.brand}] → key: "${key}"`);
    i++;
  }
}

main();
