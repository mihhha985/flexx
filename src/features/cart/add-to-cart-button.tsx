"use client"
import { ShoppingBagIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/src/shared/ui/button"
import type { Product } from "@/src/entities/product/domain"
import { useCartStore } from "./cart-store"

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const ready = useCartStore((state) => state.ready)
  return (
    <Button
      size="sm"
      className="w-full"
      isDisabled={!ready || product.stock < 1}
      onPress={() => {
        addItem(product)
        toast.success("Товар добавлен в корзину", { description: product.name })
      }}
    >
      <ShoppingBagIcon data-icon="inline-start" />В корзину
    </Button>
  )
}
