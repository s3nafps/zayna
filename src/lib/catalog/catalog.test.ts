import { describe, expect, it } from "vitest";
import { getCatalog, resolveCatalogMode } from "./index";

describe("catalog mode", () => {
  it("uses the mock outside production when unset", () => {
    expect(resolveCatalogMode({ NODE_ENV: "development" })).toBe("mock");
  });

  it("uses no catalog in production when unset, so made-up products never reach customers", () => {
    expect(resolveCatalogMode({ NODE_ENV: "production" })).toBe("none");
    expect(getCatalog({ NODE_ENV: "production" })).toBeNull();
  });

  it("honours an explicit choice", () => {
    expect(resolveCatalogMode({ NODE_ENV: "production", CATALOG_SOURCE: "mock" })).toBe("mock");
    expect(resolveCatalogMode({ CATALOG_SOURCE: "none" })).toBe("none");
  });

  it("refuses a source that is not built yet", () => {
    expect(() => resolveCatalogMode({ CATALOG_SOURCE: "shopify" })).toThrow(/must be "mock" or "none"/);
  });
});

describe("mock catalog", () => {
  it("lists products with integer DZD prices and a material", async () => {
    const catalog = getCatalog({ CATALOG_SOURCE: "mock" });
    const products = await catalog!.listProducts();
    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
      expect(Number.isInteger(product.priceDzd)).toBe(true);
      expect(product.material.length).toBeGreaterThan(0);
    }
  });

  it("finds a product by handle and returns null for an unknown one", async () => {
    const catalog = getCatalog({ CATALOG_SOURCE: "mock" })!;
    expect((await catalog.getProduct("mock-ring-03"))?.title).toBe("Bague démo 03");
    expect(await catalog.getProduct("does-not-exist")).toBeNull();
  });
});
