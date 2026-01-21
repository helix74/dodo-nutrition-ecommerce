import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tivydqqm',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function importToSanity() {
  console.log('📤 Importing data to Sanity...\n');

  // Read NDJSON file
  const ndjsonPath = path.join(process.cwd(), 'scripts/output/dodo-nutrition.ndjson');
  const ndjsonContent = fs.readFileSync(ndjsonPath, 'utf-8');
  const lines = ndjsonContent.split('\n').filter(Boolean);
  
  console.log(`📄 Found ${lines.length} documents to import\n`);

  // Parse documents
  const documents = lines.map(line => JSON.parse(line));

  // Group by type
  const brands = documents.filter(doc => doc._type === 'brand');
  const categories = documents.filter(doc => doc._type === 'category');
  const products = documents.filter(doc => doc._type === 'product');

  console.log(`   - ${brands.length} brands`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${products.length} products\n`);

  // Import in order: brands, categories, products
  try {
    console.log('1️⃣  Importing brands...');
    const brandTransaction = client.transaction();
    brands.forEach(brand => {
      brandTransaction.createOrReplace(brand);
    });
    await brandTransaction.commit();
    console.log(`   ✅ Imported ${brands.length} brands\n`);

    console.log('2️⃣  Importing categories...');
    const categoryTransaction = client.transaction();
    categories.forEach(category => {
      categoryTransaction.createOrReplace(category);
    });
    await categoryTransaction.commit();
    console.log(`   ✅ Imported ${categories.length} categories\n`);

    console.log('3️⃣  Importing products...');
    // Import products in batches of 20
    const batchSize = 20;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const productTransaction = client.transaction();
      batch.forEach(product => {
        productTransaction.createOrReplace(product);
      });
      await productTransaction.commit();
      console.log(`   Imported ${Math.min(i + batchSize, products.length)}/${products.length} products...`);
    }
    console.log(`   ✅ Imported ${products.length} products\n`);

    console.log('✨ Import complete!\n');
    console.log('🎉 All data successfully imported to Sanity!');
    console.log('\n👉 Check your data at: http://localhost:3000/studio\n');

  } catch (error:any) {
    console.error('❌ Import error:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2));
    }
    if (error.details) {
      console.error('Details:', JSON.stringify(error.details, null, 2));
    }
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  importToSanity()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { importToSanity };
