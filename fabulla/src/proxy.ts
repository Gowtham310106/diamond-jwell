import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

/**
 * Gate for the admin panel and its API.
 *
 * Anything under /admin (except the login screen) needs a valid session
 * cookie; pages redirect to login with the original path preserved, API
 * routes answer 401. The public site and the public API are untouched.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isApi = pathname.startsWith("/api/admin");

  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (isLogin) {
    // Already signed in: skip the form.
    if (session) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (session) return NextResponse.next();

  if (isApi) {
    return NextResponse.json({ error: "Sign in to the admin panel first." }, { status: 401 });
  }

  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
