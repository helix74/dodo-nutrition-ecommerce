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

async function testImport() {
  console.log('📤 Testing brand import...\n');

  //Read first brand
  const ndjsonPath = path.join(process.cwd(), 'scripts/output/dodo-nutrition.ndjson');
  const firstLine = fs.readFileSync(ndjsonPath, 'utf-8').split('\n')[0];
  const brand = JSON.parse(firstLine);
  
  console.log('Brand document:', JSON.stringify(brand, null, 2));
 
  try {
    const result = await client.create(brand);
    console.log('\n✅ Success!', result);
  } catch (error: any) {
    console.error('\n❌ Error creating brand:');
    console.error(' Message:', error.message);
    if (error.response) {
      console.error(' Response:', JSON.stringify(error.response, null, 2));
    }
    if (error.details) {
      console.error(' Details:', JSON.stringify(error.details, null, 2));
    }
  }
}

testImport();
