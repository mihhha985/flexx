/* eslint-disable @next/next/no-img-element -- Product image URLs may use arbitrary CMS domains. */
//import Image from "next/image"
"use client"
import type { Product } from "@/src/entities/product/domain"
import { cn } from "@/src/shared/lib/utils"
import { motion } from "motion/react";
export function ProductVisual({
  product,
}: {
  product: Pick<Product, "name" | "imageUrl">
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg relative aspect-square size-full",
      )}
    >
      {product.imageUrl ? (
        <motion.img
          whileHover={{ scale: 1.1 }}
          whileDrag={{ scale: 0.9 }}
          src={product.imageUrl}
          alt={`Изображение товара ${product.name}`}
          className={"object-contain absolute inset-0"}
        />
      ) : (
        <div className="flex size-full items-center justify-center p-2 text-center text-xs text-muted-foreground">
          Фото пока нет
        </div>
      )}
    </div>
  )
}
