import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Correspond à toutes les routes sauf les assets statiques et API
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
