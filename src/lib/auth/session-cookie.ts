import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { getAuthSecret } from "./config";
import { canAccess, type Role } from "./roles";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken, readSessionToken } from "./session";

export type CurrentUser = { id: string; email: string; role: Role };

export async function setSessionCookie(user: { id: string; role: Role }): Promise<void> {
  const token = createSessionToken({ uid: user.id, role: user.role }, getAuthSecret(), Date.now());
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

// The cookie only says who the user was when it was issued. The database confirms the account still
// exists and the role has not changed.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const jar = await cookies();
  const payload = readSessionToken(jar.get(SESSION_COOKIE)?.value, getAuthSecret(), Date.now());
  if (!payload) {
    return null;
  }
  const user = await getPrisma().user.findUnique({
    where: { id: payload.uid },
    select: { id: true, email: true, role: true },
  });
  if (!user || user.role !== payload.role) {
    return null;
  }
  return user;
}

export async function requireUser(allowed?: readonly Role[]): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }
  if (allowed && !canAccess(user.role, allowed)) {
    redirect("/admin");
  }
  return user;
}
