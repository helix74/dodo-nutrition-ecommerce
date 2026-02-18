import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Dodo Nutrition/);
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("main navigation links are visible on desktop", async ({ page }) => {
    await page.goto("/");

    const nav = page.locator("header nav, header");
    await expect(nav.getByRole("link", { name: /accueil/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /boutique/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /packs/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /promos/i })).toBeVisible();
  });

  test("Boutique link navigates to shop page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /boutique/i }).first().click();
    await expect(page).toHaveURL(/\/shop/);
  });

  test("Packs link navigates to packs page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /packs/i }).first().click();
    await expect(page).toHaveURL(/\/packs/);
  });

  test("footer links are present", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.getByRole("link").first()).toBeVisible();
  });

  test("logo navigates to homepage", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('header a[href="/"]').first().click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("Mobile Navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hamburger menu opens and closes", async ({ page }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /menu/i });
    await expect(menuButton).toBeVisible();

    await menuButton.click();

    await expect(
      page.getByRole("link", { name: /boutique/i }).first()
    ).toBeVisible();

    await menuButton.click();
  });

  test("mobile menu links navigate correctly", async ({ page }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /menu/i });
    await menuButton.click();

    await page.getByRole("link", { name: /boutique/i }).first().click();
    await expect(page).toHaveURL(/\/shop/);
  });
});
