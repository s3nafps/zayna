import { describe, expect, it } from "vitest";
import type { OrderStatusValue } from "@/lib/order-status";
import {
  buildWindows,
  computeAlerts,
  computeDailySeries,
  computeKpis,
  computePipeline,
  computeTopWilayas,
  deliveryRate,
  type DashboardOrder,
} from "./metrics";

// Fixed "now": 13:00 on 8 October in Algiers. Week range starts at 1 October, local midnight.
const NOW = new Date("2026-10-08T12:00:00Z");

let counter = 0;
function order(status: OrderStatusValue, createdAt: string, total: number, wilayaCode = "16"): DashboardOrder {
  counter += 1;
  return {
    id: `o${counter}`,
    number: `ZY-T${counter}`,
    status,
    total,
    wilayaCode,
    createdAt: new Date(createdAt),
    customerName: "Client test",
    phone: "0500000000",
  };
}

const orders: DashboardOrder[] = [
  order("NEW", "2026-10-08T10:00:00Z", 5000),
  order("SHIPPED", "2026-10-05T10:00:00Z", 3000, "31"),
  order("DELIVERED", "2026-10-06T10:00:00Z", 4000, "31"),
  order("RETURNED", "2026-10-07T10:00:00Z", 2000, "25"),
  order("CANCELLED", "2026-10-08T09:00:00Z", 9999),
  order("DELIVERED", "2026-09-20T10:00:00Z", 7000), // outside the week, so not in the rates
  order("UNREACHABLE", "2026-10-02T10:00:00Z", 1500),
];

describe("KPIs", () => {
  it("counts a week of finished and open orders, leaving out cancelled ones", () => {
    const kpis = computeKpis(orders, buildWindows(NOW, "week"));
    expect(kpis.newToday).toBe(1);
    expect(kpis.toConfirm).toBe(1);
    expect(kpis.inRoute).toBe(1);
    expect(kpis.codInTransit).toBe(3000);
    expect(kpis.delivered).toBe(1);
    expect(kpis.returns).toBe(1);
    expect(kpis.deliveryRate).toBe(0.5);
    expect(kpis.returnRate).toBe(0.5);
  });

  it("scopes the rates to today when the range is today", () => {
    const kpis = computeKpis(orders, buildWindows(NOW, "today"));
    expect(kpis.delivered).toBe(0);
    expect(kpis.deliveryRate).toBeNull();
    expect(kpis.returnRate).toBeNull();
    // Open counts still cover every open order, whatever the range.
    expect(kpis.inRoute).toBe(1);
  });

  it("gives no rate when nothing has finished", () => {
    expect(deliveryRate(0, 0)).toBeNull();
    expect(deliveryRate(3, 1)).toBe(0.75);
  });
});

describe("pipeline", () => {
  it("counts open groups in full and finished groups within the range", () => {
    const counts = computePipeline(orders, buildWindows(NOW, "week"));
    expect(counts.toConfirm).toBe(1);
    expect(counts.unreachable).toBe(1);
    expect(counts.inRoute).toBe(1);
    expect(counts.delivered).toBe(1);
    expect(counts.returns).toBe(1);
    expect(counts.ready).toBe(0);
  });
});

describe("daily series", () => {
  it("returns seven local days, oldest first, ending today", () => {
    const series = computeDailySeries(orders, NOW);
    expect(series.map((p) => p.date)).toEqual([
      "2026-10-02",
      "2026-10-03",
      "2026-10-04",
      "2026-10-05",
      "2026-10-06",
      "2026-10-07",
      "2026-10-08",
    ]);
    expect(series.at(-1)).toMatchObject({ date: "2026-10-08", count: 1, amount: 5000 });
  });

  it("does not count cancelled orders", () => {
    const today = computeDailySeries(orders, NOW).at(-1);
    expect(today?.amount).toBe(5000);
  });
});

describe("top wilayas", () => {
  it("ranks by amount inside the range", () => {
    const rows = computeTopWilayas(orders, buildWindows(NOW, "week"));
    expect(rows.map((r) => [r.wilayaCode, r.amount])).toEqual([
      ["31", 7000],
      ["16", 6500],
      ["25", 2000],
    ]);
    expect(rows.find((r) => r.wilayaCode === "31")).toMatchObject({ count: 2, delivered: 1 });
  });
});

describe("alerts", () => {
  it("lists orders that need a call, oldest first", () => {
    const { total, items } = computeAlerts(orders);
    expect(total).toBe(2);
    expect(items.map((o) => o.status)).toEqual(["UNREACHABLE", "NEW"]);
  });
});
