import type { OrderStatusValue } from "@/lib/order-status";
import { localDateKey, localStartOfDay } from "@/lib/time";

// Order rows as the dashboard reads them. Money is integer DZD.
export type DashboardOrder = {
  id: string;
  number: string;
  status: OrderStatusValue;
  total: number;
  wilayaCode: string;
  createdAt: Date;
  customerName: string;
  phone: string;
};

// Pipeline groups. Each one is a set of internal statuses, shared by the dashboard and the orders list.
export const PIPELINE_GROUPS = {
  toConfirm: ["NEW"],
  unreachable: ["UNREACHABLE"],
  ready: ["CONFIRMED", "PREPARING"],
  inRoute: ["SHIPPED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "AT_STOPDESK"],
  delivered: ["DELIVERED", "COD_SETTLED"],
  returns: ["RETURNED", "FAILED"],
} as const satisfies Record<string, readonly OrderStatusValue[]>;

export type PipelineGroup = keyof typeof PIPELINE_GROUPS;
export const PIPELINE_GROUP_KEYS = Object.keys(PIPELINE_GROUPS) as PipelineGroup[];

// Open groups are still moving, so they count whatever their age. Finished groups count within the range.
export const OPEN_GROUPS = [
  "toConfirm",
  "unreachable",
  "ready",
  "inRoute",
] as const satisfies readonly PipelineGroup[];
export const OPEN_STATUSES: readonly OrderStatusValue[] = OPEN_GROUPS.flatMap(
  (group) => PIPELINE_GROUPS[group],
);

export type Range = "today" | "week";

export type Windows = { now: Date; todayStart: Date; rangeStart: Date };

export function buildWindows(now: Date, range: Range): Windows {
  const todayStart = localStartOfDay(now);
  const rangeStart = range === "today" ? todayStart : localStartOfDay(now, -6);
  return { now, todayStart, rangeStart };
}

function isActive(order: DashboardOrder): boolean {
  return order.status !== "CANCELLED";
}

function groupOf(status: OrderStatusValue): PipelineGroup | null {
  for (const group of PIPELINE_GROUP_KEYS) {
    if ((PIPELINE_GROUPS[group] as readonly OrderStatusValue[]).includes(status)) {
      return group;
    }
  }
  return null;
}

export function deliveryRate(delivered: number, returns: number): number | null {
  const finalized = delivered + returns;
  return finalized === 0 ? null : delivered / finalized;
}

export type Kpis = {
  newToday: number;
  toConfirm: number;
  inRoute: number;
  delivered: number;
  deliveryRate: number | null;
  returns: number;
  returnRate: number | null;
  codInTransit: number;
};

export function computeKpis(orders: DashboardOrder[], windows: Windows): Kpis {
  const active = orders.filter(isActive);
  const inRange = active.filter((o) => o.createdAt >= windows.rangeStart);
  const groupsIn = (list: DashboardOrder[], group: PipelineGroup) =>
    list.filter((o) => groupOf(o.status) === group);

  const delivered = groupsIn(inRange, "delivered").length;
  const returns = groupsIn(inRange, "returns").length;
  const inRoute = groupsIn(active, "inRoute");
  const rate = deliveryRate(delivered, returns);

  return {
    newToday: active.filter((o) => o.createdAt >= windows.todayStart).length,
    toConfirm: groupsIn(active, "toConfirm").length,
    inRoute: inRoute.length,
    delivered,
    deliveryRate: rate,
    returns,
    returnRate: rate === null ? null : 1 - rate,
    codInTransit: inRoute.reduce((sum, o) => sum + o.total, 0),
  };
}

// Pipeline counts for the mobile seller view. Open groups count all open orders. Finished groups count the range.
export function computePipeline(orders: DashboardOrder[], windows: Windows): Record<PipelineGroup, number> {
  const active = orders.filter(isActive);
  const counts = Object.fromEntries(PIPELINE_GROUP_KEYS.map((group) => [group, 0])) as Record<
    PipelineGroup,
    number
  >;
  for (const order of active) {
    const group = groupOf(order.status);
    if (!group) continue;
    const isOpen = (OPEN_GROUPS as readonly PipelineGroup[]).includes(group);
    if (isOpen || order.createdAt >= windows.rangeStart) {
      counts[group] += 1;
    }
  }
  return counts;
}

export type DayPoint = { date: string; count: number; amount: number };

// Orders created per local day, oldest first. Today is the last point. Cancelled orders are excluded.
export function computeDailySeries(orders: DashboardOrder[], now: Date, days = 7): DayPoint[] {
  const keys = Array.from({ length: days }, (_, index) =>
    localDateKey(new Date(localStartOfDay(now, -(days - 1 - index)).getTime() + 12 * 60 * 60 * 1000)),
  );
  const points = new Map(keys.map((date) => [date, { date, count: 0, amount: 0 }]));
  for (const order of orders) {
    if (!isActive(order)) continue;
    const point = points.get(localDateKey(order.createdAt));
    if (point) {
      point.count += 1;
      point.amount += order.total;
    }
  }
  return keys.map((date) => points.get(date) ?? { date, count: 0, amount: 0 });
}

export type WilayaRow = {
  wilayaCode: string;
  count: number;
  amount: number;
  delivered: number;
  returns: number;
};

export function computeTopWilayas(orders: DashboardOrder[], windows: Windows, limit = 6): WilayaRow[] {
  const rows = new Map<string, WilayaRow>();
  for (const order of orders) {
    if (!isActive(order) || order.createdAt < windows.rangeStart) continue;
    const row = rows.get(order.wilayaCode) ?? {
      wilayaCode: order.wilayaCode,
      count: 0,
      amount: 0,
      delivered: 0,
      returns: 0,
    };
    row.count += 1;
    row.amount += order.total;
    const group = groupOf(order.status);
    if (group === "delivered") row.delivered += 1;
    if (group === "returns") row.returns += 1;
    rows.set(order.wilayaCode, row);
  }
  return [...rows.values()]
    .sort((a, b) => b.amount - a.amount || a.wilayaCode.localeCompare(b.wilayaCode))
    .slice(0, limit);
}

// Open orders that need a phone call, oldest first: the most urgent work at the top.
export function computeAlerts(
  orders: DashboardOrder[],
  limit = 5,
): { total: number; items: DashboardOrder[] } {
  const needsCall = orders
    .filter((o) => o.status === "NEW" || o.status === "UNREACHABLE")
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  return { total: needsCall.length, items: needsCall.slice(0, limit) };
}
