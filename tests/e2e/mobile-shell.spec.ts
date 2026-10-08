import { expect, test } from "@playwright/test";
import { fileURLToPath } from "node:url";

// The Android app opens www/index.html first. These tests load that file directly, without a device.
const LOADER = fileURLToPath(new URL("../../www/index.html", import.meta.url));

test("without APP_URL the loader explains the configuration problem", async ({ page }) => {
  await page.goto(`file://${LOADER}`);
  await expect(page.getByText("L’adresse du serveur n’est pas configurée.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Réessayer" })).toBeHidden();
});

test("the loader keeps its inline styles and stays on the local page when no URL is set", async ({
  page,
}) => {
  await page.goto(`file://${LOADER}`);
  const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(background).toBe("rgb(255, 248, 243)");
  expect(page.url()).toContain("index.html");
});
