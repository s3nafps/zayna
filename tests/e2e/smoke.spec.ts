import { expect, test } from "@playwright/test";

test.describe("storefront locale routing", () => {
  test("French is LTR and the default", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("link", { name: "Zayna" })).toBeVisible();
  });

  test("Arabic is RTL", async ({ page }) => {
    await page.goto("/ar");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("button", { name: "AR" })).toHaveAttribute("aria-pressed", "true");
  });

  test("English is LTR", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });

  test("the root goes to French, whatever the browser language", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/fr$/);
  });

  test("the locale switcher keeps the path and changes the language", async ({ page }) => {
    await page.goto("/fr");
    await page.getByRole("button", { name: "EN" }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("an unknown locale is not found", async ({ page }) => {
    const response = await page.goto("/de");
    expect(response?.status()).toBe(404);
  });
});
