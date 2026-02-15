/**
 * fix-products-csv.ts
 * 
 * Reads the original dodo_nutrition_120_produits_COMPLET.csv
 * and produces a clean, schema-compliant products-final.csv
 * 
 * Fixes: categories, descriptions, benefits, certifications,
 * units, flavors, metaTitle, metaDescription, prices, featured, stock
 * 
 * Run: npx tsx scripts/fix-products-csv.ts
 */

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

// ─── Types ──────────────────────────────────────────────────────────────

interface OriginalRow {
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

interface CleanRow {
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

// ─── Category Mapping ────────────────────────────────────────────────────

const CATEGORY_RULES: Array<{
  slug: string;
  keywords: RegExp;
  priority: number;
}> = [
  { slug: "pre-workout", keywords: /pre[- ]?workout|behemoth|viking rage|mr x pre|extreme pre|pre amino/i, priority: 1 },
  { slug: "gainers", keywords: /gainer|mass |serious mass|prise de masse|cream of rice|jumbo|big ramy|critical mass/i, priority: 2 },
  { slug: "proteines", keywords: /whey|isolat|isolate|protein|casein|caséine|egg protein|iso pro|isolate pro/i, priority: 3 },
  { slug: "creatine", keywords: /creatine|créatine|monohydrate(?!.*pre)/i, priority: 4 },
  { slug: "acides-amines", keywords: /bcaa|eaa |amino|glutamine|leucine|acides aminés|citrulline|beta.?alanine|arginine/i, priority: 5 },
  { slug: "bruleurs", keywords: /burner|fat burn|carnitine|l-carnitine|cla[\s+]|thermo|brûleur|hydroxycut|lipo.?6|minci|keto weight|nopal|shed h2o|shred/i, priority: 6 },
  { slug: "vitamines", keywords: /vitamin|vitamine|zinc|magnés|magnesium|omega|oméga|multivitamin|d3|b12|b-complex|fer |calcium|minéral|collagen|collagène|immuno|fish oil|multi vit|ultra mag|neuro plus|spiruline|moringa|chardon marie|probio|probiotique|detox|curcuma/i, priority: 7 },
  { slug: "boosters", keywords: /testo|testosterone|tribulus|maca|ashwagandha|shilajit|fenugrec|ecdysterone|booster hormon|libido|zma|a-hd elite|anabol|prosta/i, priority: 8 },
  { slug: "barres-snacks", keywords: /barre|bar |snack|cookie|biscuit|brownie|wafer|chips protéin/i, priority: 9 },
  { slug: "accessoires", keywords: /shaker|ceinture|belt|gants|gloves|sangle|strap|bouteille|accessoire|serviette|sac/i, priority: 10 },
];

function categorize(name: string, categorieCms: string): string {
  const nameLower = name.toLowerCase();

  // Special manual overrides for known misclassified products
  const overrides: Record<string, string> = {
    "guarana (22% guaranine) - 90 capsules": "boosters",
    "collagen mix (hydrolysé verisol) - 120g": "vitamines",
    "collagen powder - 165g": "vitamines",
  };
  if (overrides[nameLower]) return overrides[nameLower];

  // Check creatine specifically — must NOT be a pre-workout container
  if (/creatine|créatine/i.test(nameLower) && !/pre[- ]?workout/i.test(nameLower)) {
    return "creatine";
  }

  // Go through rules by priority
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.test(nameLower)) {
      return rule.slug;
    }
  }

  // Fallback: try CMS category
  const cmsMap: Record<string, string> = {
    "PRE-WORKOUT": "pre-workout",
    "MASS GAINERS": "gainers",
    "WHEY PROTÉINES": "proteines",
    "CRÉATINE": "creatine",
    "ACIDES AMINÉS": "acides-amines",
    "BRÛLEURS DE GRAISSE": "bruleurs",
    "VITAMINES & MINÉRAUX": "vitamines",
    "TESTOSTÉRONE BOOSTERS": "boosters",
    "ACCESSOIRES & AUTRES": "accessoires",
    "RÉCUPÉRATION & SANTÉ": "vitamines",
  };
  return cmsMap[categorieCms] || "vitamines";
}

// ─── HTML / Text Cleanup ────────────────────────────────────────────────

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?(p|div|li|ul|ol|h[1-6]|strong|em|b|i|span|a|table|tr|td|th|thead|tbody|blockquote)[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, "")
    .replace(/[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}\u{20E3}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{2934}\u{2935}\u{25AA}\u{25AB}\u{25FE}\u{25FD}\u{25FB}\u{25FC}✅🎯💪🏆🚀🔥⚡✨🌟⭐️🥇🥈🥉💯🔬📊📈💊💉🏋️🏃🏅🎖️]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Generic template patterns to detect and replace
const GENERIC_TEMPLATES = [
  /est un complément de nutrition sportive de haute qualité conçu pour vous aider à atteindre vos objectifs fitness\.?\s*Que vous soyez débutant ou athlète confirmé[\s,]*(?:en Tunisie,?\s*)?ce produit vous apporte les nutriments essentiels pour performer et progresser\.?/gi,
  /est le booster pré-entraînement (?:ultime )?pour décupler votre énergie,? votre focus mental et votre endurance pendant vos séances de musculation\.?\s*Conçu pour les athlètes sérieux[\s,]*Pour repousser vos limites et d'atteindre vos objectifs plus rapidement\.?/gi,
  /est le complément incontournable pour augmenter votre force,? votre puissance et vos performances à l'entraînement\.?\s*Utilisée par des millions d'athlètes dans le monde,? la créatine est le supplément le plus étudié et prouvé scientifiquement pour améliorer les perf\.{0,3}/gi,
];

const CATEGORY_DESCRIPTIONS: Record<string, (name: string, brand: string) => string> = {
  proteines: (name, brand) =>
    `${name} de ${brand} est une protéine premium pour la croissance et la récupération musculaire. Formule riche en acides aminés essentiels, idéale après l'entraînement.`,
  creatine: (name, brand) =>
    `${name} de ${brand}, créatine pure pour augmenter la force, la puissance et les performances musculaires. Le supplément le plus étudié scientifiquement.`,
  "pre-workout": (name, brand) =>
    `${name} de ${brand}, booster pré-entraînement pour une énergie explosive, un focus mental accru et une endurance prolongée pendant vos séances.`,
  gainers: (name, brand) =>
    `${name} de ${brand} est un gainer riche en protéines et glucides pour la prise de masse musculaire. Apport calorique élevé pour les athlètes en phase de construction.`,
  bruleurs: (name, brand) =>
    `${name} de ${brand} est un brûleur de graisse qui accélère le métabolisme et favorise la perte de poids. Formule thermogénique pour une sèche efficace.`,
  "acides-amines": (name, brand) =>
    `${name} de ${brand}, acides aminés essentiels pour la récupération musculaire et la réduction des courbatures. Soutient la synthèse protéique et l'endurance.`,
  vitamines: (name, brand) =>
    `${name} de ${brand} pour soutenir votre santé globale, votre immunité et vos performances sportives. Formule complète en vitamines et minéraux essentiels.`,
  boosters: (name, brand) =>
    `${name} de ${brand}, booster naturel pour optimiser vos niveaux hormonaux, votre vitalité et vos performances physiques. Ingrédients naturels concentrés.`,
  "barres-snacks": (name, brand) =>
    `${name} de ${brand}, snack protéiné savoureux et pratique pour un apport en protéines entre les repas. Idéal pour le sport et le quotidien.`,
  accessoires: (name, brand) =>
    `${name} de ${brand}, accessoire de qualité pour accompagner vos entraînements. Conçu pour la durabilité et le confort.`,
};

function createShortDescription(
  name: string,
  brand: string,
  longDesc: string,
  category: string,
  benefitsRaw: string
): string {
  // Strip HTML first
  const clean = stripHtml(longDesc);

  // Extract first paragraph (before "Bénéfices" or "Pourquoi")
  let firstParagraph = clean
    .split(/Bénéfices|Pourquoi|Composition|Tableau|Informations|Comment|Mode d'emploi/i)[0]
    ?.trim();

  if (firstParagraph && firstParagraph.length > 30) {
    // Remove excessive marketing
    let desc = firstParagraph
      .replace(/ultime |révolutionnaire |n°1 mondial |incomparable |extraordinaire /gi, "")
      .replace(/en Tunisie,?\s*/gi, "")
      .replace(/ce (pre-workout|produit|complément) vous permet de /gi, "Pour ")
      .replace(/\s+/g, " ")
      .trim();

    // Check if it's a generic template
    let isGeneric = false;
    for (const pattern of GENERIC_TEMPLATES) {
      if (pattern.test(desc)) {
        isGeneric = true;
        break;
      }
    }

    // Also check for specific generic phrases
    if (
      desc.includes("conçu pour vous aider à atteindre vos objectifs fitness") ||
      desc.includes("nutriments essentiels pour performer et progresser") ||
      desc.includes("Pour repousser vos limites et d'atteindre vos objectifs")
    ) {
      isGeneric = true;
    }

    if (isGeneric) {
      // Use category-specific description instead
      const generator = CATEGORY_DESCRIPTIONS[category];
      if (generator) return generator(name, brand);
    }

    // Truncate at sentence boundary before 300 chars
    if (desc.length > 300) {
      const lastDot = desc.lastIndexOf(".", 300);
      if (lastDot > 80) {
        desc = desc.substring(0, lastDot + 1);
      } else {
        desc = desc.substring(0, 297) + "...";
      }
    }
    return desc;
  }

  // Fallback: use category-specific description
  const generator = CATEGORY_DESCRIPTIONS[category];
  if (generator) return generator(name, brand);

  return `${name} de ${brand}. Complément de nutrition sportive de qualité pour vos objectifs fitness.`;
}

// ─── Benefits Cleanup ───────────────────────────────────────────────────

function cleanBenefits(raw: string, category: string): string {
  if (!raw) return "";

  const stripped = stripHtml(raw);

  // First try to split by numbered items "1. ... 2. ... 3. ..."
  let items: string[];
  if (/\d+\.\s/.test(stripped)) {
    items = stripped
      .split(/\d+\.\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 3);
  } else {
    // Split by various delimiters
    items = stripped.split(/[,|\n]/);
  }

  items = items
    .map((s) => s.replace(/^\d+[\.\)]\s*/, "").trim()) // Remove numbering
    .map((s) => s.replace(/^[-•]\s*/, "").trim()) // Remove bullets
    .filter((s) => s.length > 3 && s.length < 120); // Filter garbage

  // Clean each benefit
  items = items.map((item) => {
    // Capitalize first letter
    let clean = item.charAt(0).toUpperCase() + item.slice(1);
    // Remove trailing dots
    clean = clean.replace(/\.+$/, "");
    return clean;
  });

  // Deduplicate (approximate)
  const seen = new Set<string>();
  items = items.filter((item) => {
    const key = item.toLowerCase().replace(/\s+/g, " ").substring(0, 30);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Take max 6 benefits
  return items.slice(0, 6).join("|");
}

// ─── Certifications Cleanup ─────────────────────────────────────────────

const VALID_CERTS = [
  "GMP",
  "GMP Certified",
  "ISO 9001",
  "ISO 22000",
  "Halal",
  "Halal Certifié",
  "Informed Sport",
  "Informed Choice",
  "BRC",
  "HACCP",
  "Vegan",
  "Vegan Certifié",
  "GMO Free",
  "Sans OGM",
  "EFSA",
  "FDA Registered",
  "NSF Certified",
  "Gluten Free",
  "Sans Gluten",
  "Lactose Free",
];

function cleanCertifications(raw: string): string {
  if (!raw) return "";
  const stripped = stripHtml(raw);

  const found: string[] = [];
  for (const cert of VALID_CERTS) {
    if (stripped.toLowerCase().includes(cert.toLowerCase())) {
      // Use standardized name
      if (!found.some((f) => f.toLowerCase() === cert.toLowerCase())) {
        found.push(cert);
      }
    }
  }

  return found.slice(0, 5).join("|");
}

// ─── Flavors Cleanup ────────────────────────────────────────────────────

function cleanFlavors(raw: string): string {
  if (!raw) return "";

  const stripped = stripHtml(raw);
  const lower = stripped.toLowerCase();

  // Skip non-flavors
  if (
    lower.includes("n/a") ||
    lower.includes("sans saveur") ||
    lower.includes("non applicable") ||
    lower.includes("unflavoured") ||
    lower.includes("non spécifié") ||
    lower.includes("multiples (non") ||
    lower.includes("gélule") ||
    lower.includes("capsule") ||
    lower.includes("100% pur")
  ) {
    return "";
  }

  // Split and clean
  const flavors = stripped
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 50)
    .filter(
      (s) =>
        !/sans saveur|n\/a|non applicable|gélule|capsule|unflavoured|softgel|odorless/i.test(
          s
        )
    );

  return flavors.join("|");
}

// ─── Unit Mapping ───────────────────────────────────────────────────────

function mapUnit(csvUnit: string, productName: string): string {
  const unitMap: Record<string, string> = {
    Gramme: "gramme",
    gramme: "gramme",
    Kilogramme: "kilogramme",
    kilogramme: "kilogramme",
    Millilitre: "millilitre",
    millilitre: "millilitre",
    ml: "millilitre",
    "Gélule": "gélule",
    "gélule": "gélule",
    Capsule: "capsule",
    capsule: "capsule",
    "Comprimé": "comprimé",
    "comprimé": "comprimé",
    softgel: "gélule",
    Softgel: "gélule",
  };

  const mapped = unitMap[csvUnit];
  if (mapped) return mapped;

  // Infer from product name
  const name = productName.toLowerCase();
  if (name.includes("capsule")) return "capsule";
  if (name.includes("gélule") || name.includes("softgel")) return "gélule";
  if (name.includes("comprimé")) return "comprimé";
  if (name.includes("kg") || name.includes("kilogramme")) return "kilogramme";
  if (name.includes("ml") || name.includes("shaker")) return "millilitre";

  return "gramme";
}

// ─── Allergens Cleanup ──────────────────────────────────────────────────

function cleanAllergens(raw: string): string {
  if (!raw) return "";
  let clean = stripHtml(raw);

  // Remove marketing stuff
  clean = clean
    .replace(
      /Non recommandé.*?(?=\.|$)/gi,
      ""
    )
    .replace(
      /Attention.*?(?=\.|$)/gi,
      ""
    )
    .replace(/AUCUN allergène principal\.?\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length < 5) return "";
  if (clean.length > 300) {
    const lastDot = clean.lastIndexOf(".", 300);
    clean = lastDot > 50 ? clean.substring(0, lastDot + 1) : clean.substring(0, 297) + "...";
  }
  return clean;
}

// ─── Dosage Cleanup ─────────────────────────────────────────────────────

function cleanDosage(raw: string): string {
  if (!raw) return "";
  let clean = stripHtml(raw);

  // Keep it concise
  clean = clean
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length > 300) {
    const lastDot = clean.lastIndexOf(".", 300);
    clean = lastDot > 50 ? clean.substring(0, lastDot + 1) : clean.substring(0, 297) + "...";
  }
  return clean;
}

// ─── Prices (Placeholder) ───────────────────────────────────────────────

function generatePlaceholderPrices(
  name: string,
  category: string,
  quantity: number,
  unit: string
): { retail: number; purchase: number; wholesale: number } {
  const nameLower = name.toLowerCase();

  // Base prices by category (in TND)
  const basePrices: Record<string, number> = {
    proteines: 130,
    creatine: 55,
    "pre-workout": 85,
    gainers: 120,
    bruleurs: 80,
    "acides-amines": 75,
    vitamines: 45,
    boosters: 65,
    "barres-snacks": 25,
    accessoires: 20,
  };

  let base = basePrices[category] || 60;

  // Adjust by size/quantity
  if (unit === "kilogramme") {
    base *= quantity; // Scale by kg
  } else if (unit === "gramme") {
    if (quantity >= 2000) base *= 2.0;
    else if (quantity >= 1000) base *= 1.5;
    else if (quantity >= 500) base *= 1.0;
    else if (quantity >= 300) base *= 0.8;
    else if (quantity >= 150) base *= 0.6;
    else base *= 0.5;
  } else if (unit === "gélule" || unit === "capsule" || unit === "comprimé") {
    if (quantity >= 180) base *= 1.5;
    else if (quantity >= 120) base *= 1.2;
    else if (quantity >= 90) base *= 1.0;
    else if (quantity >= 60) base *= 0.85;
    else base *= 0.7;
  }

  // Brand premium
  if (/applied nutrition|muscleTech|rule 1/i.test(nameLower)) base *= 1.15;
  if (/olimp|biotech/i.test(nameLower)) base *= 1.1;

  // Isolate premium
  if (/isolat/i.test(nameLower)) base *= 1.3;

  // Round to nearest 5
  const retail = Math.round(base / 5) * 5;
  const purchase = Math.round(retail * 0.55 / 5) * 5;
  const wholesale = Math.round(retail * 0.78 / 5) * 5;

  return { retail: Math.max(retail, 15), purchase: Math.max(purchase, 10), wholesale: Math.max(wholesale, 12) };
}

// ─── SEO ────────────────────────────────────────────────────────────────

function createMetaTitle(name: string, brand: string): string {
  // Format: "Nom | Marque | Dodo Nutrition" — max 60 chars
  const full = `${name} | ${brand} | Dodo Nutrition`;
  if (full.length <= 60) return full;

  // Try without "Dodo Nutrition"
  const shorter = `${name} | ${brand} Tunisie`;
  if (shorter.length <= 60) return shorter;

  // Just name + brand
  const minimal = `${name} | ${brand}`;
  if (minimal.length <= 60) return minimal;

  // Use name only (already within 60)
  if (name.length <= 60) return name;
  return name.substring(0, 57) + "...";
}

function createMetaDescription(
  name: string,
  brand: string,
  category: string,
  description: string
): string {
  const categoryLabels: Record<string, string> = {
    proteines: "protéine",
    creatine: "créatine",
    "pre-workout": "pre-workout",
    gainers: "gainer prise de masse",
    bruleurs: "brûleur de graisse",
    "acides-amines": "acides aminés",
    vitamines: "vitamines et minéraux",
    boosters: "booster hormonal",
    "barres-snacks": "snack protéiné",
    accessoires: "accessoire fitness",
  };

  const catLabel = categoryLabels[category] || "complément sportif";

  // Try using first sentence of description
  const firstSentence = description.split(/\.\s/)[0];
  if (firstSentence && firstSentence.length > 30 && firstSentence.length < 120) {
    const meta = `${firstSentence}. Livraison rapide en Tunisie.`;
    if (meta.length <= 160) return meta;
  }

  // Generate fresh
  const meta = `${name} de ${brand}. ${catLabel.charAt(0).toUpperCase() + catLabel.slice(1)} de qualité pour vos objectifs fitness. Livraison rapide partout en Tunisie.`;
  if (meta.length <= 160) return meta;

  return `${name} - ${catLabel} ${brand}. Livraison express Tunisie. Commandez sur Dodo Nutrition.`.substring(0, 160);
}

// ─── Featured Selection ─────────────────────────────────────────────────

// Featured = name+brand pairs for exact matching (max 8)
const FEATURED_PRODUCTS = new Set([
  "isolate pro - 2000g|gsn",
  "creatine monohydrate - 500g|real pharm",
  "behemoth pre-workout - 500g|real pharm",
  "real mass - 6.8kg|real pharm",
  "bcaa 2:1:1 perform c - 300g|impact nutrition",
  "mr x pre workout - 375g|v-shape supplements",
  "multi vitamins - 30 capsules|gsn",
  "lipo 6 black ultra concentrate - 60 capsules|nutrex",
]);

// ─── Main ───────────────────────────────────────────────────────────────

function main() {
  console.log("=== Fix Products CSV ===\n");

  // Read original CSV
  const csvPath = path.join(
    process.cwd(),
    "data/dodo_nutrition_120_produits_COMPLET.csv"
  );
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    relax_quotes: true,
  }) as OriginalRow[];

  console.log(`Loaded ${records.length} products from original CSV\n`);

  // Deduplicate: remove exact name+brand duplicates (keep first)
  const seenProducts = new Set<string>();
  const deduped = records.filter((row) => {
    const key = `${row.nom_produit?.trim().toLowerCase()}|${row.marque?.trim().toLowerCase()}`;
    if (seenProducts.has(key)) {
      console.log(`  DUPLICATE REMOVED: ${row.nom_produit} (${row.marque}), ID=${row.ID}`);
      return false;
    }
    seenProducts.add(key);
    return true;
  });

  console.log(`After dedup: ${deduped.length} products (removed ${records.length - deduped.length})\n`);

  // Track category distribution
  const catCounts: Record<string, number> = {};
  const errors: string[] = [];
  let featuredCount = 0;

  const cleanRows: CleanRow[] = deduped.map((row, idx) => {
    const name = row.nom_produit?.trim() || `Product-${idx + 1}`;
    const brand = row.marque?.trim() || "Unknown";
    const category = categorize(name, row.categorie_cms?.trim() || "");
    catCounts[category] = (catCounts[category] || 0) + 1;

    // Unit
    const unit = mapUnit(row.unite?.trim() || "", name);

    // Quantity
    let quantity = parseFloat(row.valeur) || 0;
    // Fix: if unit is kg and quantity looks like grams, convert
    if (unit === "kilogramme" && quantity > 100) {
      quantity = quantity / 1000;
    }

    // Description
    const description = createShortDescription(
      name,
      brand,
      row.description_longue_seo || "",
      category,
      row.benefices_cles || ""
    );

    // Benefits
    const benefits = cleanBenefits(row.benefices_cles || "", category);

    // Certifications
    const certifications = cleanCertifications(row.certifications || "");

    // Flavors
    const flavors = cleanFlavors(row.saveurs_disponibles || "");

    // Allergens
    const allergens = cleanAllergens(row.allergenes || "");

    // Dosage
    const dosage = cleanDosage(row.posologie_recommandee || "");

    // Prices (placeholder)
    const prices = generatePlaceholderPrices(name, category, quantity, unit);

    // Featured (match by name+brand)
    const featuredKey = `${name.toLowerCase()}|${brand.toLowerCase()}`;
    const isFeatured = FEATURED_PRODUCTS.has(featuredKey);
    if (isFeatured) featuredCount++;

    // SEO
    const metaTitle = createMetaTitle(name, brand);
    const metaDescription = createMetaDescription(name, brand, category, description);

    // Servings
    const servings = parseInt(row.servings) || 0;

    // Validation
    if (!name || name.length < 3) errors.push(`Row ${idx + 1}: empty/short name`);
    if (description.length < 20) errors.push(`Row ${idx + 1}: short description for "${name}"`);

    return {
      name,
      brand,
      category,
      description,
      unit,
      quantity: String(quantity),
      servings: servings > 0 ? String(servings) : "",
      flavors,
      benefits,
      allergens,
      certifications,
      dosage,
      priceRetail: String(prices.retail),
      pricePurchase: String(prices.purchase),
      priceWholesale: String(prices.wholesale),
      priceSlashed: "",
      stock: "100",
      featured: isFeatured ? "true" : "false",
      metaTitle,
      metaDescription,
    };
  });

  // ─── Output ────────────────────────────────────────────────────────────

  const output = stringify(cleanRows, {
    header: true,
    columns: [
      "name", "brand", "category", "description", "unit", "quantity",
      "servings", "flavors", "benefits", "allergens", "certifications",
      "dosage", "priceRetail", "pricePurchase", "priceWholesale",
      "priceSlashed", "stock", "featured", "metaTitle", "metaDescription",
    ],
  });

  const outputPath = path.join(process.cwd(), "data/products-final.csv");
  fs.writeFileSync(outputPath, output, "utf-8");

  // ─── Report ────────────────────────────────────────────────────────────

  console.log("=== Category Distribution ===");
  Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

  console.log(`\n=== Quality Checks ===`);
  console.log(`Total products: ${cleanRows.length}`);
  console.log(`Featured: ${featuredCount}`);
  console.log(`With benefits: ${cleanRows.filter((r) => r.benefits).length}`);
  console.log(`With certifications: ${cleanRows.filter((r) => r.certifications).length}`);
  console.log(`With flavors: ${cleanRows.filter((r) => r.flavors).length}`);
  console.log(`With prices: ${cleanRows.filter((r) => parseFloat(r.priceRetail) > 0).length}`);
  console.log(`Description > 300 chars: ${cleanRows.filter((r) => r.description.length > 300).length}`);
  console.log(`metaTitle > 60 chars: ${cleanRows.filter((r) => r.metaTitle.length > 60).length}`);
  console.log(`metaDescription > 160 chars: ${cleanRows.filter((r) => r.metaDescription.length > 160).length}`);

  if (errors.length > 0) {
    console.log(`\n=== Errors (${errors.length}) ===`);
    errors.forEach((e) => console.log(`  ${e}`));
  }

  console.log(`\nOutput: ${outputPath}`);
  console.log("Done!");
}

main();
