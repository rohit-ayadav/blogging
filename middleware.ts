import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/", "/about", "/contact", "/login", "/signup"];
  const adminRoutes = ["/dashboard/admin"];
  const protectedRoutes = ["/create", "/profile", "/dashboard", "/edit"];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set(
      "message",
      "You must be logged in to access this page."
    );
    return NextResponse.redirect(loginUrl);
  }

  const { name, email, role } = token;
  console.log(`\nName:${name}\nEmail:${email}\nRole:${role}`);

  if (
    !token &&
    (protectedRoutes.some((route) => pathname.startsWith(route)) ||
      adminRoutes.includes(pathname))
  ) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set(
      "message",
      "You must be logged in to access this page."
    );
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (adminRoutes.includes(pathname) && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/create",
    "/profile",
    "/dashboard/:path*",
    "/api/blog/:path*",
    "/edit/:path*",
    "/about",
    "/contact",
    "/login",
    "/signup"
  ]
};
