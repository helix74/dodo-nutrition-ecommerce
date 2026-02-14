"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.SANITY_API_WRITE_TOKEN || "fallback-secret-change-me"
);

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

/**
 * Verify admin credentials and create a session
 */
export async function adminLogin(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (!ADMIN_PASSWORD) {
    return { success: false, error: "Admin password not configured" };
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { success: false, error: "Invalid credentials" };
  }

  // Create JWT token
  const token = await new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_DURATION}s`)
    .setIssuedAt()
    .sign(JWT_SECRET);

  // Set HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });

  return { success: true };
}

/**
 * Check if the current request has a valid admin session
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) return false;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Logout admin session 
 */
export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
