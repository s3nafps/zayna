import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

// scrypt via Node's built-in crypto. No third-party auth package (decision E2 in PLAN.md).
type ScryptFn = (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;
const scrypt = promisify(scryptCallback) as ScryptFn;

const COST = { N: 16384, r: 8, p: 1 } as const;
const KEY_LENGTH = 64;
const SALT_BYTES = 16;
const MAX_MEMORY = 64 * 1024 * 1024;

// Format: scrypt$N$r$p$saltBase64$hashBase64
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const hash = await scrypt(password, salt, KEY_LENGTH, { ...COST, maxmem: MAX_MEMORY });
  return ["scrypt", COST.N, COST.r, COST.p, salt.toString("base64"), hash.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, n, r, p, saltBase64, hashBase64] = stored.split("$");
  if (algorithm !== "scrypt" || !n || !r || !p || !saltBase64 || !hashBase64) {
    return false;
  }
  const expected = Buffer.from(hashBase64, "base64");
  const actual = await scrypt(password, Buffer.from(saltBase64, "base64"), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: MAX_MEMORY,
  });
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// Unknown emails still run one scrypt, so response time does not reveal which accounts exist.
let dummyHash: Promise<string> | undefined;
export async function verifyAgainstDummy(password: string): Promise<false> {
  dummyHash ??= hashPassword("zayna-timing-equalizer");
  await verifyPassword(password, await dummyHash);
  return false;
}
