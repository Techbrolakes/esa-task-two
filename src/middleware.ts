import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get("user");

  const path = request.nextUrl.pathname;

  const publicPaths = ["/"];

  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  if (!userCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|sitemap.xml).*)"],
};
