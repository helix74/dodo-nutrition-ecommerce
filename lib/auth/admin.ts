"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * List of admin email addresses
 * In production, this should come from environment variables
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean);

/**
 * Check if the current user is an admin
 * @returns true if admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth();
  
  if (!userId) return false;
  
  const user = await currentUser();
  if (!user?.emailAddresses?.[0]?.emailAddress) return false;
  
  const email = user.emailAddresses[0].emailAddress;
  return ADMIN_EMAILS.includes(email);
}

/**
 * Require admin authentication
 * Throws an error if not authenticated or not an admin
 */
export async function requireAdmin(): Promise<void> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Authentification requise");
  }
  
  const user = await currentUser();
  if (!user?.emailAddresses?.[0]?.emailAddress) {
    throw new Error("Email non trouvé");
  }
  
  const email = user.emailAddresses[0].emailAddress;
  
  if (!ADMIN_EMAILS.includes(email)) {
    throw new Error("Accès administrateur requis");
  }
}

/**
 * Get admin status without throwing
 * Returns object with isAdmin flag and user info
 */
export async function getAdminStatus() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { isAuthenticated: false, isAdmin: false, email: null };
    }
    
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress || null;
    
    return {
      isAuthenticated: true,
      isAdmin: email ? ADMIN_EMAILS.includes(email) : false,
      email,
    };
  } catch {
    return { isAuthenticated: false, isAdmin: false, email: null };
  }
}
