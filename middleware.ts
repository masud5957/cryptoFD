import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
)

const protectedRoutes = ["/dashboard", "/admin"]
const authRoutes = ["/auth/login", "/auth/sign-up", "/auth/forgot-password"]

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth_token")?.value

  console.log("[v0] Middleware:", pathname, "Token exists:", !!token)

  // Check if accessing protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    if (!token) {
      console.log("[v0] No token, redirecting to login")
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    const isValid = await verifyToken(token)
    console.log("[v0] Token valid:", isValid)
    if (!isValid) {
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL("/auth/login", request.url))
      response.cookies.delete("auth_token")
      return response
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    const isValid = await verifyToken(token)
    if (isValid) {
      console.log("[v0] Valid token on auth page, redirecting to dashboard")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
