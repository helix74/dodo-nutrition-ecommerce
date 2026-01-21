import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tivydqqm',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function verifyImport() {
  console.log('🔍 Verification of imported data...\n');

  try {
    // Count brands
    const brandsCount = await client.fetch(`count(*[_type == "brand"])`);
    console.log(`✅ Brands: ${brandsCount}`);

    // Count categories
    const categoriesCount = await client.fetch(`count(*[_type == "category"])`);
    console.log(`✅ Categories: ${categoriesCount}`);

    // Count products
    const productsCount = await client.fetch(`count(*[_type == "product"])`);
    console.log(`✅ Products: ${productsCount}\n`);

    // Sample brand
    const sampleBrand = await client.fetch(`*[_type == "brand"][0]`);
    console.log('📦 Sample Brand:');
    console.log(JSON.stringify(sampleBrand, null, 2));
    console.log();

    // Sample product
    const sampleProduct = await client.fetch(`*[_type == "product"][0]{
      _id,
      name,
      slug,
      brand->{name},
      category->{title},
      unit,
      quantity,
      servings,
      priceRetail,
      flavors,
      certifications
    }`);
    console.log('📦 Sample Product:');
    console.log(JSON.stringify(sampleProduct, null, 2));
    console.log();

    // Check for missing images
    const productsWithoutImages = await client.fetch(
      `count(*[_type == "product" && !defined(images)])`
    );
    console.log(`⚠️  Products without images: ${productsWithoutImages}`);

    // Check for missing prices
    const productsWithoutPrice = await client.fetch(
      `count(*[_type == "product" && !defined(priceRetail)])`
    );
    console.log(`⚠️  Products without retail price: ${productsWithoutPrice}`);

    console.log('\n✨ Verification complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyImport();
