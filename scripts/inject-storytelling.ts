/**
 * inject-storytelling.ts
 *
 * Reads the old CSV (dodo_nutrition_120_produits_COMPLET.csv) and current products
 * (products-database.csv), then generates:
 * 1. data/storytelling-import.ndjson — patch payloads for product content (Portable Text)
 * 2. data/benefits-certifications-import.ndjson — patch payloads for benefits/certifications
 *
 * Does NOT write to Sanity — only produces NDJSON files for later import/patch.
 *
 * Run: npx tsx scripts/inject-storytelling.ts
 */

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { parse as parseHtml, type HTMLElement } from "node-html-parser";

// ─── Types ──────────────────────────────────────────────────────────────

interface OldCSVRow {
  ID: string;
  nom_produit: string;
  unite: string;
  valeur: string;
  servings: string;
  categorie_originale: string;
  categorie_cms: string;
  marque: string;
  nom_COIN_PRODUIT_ERP: string;
  description_longue_seo: string;
  meta_title: string;
  meta_keywords: string;
  meta_description: string;
  composition_detaillee: string;
  composition_nutritionnelle: string;
  ingredients_principaux: string;
  saveurs_disponibles: string;
  benefices_cles: string;
  allergenes: string;
  certifications: string;
  posologie_recommandee: string;
  image_filename: string;
  priorite: string;
  Colonne1: string;
  prix_detail: string;
  prix_achat: string;
  prix_gros: string;
  prix_barre: string;
  poids_volume_original: string;
}

interface CurrentProductRow {
  _id: string;
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

interface SanitySpan {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

interface SanityBlock {
  _type: "block";
  _key: string;
  style: string;
  children: SanitySpan[];
  markDefs: unknown[];
  listItem?: "bullet" | "number";
}

// ─── Helpers ────────────────────────────────────────────────────────────

function normalizeForMatch(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function generateKey(): string {
  return Math.random().toString(36).slice(2, 11);
}

function parsePipeArray(value: string): string[] {
  if (!value || value.trim() === "") return [];
  return value
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Old CSV uses comma separator for benefices_cles and certifications */
function parseCommaArray(value: string): string[] {
  if (!value || value.trim() === "") return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ─── HTML to Portable Text ──────────────────────────────────────────────

/** Convert inline HTML (with strong, em, b, i) to Sanity spans with marks */
function inlineToSpans(html: string): SanitySpan[] {
  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(?:div|span)(?:\s[^>]*)?>/gi, " ");
  const spans: SanitySpan[] = [];

  const tagRegex = /<(strong|b|em|i)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) {
      spans.push(...plainTextToSpans(before));
    }
    const mark = match[1].toLowerCase() === "em" || match[1].toLowerCase() === "i" ? "em" : "strong";
    const inner = match[2]
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?(?:strong|b|em|i|div|span)(?:\s[^>]*)?>/gi, "");
    const innerText = inner.replace(/<[^>]+>/g, "").trim();
    if (innerText) {
      spans.push({
        _type: "span",
        _key: generateKey(),
        text: innerText,
        marks: [mark],
      });
    }
    lastIndex = match.index + match[0].length;
  }

  const after = text.slice(lastIndex);
  if (after) {
    spans.push(...plainTextToSpans(after));
  }

  if (spans.length === 0 && text.trim()) {
    spans.push(...plainTextToSpans(text));
  }

  return spans;
}

function plainTextToSpans(text: string): SanitySpan[] {
  const cleaned = text
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
  if (!cleaned.trim()) return [];
  return [
    {
      _type: "span",
      _key: generateKey(),
      text: cleaned,
      marks: [],
    },
  ];
}

/** Convert HTML string to Sanity Portable Text blocks */
function htmlToPortableText(html: string): SanityBlock[] {
  if (!html || !html.trim()) return [];

  const blocks: SanityBlock[] = [];
  const root = parseHtml(`<div>${html}</div>`, { lowerCaseTagName: true });

  const blockElements = root.querySelectorAll("h2, h3, h4, p, ul, ol");
  if (blockElements.length === 0) {
    const text = root.textContent?.trim();
    if (text) {
      blocks.push(createBlock("normal", plainTextToSpans(text)));
    }
    return blocks;
  }

  for (const el of blockElements) {
    const tag = el.tagName?.toLowerCase();
    if (!tag) continue;

    if (tag === "ul" || tag === "ol") {
      const listItems = el.querySelectorAll("li");
      for (const li of listItems) {
        const liHtml = li.innerHTML;
        const spans = inlineToSpans(liHtml);
        if (spans.length > 0 || li.textContent?.trim()) {
          blocks.push(
            createBlock("normal", spans, tag === "ol" ? "number" : "bullet")
          );
        }
      }
      continue;
    }

    if (tag === "h2" || tag === "h3" || tag === "h4") {
      const style = tag as "h2" | "h3" | "h4";
      const text = (el as HTMLElement).innerHTML;
      const spans = inlineToSpans(text);
      if (spans.length > 0) {
        blocks.push(createBlock(style, spans));
      }
      continue;
    }

    if (tag === "p") {
      const text = (el as HTMLElement).innerHTML;
      const spans = inlineToSpans(text);
      if (spans.length > 0) {
        blocks.push(createBlock("normal", spans));
      }
    }
  }

  return blocks;
}

function createBlock(
  style: string,
  children: SanitySpan[],
  listItem?: "bullet" | "number"
): SanityBlock {
  const block: SanityBlock = {
    _type: "block",
    _key: generateKey(),
    style,
    children: children.length > 0 ? children : plainTextToSpans(" "),
    markDefs: [],
  };
  if (listItem) block.listItem = listItem;
  return block;
}

/** Check if content is already present in description, benefits, or certifications */
function isContentDuplicate(
  portableTextBlocks: SanityBlock[],
  description: string,
  benefits: string[],
  certifications: string[]
): boolean {
  const blockText = portableTextBlocks
    .map((b) => b.children.map((c) => c.text).join(""))
    .join(" ")
    .toLowerCase()
    .trim();
  if (!blockText || blockText.length < 50) return false;

  const descNorm = description?.toLowerCase().trim() ?? "";
  if (descNorm && blockText.includes(descNorm.slice(0, 80))) return true;

  for (const b of benefits) {
    const bn = b?.toLowerCase().trim();
    if (bn && bn.length > 20 && blockText.includes(bn.slice(0, 50))) return true;
  }

  for (const c of certifications) {
    const cn = c?.toLowerCase().trim();
    if (cn && blockText.includes(cn)) return true;
  }

  return false;
}

// ─── Main ───────────────────────────────────────────────────────────────

function main() {
  console.log("=== Inject Storytelling Script ===\n");

  const projectRoot = process.cwd();
  const oldCsvPath = path.join(projectRoot, "data/dodo_nutrition_120_produits_COMPLET.csv");
  const currentCsvPath = path.join(projectRoot, "data/products-database.csv");
  const storytellingOutPath = path.join(projectRoot, "data/storytelling-import.ndjson");
  const benefitsOutPath = path.join(projectRoot, "data/benefits-certifications-import.ndjson");

  if (!fs.existsSync(oldCsvPath)) {
    console.error(`Missing old CSV: ${oldCsvPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(currentCsvPath)) {
    console.error(`Missing current products CSV: ${currentCsvPath}`);
    process.exit(1);
  }

  // Read CSVs with UTF-8 for French characters
  const oldCsvRaw = fs.readFileSync(oldCsvPath, "utf-8");
  const currentCsvRaw = fs.readFileSync(currentCsvPath, "utf-8");

  const oldRecords = parse(oldCsvRaw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    bom: true,
  }) as OldCSVRow[];

  const currentRecords = parse(currentCsvRaw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    bom: true,
  }) as CurrentProductRow[];

  console.log(`Loaded ${oldRecords.length} rows from old CSV`);
  console.log(`Loaded ${currentRecords.length} products from current CSV\n`);

  const lookup = new Map<string, CurrentProductRow>();
  for (const row of currentRecords) {
    const key = `${normalizeForMatch(row.name)}::${normalizeForMatch(row.brand)}`;
    lookup.set(key, row);
  }

  const storytellingLines: string[] = [];
  const benefitsLines: string[] = [];
  const unmatched: string[] = [];
  let storytellingCount = 0;
  let benefitsCount = 0;
  let skippedDuplicate = 0;
  let skippedEmpty = 0;

  for (const oldRow of oldRecords) {
    const key = `${normalizeForMatch(oldRow.nom_produit)}::${normalizeForMatch(oldRow.marque)}`;
    const current = lookup.get(key);

    if (!current) {
      unmatched.push(`${oldRow.nom_produit} (${oldRow.marque})`);
      continue;
    }

    // 1. Storytelling: description_longue_seo → content (Portable Text)
    const html = oldRow.description_longue_seo?.trim();
    if (html) {
      const blocks = htmlToPortableText(html);
      if (blocks.length > 0) {
        const benefitsArr = parsePipeArray(current.benefits);
        const certsArr = parsePipeArray(current.certifications);
        if (isContentDuplicate(blocks, current.description, benefitsArr, certsArr)) {
          skippedDuplicate++;
        } else {
          storytellingLines.push(
            JSON.stringify({
              _id: current._id,
              content: blocks,
            })
          );
          storytellingCount++;
        }
      } else {
        skippedEmpty++;
      }
    }

    // 2. Benefits & Certifications: patch if current product has empty/missing
    const oldBenefits = oldRow.benefices_cles?.trim();
    const oldCerts = oldRow.certifications?.trim();
    if (!oldBenefits && !oldCerts) continue;

    const currentBenefits = parsePipeArray(current.benefits);
    const currentCerts = parsePipeArray(current.certifications);
    let needsPatch = false;
    const patch: Record<string, unknown> = { _id: current._id };

    if (oldBenefits && currentBenefits.length === 0) {
      const parsed = parseCommaArray(oldBenefits);
      if (parsed.length > 0) {
        patch.benefits = parsed;
        needsPatch = true;
      }
    }
    if (oldCerts && currentCerts.length === 0) {
      const parsed = parseCommaArray(oldCerts);
      if (parsed.length > 0) {
        patch.certifications = parsed;
        needsPatch = true;
      }
    }

    if (needsPatch) {
      benefitsLines.push(JSON.stringify(patch));
      benefitsCount++;
    }
  }

  fs.writeFileSync(storytellingOutPath, storytellingLines.join("\n"), "utf-8");
  fs.writeFileSync(benefitsOutPath, benefitsLines.join("\n"), "utf-8");

  console.log("=== Results ===");
  console.log(`Storytelling patches: ${storytellingCount} → ${storytellingOutPath}`);
  console.log(`  (skipped duplicate: ${skippedDuplicate}, empty content: ${skippedEmpty})`);
  console.log(`Benefits/Certifications patches: ${benefitsCount} → ${benefitsOutPath}`);
  if (unmatched.length > 0) {
    console.log(`\nUnmatched products (${unmatched.length}):`);
    unmatched.slice(0, 15).forEach((u) => console.log(`  - ${u}`));
    if (unmatched.length > 15) {
      console.log(`  ... and ${unmatched.length - 15} more`);
    }
  }
  console.log("\nDone. Use these NDJSON files with a Sanity patch script or similar.");
}

main();
