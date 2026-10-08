import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductCard } from "@/components/commerce/product-card";
import { Price } from "@/components/commerce/price";
import { CodTrustBadge } from "@/components/commerce/cod-trust-badge";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { LocationFields } from "@/components/location/location-fields";
import { KpiCard } from "@/components/admin/kpi-card";
import { DataTable } from "@/components/admin/data-table";
import { ORDER_STATUSES } from "@/lib/order-status";

// Component preview for Phase 1 screenshots and tests. Off unless ZAYNA_PREVIEW=1.
// All data below is test fixture data, not content from the Stitch mockups.
export const dynamic = "force-dynamic";

const WILAYAS = [
  { code: "16", nameFr: "Alger", nameAr: "الجزائر" },
  { code: "31", nameFr: "Oran", nameAr: "وهران" },
  { code: "25", nameFr: "Constantine", nameAr: "قسنطينة" },
];

const COMMUNES = [
  { id: 1, wilayaCode: "16", nameFr: "Commune test A", nameAr: "بلدية تجريبية أ" },
  { id: 2, wilayaCode: "16", nameFr: "Commune test B", nameAr: "بلدية تجريبية ب" },
  { id: 3, wilayaCode: "31", nameFr: "Commune test C", nameAr: "بلدية تجريبية ج" },
];

export default async function ComponentPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  if (process.env.ZAYNA_PREVIEW !== "1") {
    notFound();
  }
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("preview");

  return (
    <div className="flex flex-col gap-8 px-margin py-space-lg">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-headline-lg font-medium text-on-surface">{t("title")}</h1>
        <p className="font-sans text-body-sm text-on-surface-variant">{t("fixtureNote")}</p>
      </header>

      <section className="grid grid-cols-2 gap-gutter md:grid-cols-3">
        <ProductCard
          href="/products/fixture-a"
          name="Collier test"
          material="Acier inoxydable"
          priceDzd={4500}
          compareAtDzd={5000}
          badge="Test"
        />
        <ProductCard
          href="/products/fixture-b"
          name="Bracelet test"
          material="Acier inoxydable"
          priceDzd={3200}
        />
      </section>

      <section className="flex flex-col gap-3">
        <Price amount={12500} />
        <Price amount={4500} compareAt={5000} arabicDigits={locale === "ar"} />
        <CodTrustBadge />
      </section>

      <section data-testid="status-pills" className="flex flex-wrap gap-2">
        {ORDER_STATUSES.map((status) => (
          <StatusPill key={status} status={status} />
        ))}
      </section>

      <section className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
      </section>

      <section className="max-w-md">
        <LocationFields wilayas={WILAYAS} communes={COMMUNES} />
      </section>

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-3">
        <KpiCard label="Test" value="0" hint="Fixture" />
        <KpiCard label="Test" value="12" />
        <KpiCard label="Test" value="3" />
      </section>

      <section>
        <DataTable
          columns={[
            { key: "number", header: "N°" },
            { key: "status", header: "Statut" },
            { key: "amount", header: "Montant" },
          ]}
          rows={[
            {
              id: "1",
              cells: {
                number: "ZY-0001",
                status: <StatusPill status="NEW" />,
                amount: <Price amount={4500} />,
              },
            },
            {
              id: "2",
              cells: {
                number: "ZY-0002",
                status: <StatusPill status="DELIVERED" />,
                amount: <Price amount={3200} />,
              },
            },
          ]}
        />
      </section>
    </div>
  );
}
