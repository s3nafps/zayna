import type { CatalogProduct, CatalogSource } from "./types";

// Development-only catalogue. The products are made up. They are not copied from the Stitch mockups,
// and nothing here is Shopify data. Used until the Storefront token is connected (PLAN.md, D1).
const PRODUCTS: CatalogProduct[] = [
  {
    handle: "mock-pendant-01",
    title: "Pendentif démo 01",
    material: "Acier inoxydable",
    priceDzd: 2500,
    badge: "Démo",
  },
  {
    handle: "mock-bracelet-02",
    title: "Bracelet démo 02",
    material: "Acier inoxydable",
    priceDzd: 3200,
    compareAtDzd: 3800,
  },
  { handle: "mock-ring-03", title: "Bague démo 03", material: "Acier inoxydable", priceDzd: 1900 },
  {
    handle: "mock-earrings-04",
    title: "Boucles démo 04",
    material: "Acier inoxydable",
    priceDzd: 2100,
    badge: "Démo",
  },
  {
    handle: "mock-chain-05",
    title: "Chaîne démo 05",
    material: "Acier inoxydable",
    priceDzd: 4100,
    compareAtDzd: 4500,
  },
  { handle: "mock-set-06", title: "Parure démo 06", material: "Acier inoxydable", priceDzd: 6800 },
];

export function createMockCatalog(): CatalogSource {
  return {
    kind: "mock",
    async listProducts() {
      return PRODUCTS.map((product) => ({ ...product }));
    },
    async getProduct(handle) {
      const product = PRODUCTS.find((item) => item.handle === handle);
      return product ? { ...product } : null;
    },
  };
}
