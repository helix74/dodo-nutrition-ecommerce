import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tivydqqm',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function comprehensiveVerification() {
  console.log('🔍 COMPREHENSIVE VERIFICATION\n');
  console.log('='.repeat(60));
  
  try {
    // 1. Count all document types
    console.log('\n📊 DOCUMENT COUNTS:');
    const brands = await client.fetch(`count(*[_type == "brand"])`);
    const categories = await client.fetch(`count(*[_type == "category"])`);
    const products = await client.fetch(`count(*[_type == "product"])`);
    const orders = await client.fetch(`count(*[_type == "order"])`);
    const customers = await client.fetch(`count(*[_type == "customer"])`);
    
    console.log(`  ✅ Brands: ${brands}`);
    console.log(`  ✅ Categories: ${categories}`);
    console.log(`  ✅ Products: ${products}`);
    console.log(`  ℹ️  Orders: ${orders} (will be cleaned)`);
    console.log(`  ℹ️  Customers: ${customers} (will be cleaned)`);

    // 2. List all actual categories
    console.log('\n📂 CATEGORIES:');
    const categoryList = await client.fetch(`*[_type == "category"]{title}`);
    categoryList.forEach((cat: any) => console.log(`  - ${cat.title}`));

    // 3. Check for OLD furniture attributes in products
    console.log('\n⚠️  CHECKING FOR OLD FURNITURE ATTRIBUTES:');
    const productsWithColor = await client.fetch(`count(*[_type == "product" && defined(color)])`);
    const productsWithMaterial = await client.fetch(`count(*[_type == "product" && defined(material)])`);
    const productsWithDimensions = await client.fetch(`count(*[_type == "product" && defined(dimensions)])`);
    const productsWithAssembly = await client.fetch(`count(*[_type == "product" && defined(assemblyRequired)])`);
    const productsWithOldPrice = await client.fetch(`count(*[_type == "product" && defined(price) && !defined(priceRetail)])`);
    
    console.log(`  ${productsWithColor > 0 ? '❌' : '✅'} Products with 'color': ${productsWithColor}`);
    console.log(`  ${productsWithMaterial > 0 ? '❌' : '✅'} Products with 'material': ${productsWithMaterial}`);
    console.log(`  ${productsWithDimensions > 0 ? '❌' : '✅'} Products with 'dimensions': ${productsWithDimensions}`);
    console.log(`  ${productsWithAssembly > 0 ? '❌' : '✅'} Products with 'assemblyRequired': ${productsWithAssembly}`);
    console.log(`  ${productsWithOldPrice > 0 ? '❌' : '✅'} Products with old 'price' field: ${productsWithOldPrice}`);

    // 4. Check for NEW nutrition attributes
    console.log('\n✅ CHECKING FOR NEW NUTRITION ATTRIBUTES:');
    const productsWithUnit = await client.fetch(`count(*[_type == "product" && defined(unit)])`);
    const productsWithQuantity = await client.fetch(`count(*[_type == "product" && defined(quantity)])`);
    const productsWithBrand = await client.fetch(`count(*[_type == "product" && defined(brand)])`);
    const productsWithPriceRetail = await client.fetch(`count(*[_type == "product" && defined(priceRetail)])`);
    const productsWithServings = await client.fetch(`count(*[_type == "product" && defined(servings)])`);
    const productsWithFlavors = await client.fetch(`count(*[_type == "product" && defined(flavors)])`);
    const productsWithCertifications = await client.fetch(`count(*[_type == "product" && defined(certifications)])`);
    
    console.log(`  ✅ Products with 'unit': ${productsWithUnit}/${products}`);
    console.log(`  ✅ Products with 'quantity': ${productsWithQuantity}/${products}`);
    console.log(`  ✅ Products with 'brand': ${productsWithBrand}/${products}`);
    console.log(`  ✅ Products with 'priceRetail': ${productsWithPriceRetail}/${products}`);
    console.log(`  ✅ Products with 'servings': ${productsWithServings}/${products}`);
    console.log(`  ✅ Products with 'flavors': ${productsWithFlavors}/${products}`);
    console.log(`  ✅ Products with 'certifications': ${productsWithCertifications}/${products}`);

    // 5. Sample 3 random products
    console.log('\n📦 SAMPLE PRODUCTS:');
    const sampleProducts = await client.fetch(`
      *[_type == "product"][0...3]{
        name,
        brand->{name},
        category->{title},
        unit,
        quantity,
        servings,
        priceRetail,
        pricePurchase,
        flavors,
        certifications,
        // Check for old attrs
        color,
        material,
        dimensions
      }
    `);
    
    sampleProducts.forEach((p: any, i: number) => {
      console.log(`\n  ${i + 1}. ${p.name}`);
      console.log(`     Brand: ${p.brand?.name || 'N/A'}`);
      console.log(`     Category: ${p.category?.title || 'N/A'}`);
      console.log(`     Unit/Qty: ${p.quantity}${p.unit}`);
      console.log(`     Servings: ${p.servings || 'N/A'}`);
      console.log(`     Price: ${p.priceRetail} TND (Purchase: ${p.pricePurchase} TND)`);
      console.log(`     Flavors: ${p.flavors?.length || 0} flavor(s)`);
      console.log(`     Certifications: ${p.certifications?.length || 0}`);
      
      // Alert if old attrs exist
      if (p.color || p.material || p.dimensions) {
        console.log(`     ⚠️  HAS OLD ATTRIBUTES! color:${p.color}, material:${p.material}, dimensions:${p.dimensions}`);
      }
    });

    // 6. Check all brands are valid
    console.log('\n🏷️  BRANDS LIST:');
    const brandList = await client.fetch(`*[_type == "brand"]{name} | order(name asc)`);
    brandList.forEach((b: any) => console.log(`  - ${b.name}`));

    // 7. Summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 VERIFICATION SUMMARY:\n');
    
    const oldAttrsExist = productsWithColor > 0 || productsWithMaterial > 0 || 
                         productsWithDimensions > 0 || productsWithAssembly > 0;
    
    const allNewAttrsPresent = productsWithUnit === products && 
                               productsWithBrand === products && 
                               productsWithPriceRetail === products;

    if (!oldAttrsExist && allNewAttrsPresent) {
      console.log('✅ TRANSFORMATION: 100% SUCCESSFUL');
      console.log('✅ All products are nutrition products');
      console.log('✅ No old furniture attributes found');
      console.log('✅ All new nutrition attributes present');
    } else {
      console.log('⚠️  ISSUES DETECTED:');
      if (oldAttrsExist) console.log('   - Old furniture attributes still exist');
      if (!allNewAttrsPresent) console.log('   - Some nutrition attributes missing');
    }

    console.log('\n🗑️  OLD DATA TO CLEAN:');
    console.log(`   - ${orders} orders (furniture orders)`);
    console.log(`   - ${customers} customers (if any)`);
    
    return {
      oldAttrsExist,
      allNewAttrsPresent,
      needsCleanup: orders > 0 || customers > 0
    };
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

comprehensiveVerification()
  .then((result) => {
    console.log('\n✨ Verification complete!\n');
    process.exit(result.oldAttrsExist ? 1 : 0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
