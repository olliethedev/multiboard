import { getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
        const redirectTo = request.nextUrl.pathname + request.nextUrl.search
        return NextResponse.redirect(new URL(`/auth/sign-in?redirectTo=${redirectTo}`, request.url))
    }

    return NextResponse.next()
}

export const config = {
    // Protected routes
    matcher: ["/boards/:path*", "/accept-invitation/:path*", "/posts/new", "/posts/:path/edit"]
}