import { test, expect } from "@playwright/test";

/**
 * Helper: add a product to cart then navigate to checkout.
 * Reused by multiple checkout tests to avoid duplication.
 */
async function addProductAndGoToCheckout(page: import("@playwright/test").Page) {
  await page.goto("/shop");

  const productLink = page.locator('a[href*="/products/"]').first();
  await productLink.waitFor({ state: "visible", timeout: 10_000 });
  await productLink.click();

  const addToCartButton = page.getByRole("button", {
    name: /ajouter|cart|panier/i,
  });
  await addToCartButton.waitFor({ state: "visible" });
  await addToCartButton.click();

  await page.goto("/checkout");
}

test.describe("Checkout", () => {
  test("checkout page loads", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/checkout/);
  });

  test("checkout page shows empty cart message when no items", async ({
    page,
  }) => {
    await page.goto("/checkout");
    const emptyIndicator = page.getByText(
      /panier.*vide|aucun.*article|votre panier est vide/i
    );
    const checkoutForm = page.locator(
      'form, [data-testid="checkout-form"]'
    );

    const hasEmpty = await emptyIndicator.isVisible().catch(() => false);
    const hasForm = await checkoutForm.isVisible().catch(() => false);
    expect(hasEmpty || hasForm).toBeTruthy();
  });

  test("fill checkout form fields", async ({ page }) => {
    await addProductAndGoToCheckout(page);

    const loginDialog = page.locator('[role="dialog"]');
    if (await loginDialog.isVisible().catch(() => false)) {
      const continueAsGuest = loginDialog.getByRole("button", {
        name: /continuer|invité|guest/i,
      });
      if (await continueAsGuest.isVisible().catch(() => false)) {
        await continueAsGuest.click();
      }
    }

    const nameInput = page.locator(
      'input[name="name"], input[placeholder*="nom" i]'
    );
    const emailInput = page.locator(
      'input[name="email"], input[type="email"]'
    );
    const phoneInput = page.locator(
      'input[name="phone"], input[type="tel"]'
    );
    const addressInput = page.locator(
      'input[name="line1"], input[placeholder*="adresse" i]'
    );
    const cityInput = page.locator(
      'input[name="city"], input[placeholder*="ville" i]'
    );

    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill("Ahmed Ben Ali");
    }
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill("ahmed@example.com");
    }
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill("98765432");
    }
    if (await addressInput.isVisible().catch(() => false)) {
      await addressInput.fill("15 Rue de la Liberté");
    }
    if (await cityInput.isVisible().catch(() => false)) {
      await cityInput.fill("Tunis");
    }

    const gouvernoratSelect = page.locator(
      'select[name="gouvernorat"], [data-testid="gouvernorat-select"]'
    );
    if (await gouvernoratSelect.isVisible().catch(() => false)) {
      await gouvernoratSelect.selectOption({ index: 1 });
    }
  });

  test("form validation shows errors for missing required fields", async ({
    page,
  }) => {
    await addProductAndGoToCheckout(page);

    const loginDialog = page.locator('[role="dialog"]');
    if (await loginDialog.isVisible().catch(() => false)) {
      const continueAsGuest = loginDialog.getByRole("button", {
        name: /continuer|invité|guest/i,
      });
      if (await continueAsGuest.isVisible().catch(() => false)) {
        await continueAsGuest.click();
      }
    }

    const submitButton = page.getByRole("button", {
      name: /confirmer|commander|passer.*commande|submit/i,
    });

    if (await submitButton.isVisible().catch(() => false)) {
      await submitButton.click();

      await expect(
        page
          .getByText(/requis|invalide|required|obligatoire/i)
          .first()
      ).toBeVisible({ timeout: 5_000 });
    }
  });
});
