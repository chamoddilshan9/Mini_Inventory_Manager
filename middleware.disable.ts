import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login page and API auth routes
  if (pathname === "/login" || pathname.startsWith("/api/auth/login")) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get("auth-token")?.value

  if (!token || !verifyToken(token)) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/auth/login|login|_next/static|_next/image|favicon.ico).*)"],
}
