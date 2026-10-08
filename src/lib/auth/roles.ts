// Roles mirror the Prisma UserRole enum. Brief §2: owners see API settings. Agents confirm and ship.
export const ROLES = ["OWNER", "AGENT"] as const;
export type Role = (typeof ROLES)[number];

export function canAccess(role: Role, allowed: readonly Role[]): boolean {
  return allowed.includes(role);
}
