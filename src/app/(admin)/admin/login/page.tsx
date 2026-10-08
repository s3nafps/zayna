import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session-cookie";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getCurrentUser()) {
    redirect("/admin");
  }
  const t = await getTranslations("admin.login");
  return (
    <main className="flex min-h-screen items-center justify-center px-margin py-space-xl">
      <section className="flex w-full max-w-sm flex-col gap-6 rounded-xl border border-gold-border bg-surface-container-lowest p-6 shadow-atmospheric">
        <header className="flex flex-col gap-1">
          <p className="font-display text-headline-md font-semibold text-primary">Zayna</p>
          <h1 className="font-display text-headline-lg font-medium text-on-surface">{t("title")}</h1>
          <p className="font-sans text-body-sm text-on-surface-variant">{t("intro")}</p>
        </header>
        <LoginForm />
      </section>
    </main>
  );
}
