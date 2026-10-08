import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/cairo/arabic-400.css";
import "@fontsource/cairo/arabic-600.css";
import "@fontsource/cairo/arabic-700.css";
import "@fontsource/amiri/arabic-400.css";
import "@fontsource/amiri/arabic-700.css";
import "material-symbols/outlined.css";
import "../../globals.css";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

// Back-office root. Not localized in the URL. The UI language defaults to French.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const messages = await getMessages();
  return (
    <html lang="fr" dir="ltr">
      <body className="flex min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <AdminSidebar />
          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
