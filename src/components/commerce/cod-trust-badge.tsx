import { getTranslations } from "next-intl/server";

// COD trust banner from DESIGN.md: emerald tint, 1px emerald border, bilingual copy.
export async function CodTrustBadge() {
  const t = await getTranslations("cod");
  return (
    <div className="flex items-start gap-3 rounded-lg border border-tertiary bg-tertiary/10 p-3">
      <span aria-hidden="true" className="material-symbols-outlined text-tertiary">
        payments
      </span>
      <div className="min-w-0">
        <p className="font-sans text-label-lg font-semibold text-tertiary">{t("title")}</p>
        <p className="font-sans text-body-sm text-on-surface-variant">{t("body")}</p>
      </div>
    </div>
  );
}
