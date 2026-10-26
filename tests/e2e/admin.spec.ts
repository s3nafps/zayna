import { expect, test, type Page } from "@playwright/test";

// The owner account comes from ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD. The seed creates it before the tests.
const EMAIL = process.env.ADMIN_SEED_EMAIL ?? "owner@zayna.test";
const PASSWORD = process.env.ADMIN_SEED_PASSWORD ?? "";

async function signIn(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(EMAIL);
  await page.getByLabel("Mot de passe").fill(PASSWORD);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test("signed-out visitors are sent to the login page", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
});

test("a wrong password shows one generic error", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(EMAIL);
  await page.getByLabel("Mot de passe").fill("not-the-password-123");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.locator("form").getByRole("alert")).toHaveText("E-mail ou mot de passe incorrect.");
});

test("the owner signs in, sees the dashboard, and signs out", async ({ page }, testInfo) => {
  await signIn(page);
  await expect(page.getByRole("heading", { level: 1, name: "Tableau de bord" })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `test-results/screenshots/dashboard-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Déconnexion" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("the range switch marks the active option", async ({ page }) => {
  await signIn(page);
  await page.getByRole("navigation", { name: "Période" }).getByRole("link", { name: "Aujourd'hui" }).click();
  await expect(page).toHaveURL(/range=today$/);
  await expect(page.getByRole("link", { name: "Aujourd'hui" })).toHaveAttribute("aria-current", "page");
});

test("the orders list filters by pipeline group", async ({ page }) => {
  await signIn(page);
  await page.goto("/admin/orders?group=toConfirm");
  await expect(page.getByRole("heading", { level: 1, name: "Commandes" })).toBeVisible();
  await expect(page.getByRole("link", { name: "À confirmer" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("row").filter({ hasText: "ZYF-" }).first()).toBeVisible();
});

test("the sidebar disables pages that are not built yet", async ({ page }) => {
  await signIn(page);
  // The sidebar is hidden below 1024px, so check that the disabled item exists rather than that it is visible.
  await expect(page.locator('[aria-disabled="true"]').filter({ hasText: "Paramètres" })).toBeAttached();
});
