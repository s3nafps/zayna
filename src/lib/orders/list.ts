// Filter keys for the orders list. The same keys as the dashboard pipeline, plus "all".
import { PIPELINE_GROUPS, type PipelineGroup } from "@/lib/dashboard/metrics";
import type { OrderStatusValue } from "@/lib/order-status";

export const ORDER_FILTERS = ["all", ...(Object.keys(PIPELINE_GROUPS) as PipelineGroup[])] as const;
export type OrderFilter = (typeof ORDER_FILTERS)[number];

export function parseOrderFilter(value: string | undefined): OrderFilter {
  return (ORDER_FILTERS as readonly string[]).includes(value ?? "") ? (value as OrderFilter) : "all";
}

export function statusesForFilter(filter: OrderFilter): readonly OrderStatusValue[] | null {
  return filter === "all" ? null : PIPELINE_GROUPS[filter];
}

export const PAGE_SIZE = 25;

export function parsePage(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}
