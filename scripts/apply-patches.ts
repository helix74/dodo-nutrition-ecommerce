/**
 * apply-patches.ts
 *
 * Reads the NDJSON files and patches Sanity products via the write client.
 * Handles both storytelling (Portable Text content) and benefits/certifications/allergens/dosage.
 *
 * Run: npx tsx scripts/apply-patches.ts
 *
 * Requires: SANITY_API_WRITE_TOKEN in .env.local
 */

import fs from "fs";
import path from "path";
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

// Load environment from .env.local
dotenv.config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

interface StorytellingPatch {
  _id: string;
  content: unknown[];
}

interface BenefitsPatch {
  _id: string;
  benefits?: string[];
  certifications?: string[];
  allergens?: string[];
  dosage?: string;
}

function readNDJSON<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
  return lines.map((line) => JSON.parse(line) as T);
}

async function main() {
  console.log("=== Apply Patches to Sanity ===\n");
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}\n`);

  const projectRoot = process.cwd();
  const storytellingPath = path.join(
    projectRoot,
    "data/storytelling-import.ndjson",
  );
  const benefitsPath = path.join(
    projectRoot,
    "data/benefits-certifications-import.ndjson",
  );

  // --- Storytelling patches ---
  const storytellingPatches = readNDJSON<StorytellingPatch>(storytellingPath);
  console.log(`Storytelling patches to apply: ${storytellingPatches.length}`);

  let stSuccess = 0;
  let stFail = 0;

  for (const patch of storytellingPatches) {
    try {
      await client.patch(patch._id).set({ content: patch.content }).commit();
      stSuccess++;
      if (stSuccess % 10 === 0) {
        process.stdout.write(
          `  Storytelling: ${stSuccess}/${storytellingPatches.length}\r`,
        );
      }
    } catch (err: unknown) {
      stFail++;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ Failed ${patch._id}: ${message}`);
    }
  }
  console.log(`\n✅ Storytelling: ${stSuccess} applied, ${stFail} failed\n`);

  // --- Benefits/Certifications patches ---
  const benefitsPatches = readNDJSON<BenefitsPatch>(benefitsPath);
  console.log(`Benefits/Certs patches to apply: ${benefitsPatches.length}`);

  let bSuccess = 0;
  let bFail = 0;

  for (const patch of benefitsPatches) {
    try {
      const updates: Record<string, unknown> = {};

      if (patch.benefits) {
        updates.benefits = patch.benefits;
      }
      if (patch.certifications) {
        updates.certifications = patch.certifications;
      }
      if (patch.allergens) {
        // allergens is a text field in the schema, join array into string
        updates.allergens = Array.isArray(patch.allergens)
          ? patch.allergens.join(", ")
          : patch.allergens;
      }
      if (patch.dosage) {
        updates.dosage = patch.dosage;
      }

      if (Object.keys(updates).length > 0) {
        await client.patch(patch._id).set(updates).commit();
        bSuccess++;
        if (bSuccess % 10 === 0) {
          process.stdout.write(
            `  Benefits: ${bSuccess}/${benefitsPatches.length}\r`,
          );
        }
      }
    } catch (err: unknown) {
      bFail++;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ Failed ${patch._id}: ${message}`);
    }
  }
  console.log(`\n✅ Benefits/Certs: ${bSuccess} applied, ${bFail} failed\n`);
  console.log("Done! All patches applied.");
}

main();
