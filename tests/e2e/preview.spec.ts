import { expect, test } from "@playwright/test";

// Component preview: fixtures for every shared component. Screenshots are the Phase 1 PR evidence.
const SCREENSHOT_DIR = "test-results/screenshots";

for (const locale of ["fr", "ar"] as const) {
  test(`component preview renders in ${locale}`, async ({ page }, testInfo) => {
    await page.goto(`/${locale}/preview/components`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByTestId("status-pills").locator("[data-status]")).toHaveCount(13);
    // Wait for webfonts (Playfair, Plus Jakarta, Cairo, Amiri, Material Symbols) so screenshots are final.
    await page.evaluate(() => document.fonts.ready);
    // Fixed bottom nav would cover content in a full-page capture, so pin it in flow for the screenshot.
    await page.addStyleTag({ content: "nav.fixed { position: static !important; }" });
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/components-${locale}-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
}

test("the commune list is filtered by the chosen wilaya", async ({ page }) => {
  await page.goto("/fr/preview/components");
  const commune = page.getByLabel("Commune");
  await expect(commune).toBeDisabled();
  await page.getByLabel("Wilaya").selectOption("31");
  await expect(commune).toBeEnabled();
  await expect(commune.locator("option")).toHaveCount(2);
  await expect(commune.locator("option", { hasText: "Commune test C" })).toHaveCount(1);
});
