import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductCard } from "@/components/commerce/product-card";
import { getCatalog } from "@/lib/catalog";

// Read on every request for now. Shopify-backed ISR with webhook revalidation comes with Phase 2 and 3.
export const dynamic = "force-dynamic";

export default async function StoreHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("store.home");
  const catalog = getCatalog();

  if (!catalog) {
    return (
      <section className="flex flex-1 items-center justify-center px-margin py-space-xl">
        <p className="font-sans text-body-lg text-on-surface-variant">{t("unavailable")}</p>
      </section>
    );
  }

  const products = await catalog.listProducts();
  return (
    <section className="flex flex-col gap-4 px-margin py-space-lg">
      {catalog.kind === "mock" ? (
        <p
          role="note"
          className="rounded-lg bg-surface-container-low px-3 py-2 font-sans text-body-sm text-on-surface"
        >
          {t("mockNotice")}
        </p>
      ) : null}
      <h1 className="font-display text-headline-lg font-medium text-on-surface">{t("title")}</h1>
      {products.length === 0 ? (
        <p className="font-sans text-body-md text-on-surface-variant">{t("empty")}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-gutter md:grid-cols-3">
          {products.map((product) => (
            <li key={product.handle}>
              <ProductCard
                href={`/products/${product.handle}`}
                name={product.title}
                material={product.material}
                priceDzd={product.priceDzd}
                compareAtDzd={product.compareAtDzd}
                badge={product.badge}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
