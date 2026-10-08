import { describe, expect, it } from "vitest";
import { getAuthSecret } from "./config";
import { hashPassword, verifyPassword } from "./password";
import { createRateLimiter } from "./rate-limit";
import { SESSION_TTL_SECONDS, createSessionToken, readSessionToken } from "./session";
import { canAccess } from "./roles";

const SECRET = "x".repeat(32);
const NOW = Date.UTC(2026, 9, 8, 12, 0, 0);

describe("passwords", () => {
  it("verifies the right password and rejects the wrong one", async () => {
    const stored = await hashPassword("correct horse battery");
    expect(await verifyPassword("correct horse battery", stored)).toBe(true);
    expect(await verifyPassword("wrong password", stored)).toBe(false);
  });

  it("salts each hash, so the same password never gives the same stored value", async () => {
    const a = await hashPassword("same-password-here");
    const b = await hashPassword("same-password-here");
    expect(a).not.toBe(b);
  });

  it("rejects a malformed stored value without throwing", async () => {
    expect(await verifyPassword("anything", "not-a-hash")).toBe(false);
  });
});

describe("session tokens", () => {
  it("round-trips a valid token", () => {
    const token = createSessionToken({ uid: "u1", role: "OWNER" }, SECRET, NOW);
    expect(readSessionToken(token, SECRET, NOW + 1000)).toMatchObject({ uid: "u1", role: "OWNER" });
  });

  it("rejects a token signed with another secret", () => {
    const token = createSessionToken({ uid: "u1", role: "OWNER" }, SECRET, NOW);
    expect(readSessionToken(token, "y".repeat(32), NOW)).toBeNull();
  });

  it("rejects a token whose payload was edited", () => {
    const token = createSessionToken({ uid: "u1", role: "AGENT" }, SECRET, NOW);
    const [, signature] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ uid: "u1", role: "OWNER", exp: 9999999999 })).toString("base64url");
    expect(readSessionToken(`${forged}.${signature}`, SECRET, NOW)).toBeNull();
  });

  it("rejects an expired token", () => {
    const token = createSessionToken({ uid: "u1", role: "OWNER" }, SECRET, NOW);
    expect(readSessionToken(token, SECRET, NOW + (SESSION_TTL_SECONDS + 1) * 1000)).toBeNull();
  });

  it("rejects missing or garbage input", () => {
    expect(readSessionToken(undefined, SECRET, NOW)).toBeNull();
    expect(readSessionToken("nodot", SECRET, NOW)).toBeNull();
    expect(readSessionToken("a.b", SECRET, NOW)).toBeNull();
  });
});

describe("rate limiter", () => {
  it("blocks after the limit and frees the key when the window ends", () => {
    const limiter = createRateLimiter({ maxAttempts: 2, windowMs: 1000 });
    limiter.recordFailure("k", NOW);
    limiter.recordFailure("k", NOW);
    expect(limiter.check("k", NOW + 10).allowed).toBe(false);
    expect(limiter.check("k", NOW + 1000).allowed).toBe(true);
  });

  it("clears on reset, for example after a successful login", () => {
    const limiter = createRateLimiter({ maxAttempts: 1, windowMs: 1000 });
    limiter.recordFailure("k", NOW);
    limiter.reset("k");
    expect(limiter.check("k", NOW).allowed).toBe(true);
  });
});

describe("roles", () => {
  it("lets only listed roles through", () => {
    expect(canAccess("OWNER", ["OWNER"])).toBe(true);
    expect(canAccess("AGENT", ["OWNER"])).toBe(false);
    expect(canAccess("AGENT", ["OWNER", "AGENT"])).toBe(true);
  });
});

describe("AUTH_SECRET", () => {
  it("requires at least 32 characters", () => {
    expect(() => getAuthSecret({ AUTH_SECRET: "short" })).toThrow(/at least 32/);
    expect(() => getAuthSecret({})).toThrow();
    expect(getAuthSecret({ AUTH_SECRET: "x".repeat(32) })).toHaveLength(32);
  });
});
