"use client"
import { useState } from "react"
import { PackageCheckIcon } from "lucide-react"
import { formatPrice } from "@/src/shared/lib/format-price"
import { Badge } from "@/src/shared/ui/badge"
import { Button } from "@/src/shared/ui/button"
import {
  Card,
  CardAction,
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
  FieldSet,
  FieldLegend,
} from "@/src/shared/ui/field"
import { Input } from "@/src/shared/ui/input"
import { Separator } from "@/src/shared/ui/separator"
import { Textarea } from "@/src/shared/ui/textarea"
export type OrderDraft = {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  comment: string
}

const initialDraft: OrderDraft = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  shippingAddress: "",
  comment: "",
}

export function CheckoutForm({
  itemCount,
  total,
  isSubmitting,
  onSubmit,
}: {
  itemCount: number
  total: number
  isSubmitting: boolean
  onSubmit: (draft: OrderDraft) => Promise<void>
}) {
  const [draft, setDraft] = useState(initialDraft)
  function updateDraft(field: keyof OrderDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void onSubmit(draft)
      }}
      aria-busy={isSubmitting}
    >
      <Card>
        <CardHeader>
          <CardTitle>Оформление</CardTitle>
          <CardDescription>
            Заказ без регистрации. Поля соответствуют данным получателя.
          </CardDescription>
          <CardAction>
            <Badge variant="outline">1 шаг</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldSet disabled={isSubmitting}>
            <FieldLegend className="sr-only">Контактные данные и адрес доставки</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="customerName">Имя</FieldLabel>
                <Input
                  id="customerName"
                  name="customerName"
                  autoComplete="name"
                  required
                  value={draft.customerName}
                  onChange={(event) => updateDraft("customerName", event.target.value)}
                  placeholder="Как к вам обращаться"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="customerPhone">Телефон</FieldLabel>
                <Input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={draft.customerPhone}
                  onChange={(event) => updateDraft("customerPhone", event.target.value)}
                  placeholder="+7 999 000-00-00"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="customerEmail">Почта</FieldLabel>
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  autoComplete="email"
                  required
                  value={draft.customerEmail}
                  onChange={(event) => updateDraft("customerEmail", event.target.value)}
                  placeholder="mail@example.ru"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="shippingAddress">Адрес доставки</FieldLabel>
                <Input
                  id="shippingAddress"
                  name="shippingAddress"
                  autoComplete="street-address"
                  required
                  value={draft.shippingAddress}
                  onChange={(event) => updateDraft("shippingAddress", event.target.value)}
                  placeholder="Город, улица, дом, квартира"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="comment">Комментарий</FieldLabel>
                <Textarea
                  id="comment"
                  name="comment"
                  value={draft.comment}
                  onChange={(event) => updateDraft("comment", event.target.value)}
                  placeholder="Домофон, удобное время или пожелания"
                />
                <FieldDescription>Необязательно</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
          <Separator className="my-5" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Товары, {itemCount} шт.</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Итого</span>
              <span className="text-xl font-medium">{formatPrice(total)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" size="lg" className="w-full" isDisabled={isSubmitting}>
            <PackageCheckIcon data-icon="inline-start" />{" "}
            {isSubmitting ? "Оформляем заказ…" : "Оформить заказ"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Оплату согласуем после подтверждения заказа.
          </p>
        </CardFooter>
      </Card>
    </form>
  )
}
