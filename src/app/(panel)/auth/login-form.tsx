"use client"

import { useActionState } from "react"
import { loginAdmin } from "@/src/entities/admin/services/auth-service"

import { Button } from "@/src/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/src/shared/ui/field"
import { Input } from "@/src/shared/ui/input"

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, {})
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Вход администратора</CardTitle>
        <CardDescription>Введите логин и пароль, чтобы войти в панель управления.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-5" aria-busy={pending}>
          <FieldGroup>
            <Field data-invalid={Boolean(state.errors?.login)}>
              <FieldLabel htmlFor="login">Логин</FieldLabel>
              <Input
                id="login"
                name="login"
                type="text"
                placeholder="Логин администратора"
                defaultValue={state.login}
                maxLength={254}
                disabled={pending}
                aria-invalid={Boolean(state.errors?.login)}
                aria-describedby={state.errors?.login ? "login-error" : undefined}
                autoComplete="username"
                required
              />
              <FieldError id="login-error">{state.errors?.login?.[0]}</FieldError>
            </Field>
            <Field data-invalid={Boolean(state.errors?.password)}>
              <FieldLabel htmlFor="password">Пароль</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                maxLength={1024}
                disabled={pending}
                aria-invalid={Boolean(state.errors?.password)}
                aria-describedby={state.errors?.password ? "password-error" : undefined}
                required
              />
              <FieldError id="password-error">{state.errors?.password?.[0]}</FieldError>
            </Field>
          </FieldGroup>
          <FieldError>{state.message}</FieldError>
          <Button type="submit" className="w-full" isDisabled={pending}>
            {pending ? "Входим…" : "Войти"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <FieldDescription>Доступ только для сотрудников магазина.</FieldDescription>
      </CardFooter>
    </Card>
  )
}
