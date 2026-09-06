import { z } from "zod"

export const loginSchema = z.object({
  login: z.string().trim().min(1, "Введите логин").max(254, "Логин слишком длинный"),
  password: z.string().min(1, "Введите пароль").max(1024, "Пароль слишком длинный"),
})

export type LoginState = {
  login?: string
  errors?: { login?: string[]; password?: string[] }
  message?: string
}

export const ADMIN_SESSION_COOKIE = "kontur-admin-session"
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60
