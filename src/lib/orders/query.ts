import "server-only";
import { getPrisma } from "@/lib/prisma";
import { PAGE_SIZE, statusesForFilter, type OrderFilter } from "./list";

export type OrderListRow = {
  id: string;
  number: string;
  status: string;
  total: number;
  wilayaCode: string;
  createdAt: Date;
  customerName: string;
  phone: string;
};

export async function loadOrdersPage(filter: OrderFilter, page: number) {
  const statuses = statusesForFilter(filter);
  const where = statuses ? { status: { in: [...statuses] } } : {};
  const prisma = getPrisma();
  const [total, rows] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
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
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  return { total, rows, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}
