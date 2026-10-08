import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CodTrustBadge } from "@/components/commerce/cod-trust-badge";
import { Price } from "@/components/commerce/price";
import { Link } from "@/i18n/navigation";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { locale, handle } = await params;
  setRequestLocale(locale);
  const catalog = getCatalog();
  if (!catalog) {
    notFound();
  }
  const product = await catalog.getProduct(handle);
  if (!product) {
    notFound();
  }
  const t = await getTranslations("store.product");
  const tHome = await getTranslations("store.home");

  return (
    <article className="flex flex-col gap-4 px-margin py-space-lg">
      <Link href="/" className="font-sans text-label-md font-semibold text-primary">
        {t("back")}
      </Link>
      {catalog.kind === "mock" ? (
        <p
          role="note"
          className="rounded-lg bg-surface-container-low px-3 py-2 font-sans text-body-sm text-on-surface"
        >
          {tHome("mockNotice")}
        </p>
      ) : null}
      <div aria-hidden="true" className="aspect-[4/5] rounded-xl bg-blush" />
      <p className="font-sans text-label-md text-on-surface-variant">
        {t("material")}: {product.material}
      </p>
      <h1 className="font-display text-headline-lg font-medium text-on-surface">{product.title}</h1>
      <Price amount={product.priceDzd} compareAt={product.compareAtDzd} />
      <CodTrustBadge />
    </article>
  );
}
