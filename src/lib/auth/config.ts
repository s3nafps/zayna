import { z } from "zod";

const secretSchema = z.string().min(32, "AUTH_SECRET must be at least 32 characters");

// Reads AUTH_SECRET from the environment. Throws when it is missing or too short.
export function getAuthSecret(env: Record<string, string | undefined> = process.env): string {
  const parsed = secretSchema.safeParse(env.AUTH_SECRET);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "AUTH_SECRET is invalid");
  }
  return parsed.data;
}
