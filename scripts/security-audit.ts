/**
 * Security Audit Script for Dodo Nutrition
 *
 * Checks:
 * 1. API route authentication coverage
 * 2. Environment variable exposure
 * 3. Input validation via Zod schemas
 *
 * Run: npx tsx scripts/security-audit.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const PASS = "\x1b[32m✓\x1b[0m";
const FAIL = "\x1b[31m✗\x1b[0m";
const WARN = "\x1b[33m⚠\x1b[0m";

let exitCode = 0;

function heading(title: string) {
  console.log(`\n\x1b[1m═══ ${title} ═══\x1b[0m`);
}

function pass(msg: string) {
  console.log(`  ${PASS} ${msg}`);
}

function fail(msg: string) {
  console.log(`  ${FAIL} ${msg}`);
  exitCode = 1;
}

function warn(msg: string) {
  console.log(`  ${WARN} ${msg}`);
}

// ---------------------------------------------------------------------------
// 1. API Route Authentication Audit
// ---------------------------------------------------------------------------
heading("API Route Authentication");

interface RouteCheck {
  route: string;
  file: string;
  requiresAuth: boolean;
  hasAuth: boolean;
  hasRateLimit: boolean;
  hasInputValidation: boolean;
}

const apiDir = path.join(ROOT, "app", "api");

function findRouteFiles(dir: string, prefix = "/api"): { file: string; route: string }[] {
  const results: { file: string; route: string }[] = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findRouteFiles(fullPath, `${prefix}/${entry.name}`));
    } else if (entry.name === "route.ts" || entry.name === "route.js") {
      results.push({ file: fullPath, route: prefix });
    }
  }
  return results;
}

const routeFiles = findRouteFiles(apiDir);
const routeChecks: RouteCheck[] = [];

for (const { file, route } of routeFiles) {
  const content = fs.readFileSync(file, "utf-8");
  const isAdminRoute = route.includes("/admin");

  const hasAuth =
    content.includes("isAdminAuthenticated") ||
    content.includes("requireAdmin") ||
    content.includes("auth(") ||
    content.includes("adminLogin");

  const hasRateLimit = content.includes("rateLimit");
  const hasInputValidation =
    content.includes("safeParse") ||
    content.includes("parse(") ||
    content.includes("z.object") ||
    content.includes("Schema");

  routeChecks.push({
    route,
    file: path.relative(ROOT, file),
    requiresAuth: isAdminRoute,
    hasAuth,
    hasRateLimit,
    hasInputValidation,
  });
}

for (const check of routeChecks) {
  const authStatus = check.requiresAuth
    ? check.hasAuth
      ? PASS
      : FAIL
    : check.hasAuth
      ? PASS
      : WARN;

  const label = check.requiresAuth ? "(admin — auth required)" : "(public)";
  console.log(`  ${authStatus} ${check.route} ${label}`);

  if (check.requiresAuth && !check.hasAuth) {
    fail(`    Missing authentication in ${check.file}`);
  }
  if (check.hasRateLimit) {
    pass(`    Rate limiting enabled`);
  }
  if (check.hasInputValidation) {
    pass(`    Input validation present`);
  }
}

// ---------------------------------------------------------------------------
// 2. Environment Variable Exposure Check
// ---------------------------------------------------------------------------
heading("Environment Variable Exposure");

const envExample = path.join(ROOT, ".env.example");
if (fs.existsSync(envExample)) {
  const envContent = fs.readFileSync(envExample, "utf-8");
  const envVars = envContent
    .split("\n")
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => line.split("=")[0].trim());

  const secretVars = envVars.filter(
    (v) => !v.startsWith("NEXT_PUBLIC_") && v.length > 0
  );
  const publicVars = envVars.filter(
    (v) => v.startsWith("NEXT_PUBLIC_") && v.length > 0
  );

  pass(`${publicVars.length} public vars (NEXT_PUBLIC_*): ${publicVars.join(", ")}`);
  pass(`${secretVars.length} server-only vars detected`);

  const clientFiles = [
    ...findTsFiles(path.join(ROOT, "components")),
    ...findTsFiles(path.join(ROOT, "lib", "store")),
  ];

  let leakedSecrets = 0;
  for (const file of clientFiles) {
    const content = fs.readFileSync(file, "utf-8");
    if (!content.includes('"use client"') && !content.includes("'use client'")) continue;

    for (const secret of secretVars) {
      if (content.includes(`process.env.${secret}`)) {
        fail(`Server-only var ${secret} referenced in client file: ${path.relative(ROOT, file)}`);
        leakedSecrets++;
      }
    }
  }

  if (leakedSecrets === 0) {
    pass("No server-only environment variables leaked to client components");
  }
} else {
  warn(".env.example not found — skipping env var check");
}

// ---------------------------------------------------------------------------
// 3. Input Validation Check
// ---------------------------------------------------------------------------
heading("Input Validation (Zod Schemas)");

const schemasFile = path.join(ROOT, "lib", "validations", "schemas.ts");
if (fs.existsSync(schemasFile)) {
  const content = fs.readFileSync(schemasFile, "utf-8");
  const schemas = content.match(/export const \w+Schema/g) || [];
  pass(`${schemas.length} Zod schemas defined:`);
  for (const schema of schemas) {
    const name = schema.replace("export const ", "");
    pass(`  ${name}`);
  }
} else {
  warn("No validation schemas file found at lib/validations/schemas.ts");
}

const checkoutFile = path.join(ROOT, "lib", "actions", "checkout.ts");
if (fs.existsSync(checkoutFile)) {
  const content = fs.readFileSync(checkoutFile, "utf-8");
  if (content.includes("safeParse") || content.includes("CODOrderSchema")) {
    pass("Checkout action uses Zod validation");
  } else {
    fail("Checkout action missing Zod validation");
  }
} else {
  warn("Checkout action file not found");
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
heading("Summary");
console.log(`  Routes audited: ${routeChecks.length}`);
console.log(`  Admin routes with auth: ${routeChecks.filter((r) => r.requiresAuth && r.hasAuth).length}/${routeChecks.filter((r) => r.requiresAuth).length}`);
console.log(`  Routes with rate limiting: ${routeChecks.filter((r) => r.hasRateLimit).length}`);
console.log(`  Routes with input validation: ${routeChecks.filter((r) => r.hasInputValidation).length}`);
console.log(`\n  Exit code: ${exitCode}\n`);

process.exit(exitCode);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function findTsFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules") {
      results.push(...findTsFiles(fullPath));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}
