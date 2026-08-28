import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookieName } from "@/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

function preferredLocale(request: NextRequest) {
  const savedLocale = request.cookies.get(localeCookieName)?.value;

  if (isLocale(savedLocale)) {
    return savedLocale;
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const browserLocale = acceptLanguage
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .find((part) => part?.startsWith("es") || part?.startsWith("en"));

  if (browserLocale?.startsWith("en")) {
    return "en";
  }

  if (browserLocale?.startsWith("es")) {
    return "es";
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathLocale = pathname.split("/")[1];

  if (isLocale(pathLocale)) {
    const response = NextResponse.next();
    response.cookies.set(localeCookieName, pathLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
