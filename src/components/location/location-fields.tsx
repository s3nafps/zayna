"use client";

import { useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { formatWilayaLabel } from "@/lib/wilaya";

export type WilayaOption = { code: string; nameFr: string; nameAr: string };
export type CommuneOption = { id: number; wilayaCode: string; nameFr: string; nameAr: string };

export type LocationFieldsProps = {
  wilayas: WilayaOption[];
  communes: CommuneOption[];
  wilayaFieldName?: string;
  communeFieldName?: string;
};

const FIELD =
  "h-tap w-full rounded-lg border border-gold-border bg-white px-3 font-sans text-body-md text-on-surface focus:border-primary-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/15 disabled:bg-surface-container";

// Wilaya then commune. The commune list is filtered by the chosen wilaya. Brief §5.
export function LocationFields({
  wilayas,
  communes,
  wilayaFieldName = "wilayaCode",
  communeFieldName = "communeId",
}: LocationFieldsProps) {
  const t = useTranslations("location");
  const wilayaId = useId();
  const communeId = useId();
  const [wilayaCode, setWilayaCode] = useState("");

  const availableCommunes = useMemo(
    () => communes.filter((commune) => commune.wilayaCode === wilayaCode),
    [communes, wilayaCode],
  );

  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor={wilayaId} className="font-sans text-label-md font-semibold text-on-surface">
          {t("wilayaLabel")}
        </label>
        <select
          id={wilayaId}
          name={wilayaFieldName}
          required
          value={wilayaCode}
          onChange={(event) => setWilayaCode(event.target.value)}
          className={FIELD}
        >
          <option value="">{t("wilayaPlaceholder")}</option>
          {wilayas.map((wilaya) => (
            <option key={wilaya.code} value={wilaya.code}>
              {formatWilayaLabel(wilaya)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={communeId} className="font-sans text-label-md font-semibold text-on-surface">
          {t("communeLabel")}
        </label>
        <select
          key={wilayaCode}
          id={communeId}
          name={communeFieldName}
          required
          disabled={!wilayaCode}
          defaultValue=""
          className={FIELD}
        >
          <option value="">{wilayaCode ? t("communePlaceholder") : t("communeNeedsWilaya")}</option>
          {availableCommunes.map((commune) => (
            <option key={commune.id} value={commune.id}>
              {commune.nameFr} / {commune.nameAr}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
