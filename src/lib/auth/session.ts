import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { ROLES, type Role } from "./roles";

export const SESSION_COOKIE = "zayna_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 12;

const payloadSchema = z.object({
  uid: z.string().min(1),
  role: z.enum(ROLES),
  exp: z.number().int().positive(),
});
export type SessionPayload = z.infer<typeof payloadSchema>;

function sign(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

// Token format: base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload)).
export function createSessionToken(user: { uid: string; role: Role }, secret: string, nowMs: number): string {
  const payload: SessionPayload = {
    uid: user.uid,
    role: user.role,
    exp: Math.floor(nowMs / 1000) + SESSION_TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export function readSessionToken(
  token: string | undefined,
  secret: string,
  nowMs: number,
): SessionPayload | null {
  if (!token) {
    return null;
  }
  const dot = token.lastIndexOf(".");
  if (dot <= 0) {
    return null;
  }
  const body = token.slice(0, dot);
  const expected = Buffer.from(sign(body, secret));
  const given = Buffer.from(token.slice(dot + 1));
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  const result = payloadSchema.safeParse(parsed);
  if (!result.success || result.data.exp * 1000 <= nowMs) {
    return null;
  }
  return result.data;
}
