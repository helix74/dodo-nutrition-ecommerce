import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const isClerkProtectedRoute = createRouteMatcher([
  "/orders(.*)",
  "/account(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminLoginRoute = createRouteMatcher(["/admin/login"]);

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.SANITY_API_WRITE_TOKEN || "fallback-secret-change-me"
);

async function isAdminSessionValid(req: NextRequest): Promise<boolean> {
  try {
    const token = req.cookies.get("admin_session")?.value;
    if (!token) return false;
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export default clerkMiddleware(async (auth, req) => {
  // Admin routes: use custom auth (not Clerk)
  if (isAdminRoute(req) && !isAdminLoginRoute(req)) {
    const isValid = await isAdminSessionValid(req);
    if (!isValid) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // Other protected routes: use Clerk
  if (isClerkProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
