"use server";

import { isAdmin } from "@/lib/auth/admin";

/**
 * Returns the Sanity API token for authenticated admin users only.
 * This allows the admin dashboard to use App SDK hooks without
 * requiring a separate Sanity login.
 */
export async function getAdminSanityToken(): Promise<string | null> {
  const adminCheck = await isAdmin();

  if (!adminCheck) {
    return null;
  }

  return process.env.SANITY_API_WRITE_TOKEN ?? null;
}
