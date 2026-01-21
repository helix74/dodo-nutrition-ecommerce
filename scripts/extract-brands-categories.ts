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

async function extractBrandsAndCategories() {
  console.log('📊 Extracting brands and categories from CSV...\n');

  // Read CSV file
  const csvPath = path.join(process.cwd(), 'dodo_nutrition_120_produits_COMPLET_sanity.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  // Parse CSV
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CSVRow[];

  console.log(`✅ Loaded ${records.length} products from CSV\n`);

  // Extract unique brands
  const brandSet = new Set<string>();
  records.forEach(row => {
    if (row.marque && row.marque.trim()) {
      brandSet.add(row.marque.trim());
    }
  });

  const brands = Array.from(brandSet).sort();
  console.log(`🏷️  Found ${brands.length} unique brands:`);
  brands.forEach((brand, i) => console.log(`   ${i + 1}. ${brand}`));

  // For categories, we need to infer from product names
  // Common categories in supplements: Protéines, Créatine, Vitamines, Pre-Workout, etc.
  const categoryKeywords = [
    'Pre-Workout',
    'Creatine',
    'Protein',
    'Whey',
    'Isolat',
    'Vitamins',
    'Zinc',
    'Maca',
    'Testobooster',
    'L-Carnitine',
    'Fat Burner',
  ];

  const categorySet = new Set<string>();
  records.forEach(row => {
    const productName = row.nom_produit.toLowerCase();
    
    if (productName.includes('pre-workout') || productName.includes('viking') || productName.includes('behemoth')) {
      categorySet.add('Pre-Workout');
    } else if (productName.includes('creatine')) {
      categorySet.add('Créatine');
    } else if (productName.includes('whey') || productName.includes('isolat') || productName.includes('protein')) {
      categorySet.add('Protéines');
    } else if (productName.includes('vitamin')) {
      categorySet.add('Vitamines');
    } else if (productName.includes('zinc')) {
      categorySet.add('Minéraux');
    } else if (productName.includes('maca') || productName.includes('testo')) {
      categorySet.add('Boosters Hormonaux');
    } else if (productName.includes('carnitine') || productName.includes('burner') || productName.includes('cla')) {
      categorySet.add('Brûleurs de Graisse');
    } else {
      categorySet.add('Suppléments');
    }
  });

  const categories = Array.from(categorySet).sort();
  console.log(`\n📂 Found ${categories.length} categories:`);
  categories.forEach((cat, i) => console.log(`   ${i + 1}. ${cat}`));

  // Save to JSON files for reference
  const outputDir = path.join(process.cwd(), 'scripts', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, 'brands.json'),
    JSON.stringify(brands, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, 'categories.json'),
    JSON.stringify(categories, null, 2)
  );

  console.log('\n✅ Saved to scripts/output/brands.json and categories.json\n');

  return { brands, categories };
}

// Run if called directly
if (require.main === module) {
  extractBrandsAndCategories()
    .then(() => {
      console.log('✨ Extraction complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

export { extractBrandsAndCategories };
