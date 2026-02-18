import { test, expect } from "@playwright/test";

test.describe("Shopping Flow", () => {
  test("browse shop page and see products", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.locator("h1, [data-testid='shop-heading']")).toBeVisible();
    const productCards = page.locator(
      'a[href*="/products/"], [data-testid="product-card"]'
    );
    await expect(productCards.first()).toBeVisible({ timeout: 10_000 });
  });

  test("click product to view detail page", async ({ page }) => {
    await page.goto("/shop");

    const productLink = page
      .locator('a[href*="/products/"]')
      .first();
    await productLink.waitFor({ state: "visible", timeout: 10_000 });

    const href = await productLink.getAttribute("href");
    await productLink.click();

    await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await expect(
      page.getByRole("button", { name: /ajouter|cart|panier/i })
    ).toBeVisible();
  });

  test("add product to cart and verify cart drawer", async ({ page }) => {
    await page.goto("/shop");

    const productLink = page.locator('a[href*="/products/"]').first();
    await productLink.waitFor({ state: "visible", timeout: 10_000 });
    await productLink.click();

    const addToCartButton = page.getByRole("button", {
      name: /ajouter|cart|panier/i,
    });
    await addToCartButton.waitFor({ state: "visible" });
    await addToCartButton.click();

    const cartDrawer = page.locator(
      '[role="dialog"], [data-testid="cart-sheet"]'
    );
    await expect(cartDrawer).toBeVisible({ timeout: 5_000 });
  });

  test("remove item from cart", async ({ page }) => {
    await page.goto("/shop");

    const productLink = page.locator('a[href*="/products/"]').first();
    await productLink.waitFor({ state: "visible", timeout: 10_000 });
    await productLink.click();

    const addToCartButton = page.getByRole("button", {
      name: /ajouter|cart|panier/i,
    });
    await addToCartButton.waitFor({ state: "visible" });
    await addToCartButton.click();

    const cartDrawer = page.locator(
      '[role="dialog"], [data-testid="cart-sheet"]'
    );
    await expect(cartDrawer).toBeVisible({ timeout: 5_000 });

    const removeButton = cartDrawer.getByRole("button", {
      name: /supprimer|remove|trash/i,
    });
    if (await removeButton.isVisible()) {
      await removeButton.click();
      await expect(
        cartDrawer.getByText(/panier vide|votre panier est vide/i)
      ).toBeVisible({ timeout: 5_000 });
    }
  });

  test("navigate to checkout from cart", async ({ page }) => {
    await page.goto("/shop");

    const productLink = page.locator('a[href*="/products/"]').first();
    await productLink.waitFor({ state: "visible", timeout: 10_000 });
    await productLink.click();

    const addToCartButton = page.getByRole("button", {
      name: /ajouter|cart|panier/i,
    });
    await addToCartButton.waitFor({ state: "visible" });
    await addToCartButton.click();

    const cartDrawer = page.locator(
      '[role="dialog"], [data-testid="cart-sheet"]'
    );
    await expect(cartDrawer).toBeVisible({ timeout: 5_000 });

    const checkoutLink = cartDrawer.getByRole("link", {
      name: /commander|checkout|passer/i,
    });
    if (await checkoutLink.isVisible()) {
      await checkoutLink.click();
      await expect(page).toHaveURL(/\/checkout/);
    }
  });
});
