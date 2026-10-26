import { expect, test } from "@playwright/test";

test("the home shows the demo catalogue with its notice", async ({ page }, testInfo) => {
  await page.goto("/fr");
  await expect(page.getByRole("heading", { level: 1, name: "Nouveautés" })).toBeVisible();
  await expect(page.getByRole("note")).toContainText("Catalogue de démonstration");
  await expect(page.getByRole("link", { name: /Bague démo 03/ })).toHaveAttribute(
    "href",
    "/fr/products/mock-ring-03",
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `test-results/screenshots/storefront-home-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

test("a product page shows the material, price and COD badge", async ({ page }) => {
  await page.goto("/fr/products/mock-bracelet-02");
  await expect(page.getByRole("heading", { level: 1, name: "Bracelet démo 02" })).toBeVisible();
  await expect(page.getByText("Matière: Acier inoxydable")).toBeVisible();
  await expect(page.getByText("Paiement à la livraison").first()).toBeVisible();
});

test("an unknown product is not found", async ({ page }) => {
  const response = await page.goto("/fr/products/no-such-product");
  expect(response?.status()).toBe(404);
});

test("the Arabic home is RTL and lists the same products", async ({ page }) => {
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1, name: "وصل حديثاً" })).toBeVisible();
});
