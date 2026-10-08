import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireUser } from "@/lib/auth/session-cookie";
import { logoutAction } from "../login/actions";

// Everything behind login. Unauthenticated visitors are redirected to /admin/login.
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const t = await getTranslations("admin");
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-gold-border bg-surface-container-lowest px-margin py-2">
          <p className="min-w-0 truncate font-sans text-label-md text-on-surface-variant">
            <span dir="ltr">{user.email}</span> · {t(`roles.${user.role}`)}
          </p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex min-h-tap items-center rounded-lg border border-gold-border px-3 font-sans text-label-md font-semibold text-on-surface hover:bg-blush"
            >
              {t("logout")}
            </button>
          </form>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
