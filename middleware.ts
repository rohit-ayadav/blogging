import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const loginUrl = new URL("/login", req.url);

  const publicRoutes = ["/login", "/signup", "/reset-password", "/forgot-password"];
  const adminRoutes = ["/dashboard/admin"];
  const protectedRoutes = ["/create", "/profile", "/dashboard", "/edit", "/edit/[id]", "/dashboard/admin", "/signout"];

  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  // if token is available and user tries to access public routes, redirect to dashboard
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // if not token and user tries to access protected routes, redirect to login
  if (!token && (protectedRoutes.some((route) => pathname.startsWith(route)) || adminRoutes.includes(pathname))) {
    loginUrl.searchParams.set(
      "message",
      "You must be logged in to access this page."
    );
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // if token is available and user tries to access login, signup, reset-password, forgot-password routes,signout redirect to dashboard
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  // if token is available and user tries to access admin routes, redirect to
  if (adminRoutes.includes(pathname) && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/create",
    "/profile",
    "/dashboard",
    "/edit",
    "/edit/[id]",
    "/dashboard/admin",
    "/login",
    "/signup",
    "/reset-password",
    "/forgot-password",
  ],
};