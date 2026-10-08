import { getTranslations, setRequestLocale } from "next-intl/server";

// Storefront home. Phase 2 replaces this with the Shopify-backed catalog.
export default async function StoreHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  return (
    <section className="flex flex-1 items-center justify-center px-margin py-space-xl">
      <p className="font-sans text-body-lg text-on-surface-variant">{t("pageSoon")}</p>
    </section>
  );
}
