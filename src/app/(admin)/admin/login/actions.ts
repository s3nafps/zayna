"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clientAddress, type LoginErrorKey } from "@/lib/auth/actions-shared";
import { verifyAgainstDummy, verifyPassword } from "@/lib/auth/password";
import { loginLimiter } from "@/lib/auth/rate-limit";
import { clearSessionCookie, setSessionCookie } from "@/lib/auth/session-cookie";
import { getPrisma } from "@/lib/prisma";

export type LoginState = { error: LoginErrorKey } | null;

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
});

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) {
    return { error: "invalid" };
  }
  const { email, password } = parsed.data;

  const requestHeaders = await headers();
  const key = `${clientAddress(requestHeaders.get("x-forwarded-for"))}|${email}`;
  const now = Date.now();
  if (!loginLimiter.check(key, now).allowed) {
    return { error: "rateLimited" };
  }

  const user = await getPrisma().user.findUnique({ where: { email } });
  const passwordOk = user
    ? await verifyPassword(password, user.passwordHash)
    : await verifyAgainstDummy(password);
  if (!user || !passwordOk) {
    loginLimiter.recordFailure(key, now);
    return { error: "invalid" };
  }

  loginLimiter.reset(key);
  await setSessionCookie({ id: user.id, role: user.role });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}
