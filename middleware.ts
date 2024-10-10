import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "./utils/db";
import { getToken } from "next-auth/jwt";
// import mongoose from "mongoose"; // Removed unused import

await connectDB();

const PUBLIC_PAGES = [
  "/",
  "/login",
  "/signup",
  "/api/auth/signin",
  "/api/auth/signup",
  "/api/auth/signout",
  "/about",
  "/contacts",
  "/services",
];
// const PRIVATE_PAGES = [ // Removed unused constant
//   "/api/",
//   "/create",
//   "/edit",
//   "/profile",
//   "/api/blog",
//   "/api/blogpost",
//   "/api/auth/signout",
//   "/dashboard",
// ];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  });
  const { pathname, searchParams } = request.nextUrl;

  const redirected = searchParams.get("redirected");

  if (redirected) {
    return NextResponse.next();
  }

  if (PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    // Redirect to login page with a query parameter
    return NextResponse.redirect(
      `${request.nextUrl.origin}/login?redirected=true&message=You need to login to access this page`
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/create",
    "/edit",
    "/profile",
    "/api/blog",
    "/api/blogpost",
    "/api/",
    "/dashboard",
    
  ],
};
