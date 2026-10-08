// What the storefront reads from the catalog. Shopify is the source of truth (brief §1). Money is integer DZD.
export type CatalogProduct = {
  handle: string;
  title: string;
  // Material is a Shopify metafield (PLAN.md, B1). Never hard-coded copy.
  material: string;
  priceDzd: number;
  compareAtDzd?: number;
  badge?: string;
};

export interface CatalogSource {
  readonly kind: "mock";
  listProducts(): Promise<CatalogProduct[]>;
  getProduct(handle: string): Promise<CatalogProduct | null>;
}
