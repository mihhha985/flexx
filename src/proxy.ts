import { NextResponse, type NextRequest } from "next/server"
import { ADMIN_SESSION_COOKIE } from "@/src/entities/admin/domain"
import { verifyAdminToken } from "@/src/entities/admin/lib/session-token"

export async function proxy(request: NextRequest) {
  const admin = await verifyAdminToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)
  const path = request.nextUrl.pathname
  const isPanel = path === "/panel" || path.startsWith("/panel/")
  const isAuth = path === "/auth" || path.startsWith("/auth/")
  let response: NextResponse

  if (isPanel && !admin) {
    response = NextResponse.redirect(new URL("/auth", request.url), 303)
    response.cookies.delete(ADMIN_SESSION_COOKIE)
  } else if (isAuth && admin && (request.method === "GET" || request.method === "HEAD")) {
    response = NextResponse.redirect(new URL("/panel", request.url), 303)
  } else {
    response = NextResponse.next()
  }
  response.headers.set("Cache-Control", "private, no-store")
  return response
}

export const config = {
  matcher: ["/panel/:path*", "/auth/:path*"],
}
