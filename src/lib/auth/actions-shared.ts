// Pure helpers for the login flow. The server action itself lives in the login route.
export type LoginErrorKey = "invalid" | "rateLimited" | "server";

export function clientAddress(forwardedFor: string | null): string {
  return (forwardedFor ?? "unknown").split(",")[0]?.trim() || "unknown";
}
