import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_SECONDS } from "@/src/entities/admin/domain"
import { createAdminToken, verifyAdminToken } from "@/src/entities/admin/lib/session-token"

export async function createAdminSession() {
  const token = await createAdminToken()
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
    expires: new Date(Date.now() + ADMIN_SESSION_SECONDS * 1000),
  })
}

export async function getAdminSession() {
  return verifyAdminToken((await cookies()).get(ADMIN_SESSION_COOKIE)?.value)
}

// Call at the data/action boundary as well as on protected pages.
export async function requireAdmin() {
  const admin = await getAdminSession()
  if (!admin) redirect("/auth")
  return admin
}

export async function deleteAdminSession() {
  ;(await cookies()).delete(ADMIN_SESSION_COOKIE)
}
