import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.JWT_SECRET });
    console.log("Token:", token); 

    const { pathname, searchParams } = request.nextUrl;
    const redirected = searchParams.get("redirected");

    console.log("Current pathname:", pathname); 

    if (redirected) {
        return NextResponse.next();
    }

    if (PUBLIC_PAGES.includes(pathname)) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(
            `${request.nextUrl.origin}/login?redirected=true&message=You need to login to access this page`
        );
    }
    return NextResponse.next();
}
