// Internal order statuses and how the UI groups them. Pure data, no I/O.
export const ORDER_STATUSES = [
  "NEW",
  "CONFIRMED",
  "UNREACHABLE",
  "CANCELLED",
  "PREPARING",
  "SHIPPED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "AT_STOPDESK",
  "DELIVERED",
  "COD_SETTLED",
  "RETURNED",
  "FAILED",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

// Visual tone for a status pill. "attention" means someone must act now.
export type StatusTone = "attention" | "progress" | "success" | "problem";

const TONE: Record<OrderStatusValue, StatusTone> = {
  NEW: "attention",
  UNREACHABLE: "attention",
  CONFIRMED: "progress",
  PREPARING: "progress",
  SHIPPED: "progress",
  IN_TRANSIT: "progress",
  OUT_FOR_DELIVERY: "progress",
  AT_STOPDESK: "progress",
  DELIVERED: "success",
  COD_SETTLED: "success",
  CANCELLED: "problem",
  RETURNED: "problem",
  FAILED: "problem",
};

export function toneForStatus(status: OrderStatusValue): StatusTone {
  return TONE[status];
}
