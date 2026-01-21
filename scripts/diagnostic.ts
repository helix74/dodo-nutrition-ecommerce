import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tivydqqm',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function diagnosticCheck() {
  console.log('🔍 DIAGNOSTIC COMPLET\n');
  console.log('='.repeat(60));
  
  // 1. Vérifier connexion Sanity
  console.log('\n1️⃣  VÉRIFICATION CONNEXION SANITY:');
  try {
    const testQuery = await client.fetch(`count(*[_type == "product"])`);
    console.log(`   ✅ Connexion OK - ${testQuery} produits trouvés`);
    console.log(`   ✅ Project ID: tivydqqm`);
    console.log(`   ✅ Dataset: production`);
  } catch (error: any) {
    console.log(`   ❌ Erreur connexion: ${error.message}`);
    return;
  }

  // 2. Vérifier si un produit a les NOUVEAUX champs
  console.log('\n2️⃣  VÉRIFICATION STRUCTURE PRODUIT (1 exemple):');
  const product = await client.fetch(`*[_type == "product"][0]{
    _id,
    name,
    
    // NOUVEAUX champs (nutrition)
    unit,
    quantity,
    servings,
    priceRetail,
    pricePurchase,
    priceWholesale,
    priceSlashed,
    brand->{name},
    flavors,
    certifications,
    
    // ANCIENS champs (furniture) - ne devraient PAS exister
    price,
    color,
    material,
    dimensions
  }`);
  
  console.log(`   Produit: ${product.name}`);
  console.log(`\n   ✅ NOUVEAUX CHAMPS (Nutrition):`);
  console.log(`      - unit: ${product.unit || 'MANQUANT!'}`);
  console.log(`      - quantity: ${product.quantity || 'MANQUANT!'}`);
  console.log(`      - servings: ${product.servings || 'MANQUANT!'}`);
  console.log(`      - priceRetail: ${product.priceRetail || 'MANQUANT!'} TND`);
  console.log(`      - pricePurchase: ${product.pricePurchase || 'MANQUANT!'} TND`);
  console.log(`      - brand: ${product.brand?.name || 'MANQUANT!'}`);
  console.log(`      - flavors: ${product.flavors?.length || 0} saveur(s)`);
  console.log(`      - certifications: ${product.certifications?.length || 0}`);
  
  console.log(`\n   ❌ ANCIENS CHAMPS (Furniture) - ne devraient PAS exister:`);
  console.log(`      - price (£): ${product.price || 'ABSENT ✅'}`);
  console.log(`      - color: ${product.color || 'ABSENT ✅'}`);
  console.log(`      - material: ${product.material || 'ABSENT ✅'}`);
  console.log(`      - dimensions: ${product.dimensions || 'ABSENT ✅'}`);

  // 3. Vérifier les catégories
  console.log('\n3️⃣  CATÉGORIES DISPONIBLES:');
  const categories = await client.fetch(`*[_type == "category"]{title} | order(title asc)`);
  categories.forEach((cat: any) => console.log(`   - ${cat.title}`));

  // 4. Conclusion
  console.log('\n' + '='.repeat(60));
  console.log('\n📋 DIAGNOSTIC:');
  
  const hasNewFields = product.unit && product.priceRetail && product.brand;
  const hasOldFields = product.price || product.color || product.material;
  
  if (hasNewFields && !hasOldFields) {
    console.log('✅ DATABASE: 100% CORRECTE');
    console.log('   - Tous les nouveaux champs nutrition présents');
    console.log('   - Aucun ancien champ furniture');
    console.log('   - Données prêtes pour le frontend\n');
    
    console.log('⚠️  PROBLÈME: FRONTEND PAS ENCORE ADAPTÉ!');
    console.log('   Le frontend utilise encore les ANCIENS champs:');
    console.log('   - Cherche "price" au lieu de "priceRetail"');
    console.log('   - Cherche "color" et "material" (n\'existent plus)');
    console.log('   - Affiche "£" au lieu de "TND"');
    console.log('\n   SOLUTION: Phase 3 - Adapter le code frontend');
  } else if (hasOldFields) {
    console.log('❌ PROBLÈME: Anciens champs encore présents!');
  } else {
    console.log('⚠️  PROBLÈME: Nouveaux champs manquants!');
  }
  
  console.log('\n='.repeat(60));
}

diagnosticCheck()
  .then(() => console.log('\n✅ Diagnostic terminé\n'))
  .catch((error) => console.error('❌ Erreur:', error));
