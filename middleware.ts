// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const PUBLIC_ROUTES = ["/", "/login", "/api/auth/signin", "/api/auth/signout"];
// const PRIVATE_ROUTES = ["/dashboard", "/create", "/blogs"];

// export async function middleware(request: NextRequest) {
//     const { pathname, searchParams } = request.nextUrl;
//     const token = await getToken({ req: request });

//     const redirected = searchParams.get("redirected");

//     if (redirected) {
//         return NextResponse.next();
//     }

//     if (PUBLIC_ROUTES.includes(pathname)) {
//         return NextResponse.next();
//     }

//     if (PRIVATE_ROUTES.includes(pathname) && !token) {
//         return NextResponse.redirect(new URL(`/login?redirected=true&message=You need to login to access this page`, request.url), {
//             status: 302,
//             headers: {
//                 "Content-Type": "text/plain",
//             },
//         });
//     }

//     return NextResponse.next();
// }
