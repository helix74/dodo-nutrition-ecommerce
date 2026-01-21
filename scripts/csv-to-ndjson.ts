import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface CSVRow {
  ID: string;
  nom_produit: string;
  unite: string;
  valeur: string;
  servings: string;
  marque: string;
  description_longue_seo: string;
  meta_title: string;
  meta_keywords: string;
  meta_description: string;
  saveurs_disponibles: string;
  benefices_cles: string;
  allergenes: string;
  certifications: string;
  posologie_recommandee: string;
  prix_detail: string;
  prix_achat: string;
  prix_gros: string;
  prix_barre: string;
}

// Helper to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper to clean HTML tags
function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper to parse arrays from CSV (comma-separated or newline-separated)
function parseArrayField(field: string): string[] {
  if (!field) return [];
  
  // Split by commas or newlines
  const items = field.split(/[,\n]/).map(item => item.trim()).filter(Boolean);
  return items;
}

// Map unit from CSV to schema
function mapUnit(csvUnit: string): string {
  const unitMap: Record<string, string> = {
    'Gramme': 'gramme',
    'Kilogramme': 'kilogramme',
    'Millilitre': 'millilitre',
    'Gélule': 'gélule',
    'Capsule': 'capsule',
    'Comprimé': 'comprimé',
  };
  
  return unitMap[csvUnit] || 'gramme';
}

// Determine category from product name
function inferCategory(productName: string): string {
  const name = productName.toLowerCase();
  
  if (name.includes('pre-workout') || name.includes('viking') || name.includes('behemoth')) {
    return 'Pre-Workout';
  } else if (name.includes('creatine')) {
    return 'Créatine';
  } else if (name.includes('whey') || name.includes('isolat') || name.includes('protein')) {
    return 'Protéines';
  } else if (name.includes('vitamin')) {
    return 'Vitamines';
  } else if (name.includes('zinc')) {
    return 'Minéraux';
  } else if (name.includes('maca') || name.includes('testo')) {
    return 'Boosters Hormonaux';
  } else if (name.includes('carnitine') || name.includes('burner') || name.includes('cla')) {
    return 'Brûleurs de Graisse';
  } else {
    return 'Suppléments';
  }
}

async function generateNDJSON() {
  console.log('🔄 Starting CSV to NDJSON transformation...\n');

  // Read CSV
  const csvPath = path.join(process.cwd(), 'dodo_nutrition_120_produits_COMPLET_sanity.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CSVRow[];

  console.log(`✅ Loaded ${records.length} products\n`);

  // Load brands and categories
  const brands = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'scripts/output/brands.json'), 'utf-8')
  ) as string[];
  
  const categories = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'scripts/output/categories.json'), 'utf-8')
  ) as string[];

  const outputLines: string[] = [];

  // 1. Create Brand documents
  console.log('📝 Generating brands...');
  brands.forEach((brandName) => {
    const brandDoc = {
      _type: 'brand',
      _id: `brand-${createSlug(brandName)}`,
      name: brandName,
      slug: {
        _type: 'slug',
        current: createSlug(brandName),
      },
    };
    outputLines.push(JSON.stringify(brandDoc));
  });
  console.log(`   ✅ Created ${brands.length} brands\n`);

  // 2. Create Category documents
  console.log('📝 Generating categories...');
  categories.forEach((categoryName) => {
    const categoryDoc = {
      _type: 'category',
      _id: `category-${createSlug(categoryName)}`,
      title: categoryName,
      slug: {
        _type: 'slug',
        current: createSlug(categoryName),
      },
    };
    outputLines.push(JSON.stringify(categoryDoc));
  });
  console.log(`   ✅ Created ${categories.length} categories\n`);

  // 3. Create Product documents
  console.log('📝 Generating products...');
  let successCount = 0;
  let errorCount = 0;

  records.forEach((row, index) => {
    try {
      const category = inferCategory(row.nom_produit);
      const brandSlug = createSlug(row.marque);
      const categorySlug = createSlug(category);
      const productSlug = createSlug(row.nom_produit);

// Generate realistic random prices based on product type
function generatePrices(productName: string, category: string) {
  const name = productName.toLowerCase();
  
  let basePrice = 50; // Default TND
  
  // Adjust base price by category
  if (category === 'Protéines') {
    basePrice = name.includes('isolat') || name.includes('isolate') ? 180 : 120;
  } else if (category === 'Pre-Workout') {
    basePrice = 80;
  } else if (category === 'Créatine') {
    basePrice = 60;
  } else if (category === 'Vitamines' || category === 'Minéraux') {
    basePrice = 35;
  } else if (category === 'Brûleurs de Graisse') {
    basePrice = 90;
  } else if (category === 'Boosters Hormonaux') {
    basePrice = 70;
  } else if (name.includes('mass') || name.includes('gainer')) {
    basePrice = 150;
  }
  
  // Add variation ±20%
  const variation = basePrice * 0.2;
  const priceRetail = Math.round(basePrice + (Math.random() * variation * 2 - variation));
  
  return {
    priceRetail,
    pricePurchase: Math.round(priceRetail * 0.6), // 60% of retail
    priceWholesale: Math.round(priceRetail * 0.8), // 80% of retail
    priceSlashed: Math.round(priceRetail * 1.2), // 120% for "sale" effect
  };
}

      // Parse prices (handle empty strings)
      const parsePrice = (price: string): number | undefined => {
        const parsed = parseFloat(price);
        return isNaN(parsed) ? undefined : parsed;
      };

      // Generate prices if CSV is empty
      const prices = generatePrices(row.nom_produit, category);

      const productDoc: any = {
        _type: 'product',
        _id: `product-${index + 1}`, // Use index as ID since CSV ID is empty
        name: row.nom_produit,
        slug: {
          _type: 'slug',
          current: productSlug,
        },
        brand: {
          _type: 'reference',
          _ref: `brand-${brandSlug}`,
        },
        category: {
          _type: 'reference',
          _ref: `category-${categorySlug}`,
        },
        
        // Descriptions
        description: stripHtml(row.description_longue_seo).substring(0, 500),
        longDescription: stripHtml(row.description_longue_seo),
        
        // Nutrition fields
        unit: mapUnit(row.unite),
        quantity: parseFloat(row.valeur) || 0,
        servings: parseInt(row.servings) || undefined,
        flavors: parseArrayField(row.saveurs_disponibles),
        benefits: parseArrayField(row.benefices_cles),
        allergens: row.allergenes || undefined,
        certifications: parseArrayField(row.certifications),
        dosage: row.posologie_recommandee || undefined,
        
        // Pricing - use CSV if available, otherwise use generated prices
        priceRetail: parsePrice(row.prix_detail) || prices.priceRetail,
        pricePurchase: parsePrice(row.prix_achat) || prices.pricePurchase,
        priceWholesale: parsePrice(row.prix_gros) || prices.priceWholesale,
        priceSlashed: parsePrice(row.prix_barre) || prices.priceSlashed,
        
        // SEO
        metaTitle: row.meta_title || undefined,
        metaKeywords: row.meta_keywords || undefined,
        metaDescription: row.meta_description || undefined,
        
        // Inventory
        stock: 100, // Default stock
        featured: false,
      };

      // Clean undefined values
      Object.keys(productDoc).forEach(key => {
        if (productDoc[key] === undefined) {
          delete productDoc[key];
        }
      });

      outputLines.push(JSON.stringify(productDoc));
      successCount++;

      if ((index + 1) % 20 === 0) {
        console.log(`   Processed ${index + 1}/${records.length} products...`);
      }
    } catch (error) {
      console.error(`   ❌ Error processing product ${row.ID}: ${error}`);
      errorCount++;
    }
  });

  console.log(`   ✅ Created ${successCount} products (${errorCount} errors)\n`);

  // 4. Write NDJSON file
  const outputPath = path.join(process.cwd(), 'scripts/output/dodo-nutrition.ndjson');
  fs.writeFileSync(outputPath, outputLines.join('\n'));

  console.log(`\n✨ Success! Generated NDJSON file:`);
  console.log(`   📄 ${outputPath}`);
  console.log(`   📊 Total documents: ${outputLines.length}`);
  console.log(`      - ${brands.length} brands`);
  console.log(`      - ${categories.length} categories`);
  console.log(`      - ${successCount} products\n`);

  return outputPath;
}

// Run if called directly
if (require.main === module) {
  generateNDJSON()
    .then(() => {
      console.log('🎉 Transformation complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

export { generateNDJSON };
