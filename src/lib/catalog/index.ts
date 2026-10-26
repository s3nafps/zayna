import { createMockCatalog } from "./mock";
import type { CatalogSource } from "./types";

export type CatalogMode = "mock" | "none";

// CATALOG_SOURCE=mock|none. Unset means mock outside production, and none in production.
// Production never shows made-up products by accident.
export function resolveCatalogMode(env: Record<string, string | undefined> = process.env): CatalogMode {
  const value = env.CATALOG_SOURCE?.trim();
  if (value === "mock" || value === "none") {
    return value;
  }
  if (value) {
    throw new Error(
      `CATALOG_SOURCE must be "mock" or "none" until the Shopify source is built, received "${value}"`,
    );
  }
  return env.NODE_ENV === "production" ? "none" : "mock";
}

export function getCatalog(env: Record<string, string | undefined> = process.env): CatalogSource | null {
  return resolveCatalogMode(env) === "mock" ? createMockCatalog() : null;
}
