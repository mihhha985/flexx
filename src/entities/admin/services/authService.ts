"use server"

import { redirect } from "next/navigation"
import { loginSchema, type LoginState } from "../domain"
import { verifyAdminCredentials } from "../repository/adminRepository"
import { clearLoginAttempts, takeLoginAttempt } from "../lib/loginThrottle"
import { createAdminSession, deleteAdminSession } from "./sessionService"

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
