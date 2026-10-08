import { getTranslations } from "next-intl/server";
import { toneForStatus, type OrderStatusValue, type StatusTone } from "@/lib/order-status";

const TONE_CLASS: Record<StatusTone, string> = {
  attention: "bg-status-amber/15 text-status-amber",
  progress: "bg-primary-container/20 text-on-primary-container",
  success: "bg-tertiary/10 text-tertiary",
  problem: "bg-error-container text-on-error-container",
};

export async function StatusPill({ status }: { status: OrderStatusValue }) {
  const t = await getTranslations("status");
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-0.5 font-sans text-label-sm font-semibold ${TONE_CLASS[toneForStatus(status)]}`}
      data-status={status}
    >
      {t(status)}
    </span>
  );
}
