//import Image from "next/image"
"use client"
import type { Product } from "@/src/entities/product/domain"
import { cn } from "@/src/shared/lib/utils"
import { motion } from "motion/react"
export function ProductVisual({
  product,
  compact = false,
}: {
  product: Pick<Product, "name" | "avatar">
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-lg bg-muted",
        compact ? "size-20 shrink-0" : "size-full",
      )}
    >
      {product.avatar ? (
        <motion.img
          whileHover={{ scale: 1.1 }}
          whileDrag={{ scale: 0.9 }}
          src={product.avatar}
          alt={`Изображение товара ${product.name}`}
          className="absolute inset-0 size-full object-contain"
        />
      ) : (
        <div className="flex size-full items-center justify-center p-2 text-center text-xs text-muted-foreground">
          Фото пока нет
        </div>
      )}
    </div>
  )
}
