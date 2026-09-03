import {
  Button,
} from "@/src/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/src/shared/ui/field"
import { Input } from "@/src/shared/ui/input"

export default function AuthPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Вход в аккаунт</CardTitle>
        <CardDescription>
          Введите email и пароль, чтобы войти в панель управления.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Пароль</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full">
            Войти
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <FieldDescription>Доступ только для сотрудников магазина.</FieldDescription>
      </CardFooter>
    </Card>
  )
}
