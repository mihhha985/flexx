"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createValidatedOrder } from "@/src/entities/order/services/orderService"
import {
  ArrowRightIcon,
  MinusIcon,
  PackageCheckIcon,
  PlusIcon,
  ShoppingBagIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { selectCartItemCount, selectCartTotal, useCartStore } from "@/src/store/cart-store"
import { CartSkeleton } from "@/src/shared/components/skeleton/cart-skeleton"
import { ProductVisual } from "@/src/shared/components/product-visual"
import { formatPrice } from "@/src/shared/lib/catalog"
import { cn } from "@/src/shared/lib/utils"
import { Badge } from "@/src/shared/ui/badge"
import { Button, buttonVariants } from "@/src/shared/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/src/shared/ui/empty"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet, FieldLegend } from "@/src/shared/ui/field"
import { Input } from "@/src/shared/ui/input"
import { Separator } from "@/src/shared/ui/separator"
import { Textarea } from "@/src/shared/ui/textarea"

type OrderDraft = {
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

export function CartView() {
  const ready = useCartStore((state) => state.ready)
  const items = useCartStore((state) => state.items)
  const itemCount = useCartStore(selectCartItemCount)
  const total = useCartStore(selectCartTotal)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const [draft, setDraft] = React.useState(initialDraft)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isRedirecting, setIsRedirecting] = React.useState(false)
  const submitting = React.useRef(false)

  function updateDraft(field: keyof OrderDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  async function submitOrder(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setIsSubmitting(true)

    try {
      const result = await createValidatedOrder({
        ...draft,
        items: items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
      })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      setIsRedirecting(true)
      clearCart()
      router.replace(`/order/${result.publicId}/thanks`)
    } catch {
      toast.error("Не удалось оформить заказ. Проверьте соединение и попробуйте ещё раз.")
    } finally {
      submitting.current = false
      setIsSubmitting(false)
    }
  }

  if (!ready || isRedirecting) return <CartSkeleton />

  if (items.length === 0) {
    return (
      <Empty className="min-h-[60vh] border">
        <EmptyHeader>
          <EmptyMedia variant="icon"><ShoppingBagIcon /></EmptyMedia>
          <EmptyTitle>Корзина пока пуста</EmptyTitle>
          <EmptyDescription>Добавьте товары из каталога — они сохранятся на этом устройстве.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/catalog" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
            Перейти в каталог <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Badge variant="secondary">{itemCount} шт.</Badge>
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Корзина</h1>
          <p className="text-muted-foreground">Проверьте товары и заполните данные для связи.</p>
        </div>
        <Button variant="ghost" size="sm" isDisabled={isSubmitting} onPress={clearCart}>
          <Trash2Icon data-icon="inline-start" /> Очистить
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-3">
          {items.map(({ product, quantity }) => (
            <Card key={product.id} size="sm">
              <CardContent className="flex gap-3">
                <ProductVisual product={product} compact />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div>
                    <Link href={`/product/${product.slug}`} className="font-medium hover:underline">{product.name}</Link>
                    {product.category && <p className="text-sm text-muted-foreground">{product.category.name}</p>}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1" aria-label={`Количество товара ${product.name}`}>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label="Уменьшить"
                        isDisabled={isSubmitting || quantity <= 1}
                        onPress={() => updateQuantity(product.id, quantity - 1)}
                      >
                        <MinusIcon />
                      </Button>
                      <span className="min-w-7 text-center text-sm font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label="Увеличить"
                        isDisabled={isSubmitting || quantity >= product.stock}
                        onPress={() => updateQuantity(product.id, quantity + 1)}
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                    <p className="font-medium">{formatPrice(product.price * quantity)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between gap-3">
                <span className="text-xs text-muted-foreground">{formatPrice(product.price)} за шт.</span>
                <Button variant="ghost" size="xs" isDisabled={isSubmitting} onPress={() => removeItem(product.id)}>
                  <Trash2Icon data-icon="inline-start" /> Удалить
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <form onSubmit={submitOrder} aria-busy={isSubmitting}>
          <Card>
            <CardHeader>
              <CardTitle>Оформление</CardTitle>
              <CardDescription>Заказ без регистрации. Поля соответствуют данным получателя.</CardDescription>
              <CardAction><Badge variant="outline">1 шаг</Badge></CardAction>
            </CardHeader>
            <CardContent>
              <FieldSet disabled={isSubmitting}>
                <FieldLegend className="sr-only">Контактные данные и адрес доставки</FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="customerName">Имя</FieldLabel>
                    <Input id="customerName" name="customerName" autoComplete="name" required value={draft.customerName} onChange={(event) => updateDraft("customerName", event.target.value)} placeholder="Как к вам обращаться" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="customerPhone">Телефон</FieldLabel>
                    <Input id="customerPhone" name="customerPhone" type="tel" autoComplete="tel" required value={draft.customerPhone} onChange={(event) => updateDraft("customerPhone", event.target.value)} placeholder="+7 999 000-00-00" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="customerEmail">Почта</FieldLabel>
                    <Input id="customerEmail" name="customerEmail" type="email" autoComplete="email" required value={draft.customerEmail} onChange={(event) => updateDraft("customerEmail", event.target.value)} placeholder="mail@example.ru" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="shippingAddress">Адрес доставки</FieldLabel>
                    <Input id="shippingAddress" name="shippingAddress" autoComplete="street-address" required value={draft.shippingAddress} onChange={(event) => updateDraft("shippingAddress", event.target.value)} placeholder="Город, улица, дом, квартира" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="comment">Комментарий</FieldLabel>
                    <Textarea id="comment" name="comment" value={draft.comment} onChange={(event) => updateDraft("comment", event.target.value)} placeholder="Домофон, удобное время или пожелания" />
                    <FieldDescription>Необязательно</FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldSet>
              <Separator className="my-5" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Товары, {itemCount} шт.</span><span>{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Итого</span><span className="text-xl font-medium">{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" size="lg" className="w-full" isDisabled={isSubmitting}>
                <PackageCheckIcon data-icon="inline-start" /> {isSubmitting ? "Оформляем заказ…" : "Оформить заказ"}
              </Button>
              <p className="text-xs text-muted-foreground">Оплату согласуем после подтверждения заказа.</p>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
