// Idempotent seed: safe to run repeatedly.
// Wilayas come from data/wilayas.json. Communes come from data/communes.json when it exists (PLAN.md, D3).
import { existsSync, readFileSync } from "node:fs";
import { createPrismaClient } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth/password";

type WilayaSeed = { code: string; nameFr: string; nameAr: string };
type CommuneSeed = { wilayaCode: string; nameFr: string; nameAr: string; postalCode?: string | null };

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(new URL(`../data/${name}`, import.meta.url), "utf8")) as T;
}

function assertWilayas(list: WilayaSeed[]): void {
  if (list.length !== 58) {
    throw new Error(`expected 58 wilayas, found ${list.length}`);
  }
  list.forEach((w, index) => {
    const expected = String(index + 1).padStart(2, "0");
    if (w.code !== expected) {
      throw new Error(`wilaya code out of order: expected ${expected}, found ${w.code}`);
    }
  });
}

// Creates the owner account from ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD. Existing accounts are left alone,
// so re-running the seed never changes a password.
async function seedOwner(prisma: ReturnType<typeof createPrismaClient>): Promise<void> {
  const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !password) {
    console.log("owner: ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD not set, skipped");
    return;
  }
  if (password.length < 12) {
    throw new Error("ADMIN_SEED_PASSWORD must be at least 12 characters");
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("owner: account already exists, left unchanged");
    return;
  }
  await prisma.user.create({ data: { email, passwordHash: await hashPassword(password), role: "OWNER" } });
  console.log("owner: account created");
}

async function main(): Promise<void> {
  const prisma = createPrismaClient();
  try {
    const { wilayas } = readJson<{ wilayas: WilayaSeed[] }>("wilayas.json");
    assertWilayas(wilayas);
    for (const w of wilayas) {
      await prisma.wilaya.upsert({
        where: { code: w.code },
        update: { nameFr: w.nameFr, nameAr: w.nameAr },
        create: { code: w.code, nameFr: w.nameFr, nameAr: w.nameAr },
      });
    }
    console.log(`wilayas: ${wilayas.length} upserted`);

    await seedOwner(prisma);

    const communesFile = new URL("../data/communes.json", import.meta.url);
    if (!existsSync(communesFile)) {
      console.log("communes: data/communes.json not present, skipped (see PLAN.md, D3)");
      return;
    }
    const { communes } = readJson<{ communes: CommuneSeed[] }>("communes.json");
    for (const c of communes) {
      await prisma.commune.upsert({
        where: { wilayaCode_nameFr: { wilayaCode: c.wilayaCode, nameFr: c.nameFr } },
        update: { nameAr: c.nameAr, postalCode: c.postalCode ?? null },
        create: {
          wilayaCode: c.wilayaCode,
          nameFr: c.nameFr,
          nameAr: c.nameAr,
          postalCode: c.postalCode ?? null,
        },
      });
    }
    console.log(`communes: ${communes.length} upserted`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
