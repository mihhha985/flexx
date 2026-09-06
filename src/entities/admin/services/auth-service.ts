"use server"

import { redirect } from "next/navigation"
import { loginSchema, type LoginState } from "@/src/entities/admin/domain"
import { verifyAdminCredentials } from "@/src/entities/admin/services/credentials-service"
import { clearLoginAttempts, takeLoginAttempt } from "@/src/entities/admin/lib/login-throttle"
import {
  createAdminSession,
  deleteAdminSession,
} from "@/src/entities/admin/services/session-service"

export async function loginAdmin(_state: LoginState, formData: FormData): Promise<LoginState> {
  const result = loginSchema.safeParse({
    login: formData.get("login"),
    password: formData.get("password"),
  })
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }
  const { login, password } = result.data
  if (!takeLoginAttempt()) {
    return { login, message: "Слишком много попыток входа. Повторите через 5 минут." }
  }
  try {
    if (!verifyAdminCredentials(login, password)) {
      return { login, message: "Неверный логин или пароль." }
    }
    await createAdminSession()
    clearLoginAttempts()
  } catch {
    console.error("Не удалось создать сессию администратора. Проверьте настройки авторизации.")
    return { login, message: "Вход временно недоступен. Попробуйте позже." }
  }
  redirect("/panel")
}

export async function logoutAdmin() {
  await deleteAdminSession()
  redirect("/auth")
}
