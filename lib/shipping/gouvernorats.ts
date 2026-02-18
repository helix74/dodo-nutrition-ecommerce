import { GOUVERNORATS, type Gouvernorat } from "@/lib/constants/gouvernorats";
import { listVilles, type CiblexVille } from "./ciblex";

/**
 * Mapping of gouvernorats to their villes (cities).
 * Falls back to gouvernorat name as the sole ville when Ciblex data isn't available.
 */
export type GouvernoratVillesMap = Record<string, string[]>;

let cachedVilles: GouvernoratVillesMap | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

/**
 * Fetch the gouvernorat->villes mapping from Ciblex and cache it.
 * Returns a static fallback if the API call fails.
 */
export async function getGouvernoratVilles(): Promise<GouvernoratVillesMap> {
  if (cachedVilles && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedVilles;
  }

  try {
    const res = await listVilles();

    if (res.result_type === "success" && Array.isArray(res.result_content)) {
      const map: GouvernoratVillesMap = {};
      for (const entry of res.result_content as CiblexVille[]) {
        if (!map[entry.gouvernorat]) {
          map[entry.gouvernorat] = [];
        }
        if (!map[entry.gouvernorat].includes(entry.ville)) {
          map[entry.gouvernorat].push(entry.ville);
        }
      }
      cachedVilles = map;
      cacheTimestamp = Date.now();
      return map;
    }
  } catch (err) {
    console.error("Failed to fetch Ciblex villes, using fallback:", err);
  }

  return getFallbackVilles();
}

/**
 * Static fallback: each gouvernorat maps to itself as a single ville.
 */
function getFallbackVilles(): GouvernoratVillesMap {
  const map: GouvernoratVillesMap = {};
  for (const g of GOUVERNORATS) {
    map[g] = [g];
  }
  return map;
}

/**
 * Get list of villes for a specific gouvernorat.
 */
export async function getVillesForGouvernorat(
  gouvernorat: Gouvernorat | string,
): Promise<string[]> {
  const all = await getGouvernoratVilles();
  return all[gouvernorat] ?? [gouvernorat];
}
