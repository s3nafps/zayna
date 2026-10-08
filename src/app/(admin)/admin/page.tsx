import { getTranslations } from "next-intl/server";

// Owner dashboard placeholder. KPIs arrive in Phase 3, computed from the database.
export default async function AdminDashboardPage() {
  const t = await getTranslations("admin");
  return (
    <section className="flex flex-1 flex-col gap-2 p-margin-desktop">
      <h1 className="font-display text-headline-lg font-medium text-on-surface">{t("placeholderTitle")}</h1>
      <p className="font-sans text-body-md text-on-surface-variant">{t("placeholderBody")}</p>
    </section>
  );
}
