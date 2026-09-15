import { CartView } from "@/src/features/cart/cart-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Корзина",
  description: "Проверка товаров и быстрое оформление заказа без регистрации.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function CartPage() {
  return <CartView />
}
