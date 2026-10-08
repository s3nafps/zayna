import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Locale routing for the storefront. /admin, API routes and static assets are excluded.
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!admin|api|_next|_vercel|.*\\..*).*)"],
};
