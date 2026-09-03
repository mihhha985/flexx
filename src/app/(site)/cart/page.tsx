import { CartView } from "@/src/shared/components/cart-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Корзина — Контур",
  description: "Проверка товаров и быстрое оформление заказа без регистрации.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function CartPage() {
  return <CartView />
}
