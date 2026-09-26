import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);
const PREFIXE_DEFAUT = `/${routing.defaultLocale}`;

export default function proxy(request: NextRequest) {
  // Le français est servi sans préfixe : `/fr/...` redirige de façon permanente
  // (308, là où next-intl répond 307) vers la forme canonique.
  const { pathname } = request.nextUrl;
  if (pathname === PREFIXE_DEFAUT || pathname.startsWith(`${PREFIXE_DEFAUT}/`)) {
    const cible = request.nextUrl.clone();
    cible.pathname = pathname.slice(PREFIXE_DEFAUT.length) || "/";
    return NextResponse.redirect(cible, 308);
  }
  return intl(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
