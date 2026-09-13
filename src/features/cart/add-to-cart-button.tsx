"use client"
import Link from "next/link"
import { ShoppingBagIcon } from "lucide-react"
import { buttonVariants } from "@/src/shared/ui/button"
import type { Product } from "@/src/entities/product/domain"
import { cn } from "@/src/shared/lib/utils"

export function AddToCartButton({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(buttonVariants({ size: "sm" }), "w-full")}
    >
      <ShoppingBagIcon data-icon="inline-start" />
      Выбрать размер
    </Link>
  )
}
