import "server-only";
import { getPrisma } from "@/lib/prisma";
import { localStartOfDay } from "@/lib/time";
import { OPEN_STATUSES, type DashboardOrder } from "./metrics";

// Open orders of any age, plus everything created in the last seven local days.
export async function loadOrdersForDashboard(now: Date): Promise<DashboardOrder[]> {
  const since = localStartOfDay(now, -6);
  return getPrisma().order.findMany({
    where: { OR: [{ createdAt: { gte: since } }, { status: { in: [...OPEN_STATUSES] } }] },
    select: {
      id: true,
      number: true,
      status: true,
      total: true,
      wilayaCode: true,
      createdAt: true,
      customerName: true,
      phone: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5000,
  });
}

export async function loadWilayaNames(): Promise<Map<string, { nameFr: string; nameAr: string }>> {
  const rows = await getPrisma().wilaya.findMany({ select: { code: true, nameFr: true, nameAr: true } });
  return new Map(rows.map((row) => [row.code, { nameFr: row.nameFr, nameAr: row.nameAr }]));
}
