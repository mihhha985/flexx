import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAdminSession } from "@/src/entities/admin/services/sessionService"
import { LoginForm } from "./login-form"

export const metadata: Metadata = { title: "Вход администратора — Контур" }

export default async function AuthPage() {
  if (await getAdminSession()) redirect("/panel")
  return <LoginForm />
}
