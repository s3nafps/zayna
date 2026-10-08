import type { ReactNode } from "react";

export type KpiCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
};

// Dashboard tile. The caller passes real values from the database, never mock numbers.
export function KpiCard({ label, value, hint }: KpiCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gold-border bg-surface-container-lowest p-4 shadow-atmospheric">
      <p className="font-sans text-label-md font-semibold text-on-surface-variant">{label}</p>
      <p className="font-sans text-headline-lg font-semibold text-on-surface tabular">{value}</p>
      {hint ? <p className="font-sans text-body-sm text-on-surface-variant">{hint}</p> : null}
    </div>
  );
}
