import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";

// CHROMIUM_PATH lets sandboxes reuse a preinstalled browser. CI installs its own.
const chromiumPath = process.env.CHROMIUM_PATH;
const PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  outputDir: "test-results",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    launchOptions: chromiumPath ? { executablePath: chromiumPath } : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    // Runs the production build, so `pnpm build` must run first.
    command: `pnpm exec next start -p ${PORT}`,
    url: `http://localhost:${PORT}/fr`,
    reuseExistingServer: !process.env.CI,
    env: { ZAYNA_PREVIEW: "1", CATALOG_SOURCE: "mock" },
    timeout: 120_000,
  },
});
