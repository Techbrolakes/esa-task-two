import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get("user");
  const path = request.nextUrl.pathname;
  const publicPaths = ["/"];

  if (userCookie && publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/companies", request.url));
  }

  if (!publicPaths.includes(path) && !userCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|sitemap.xml).*)"],
};
