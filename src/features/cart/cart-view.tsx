"use client"
import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRightIcon, ShoppingBagIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { createValidatedOrder } from "@/src/entities/order/services/order-service"
import { selectCartItemCount, selectCartTotal, useCartStore } from "./cart-store"
import { CartSkeleton } from "./cart-skeleton"
import { CartItemRow } from "./cart-item-row"
import { CheckoutForm, type OrderDraft } from "./checkout-form"
import { cn } from "@/src/shared/lib/utils"
import { Badge } from "@/src/shared/ui/badge"
import { Button, buttonVariants } from "@/src/shared/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/shared/ui/empty"

export function CartView() {
  const ready = useCartStore((state) => state.ready)
  const items = useCartStore((state) => state.items)
  const itemCount = useCartStore(selectCartItemCount)
  const total = useCartStore(selectCartTotal)
  const clearCart = useCartStore((state) => state.clearCart)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isRedirecting, setIsRedirecting] = React.useState(false)
  const submitting = React.useRef(false)

  async function submitOrder(draft: OrderDraft) {
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
          <EmptyMedia variant="icon">
            <ShoppingBagIcon />
          </EmptyMedia>
          <EmptyTitle>Корзина пока пуста</EmptyTitle>
          <EmptyDescription>
            Добавьте товары из каталога — они сохранятся на этом устройстве.
          </EmptyDescription>
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
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} isSubmitting={isSubmitting} />
          ))}
        </div>

        <CheckoutForm
          itemCount={itemCount}
          total={total}
          isSubmitting={isSubmitting}
          onSubmit={submitOrder}
        />
      </div>
    </div>
  )
}
