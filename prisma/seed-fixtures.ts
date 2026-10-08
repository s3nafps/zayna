// Dev-only fixture orders for the dashboard and the orders list. Opt-in and refuses to run in production.
// Every row is clearly fake: numbers start with ZYF-, names say "Client test", phones use 0550 000 0xx.
import { createPrismaClient } from "../src/lib/prisma";

const STATUSES = [
  "NEW",
  "NEW",
  "NEW",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "AT_STOPDESK",
  "DELIVERED",
  "DELIVERED",
  "DELIVERED",
  "COD_SETTLED",
  "RETURNED",
  "FAILED",
  "UNREACHABLE",
  "CANCELLED",
] as const;
const WILAYAS = ["16", "31", "25", "19", "09", "15", "06"] as const;
const TOTALS = [2800, 3600, 4500, 5200, 6800, 7400, 9100, 11800, 14000] as const;

// Small deterministic generator, so the fixtures are the same on every run.
function generator(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

async function main(): Promise<void> {
  if (process.env.NODE_ENV === "production" || process.env.ZAYNA_SEED_FIXTURES !== "1") {
    console.log("fixtures: skipped. Set ZAYNA_SEED_FIXTURES=1 and never run this in production.");
    return;
  }
  const prisma = createPrismaClient();
  try {
    const random = generator(20261008);
    const now = Date.now();
    await prisma.order.deleteMany({ where: { number: { startsWith: "ZYF-" } } });
    const rows = Array.from({ length: 48 }, (_, index) => {
      const status = STATUSES[Math.floor(random() * STATUSES.length)] ?? "NEW";
      const total = TOTALS[Math.floor(random() * TOTALS.length)] ?? 2800;
      const shippingFee = 500;
      const ageHours = Math.floor(random() * 9 * 24);
      const number = `ZYF-${String(index + 1).padStart(4, "0")}`;
      return {
        number,
        source: "STOREFRONT" as const,
        customerName: `Client test ${index + 1}`,
        phone: `0550000${String(index + 1).padStart(3, "0")}`,
        wilayaCode: WILAYAS[Math.floor(random() * WILAYAS.length)] ?? "16",
        deliveryType: random() < 0.7 ? ("HOME" as const) : ("STOPDESK" as const),
        items: [{ sku: "FIXTURE", title: "Article test", quantity: 1, unitPrice: total - shippingFee }],
        subtotal: total - shippingFee,
        shippingFee,
        total,
        status,
        confirmationAttempts: status === "UNREACHABLE" ? 1 : 0,
        createdAt: new Date(now - ageHours * 60 * 60 * 1000),
      };
    });
    await prisma.order.createMany({ data: rows });
    console.log(`fixtures: ${rows.length} fake orders written`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
