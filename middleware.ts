import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })
    const { pathname } = req.nextUrl

    console.log("this is in the middlewate",pathname)

    if (token) {
        if (token.instituteId) {
            if (pathname.startsWith("/details")) {
                return NextResponse.redirect("http://localhost:3000/home")
            }
        }else {
            if (pathname.startsWith("/details")) {
                return NextResponse.next()
            }
            return NextResponse.redirect("http://localhost:3000/details")
        }
        return NextResponse.next()
    }

    if (pathname.startsWith("/signin")) {
        return NextResponse.next()
    }

    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/signin"
    redirectUrl.searchParams.set("callback", pathname)
    return NextResponse.redirect(redirectUrl)



}

export const config = {
    matcher: ["/home/:path*", "/details", "/vote/:path*", "/liveleaderboard", "/profile", "/participate", "/approvals"]
}