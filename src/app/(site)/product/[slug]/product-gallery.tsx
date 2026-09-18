"use client"

import { useState } from "react"
import { Button } from "react-aria-components"

import { cn } from "@/src/shared/lib/utils"

export function ProductGallery({
  product,
}: {
  product: { name: string; avatar: string; images: readonly string[] }
}) {
  const photos = Array.from(new Set([product.avatar, ...product.images])).filter(Boolean)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedPhoto = photos[selectedIndex]

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted">
        {selectedPhoto ? (
          // The configured S3 public URL is only known at runtime, so Next Image cannot be configured safely.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={selectedPhoto}
            alt={
              selectedIndex === 0
                ? `Главное изображение товара ${product.name}`
                : `Дополнительное изображение ${selectedIndex} товара ${product.name}`
            }
            className="absolute inset-0 size-full object-contain p-4 sm:p-6"
          />
        ) : (
          <div className="flex size-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Фото пока нет
          </div>
        )}
        {photos.length > 1 ? (
          <span
            className="absolute right-3 bottom-3 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground"
            aria-live="polite"
          >
            {selectedIndex + 1} из {photos.length}
          </span>
        ) : null}
      </div>

      {photos.length > 1 ? (
        <div
          className="grid grid-cols-4 gap-2 px-6 sm:grid-cols-5 md:grid-cols-6"
          role="group"
          aria-label="Фотографии товара"
        >
          {photos.map((photo, index) => {
            const isSelected = selectedIndex === index

            return (
              <Button
                key={photo}
                type="button"
                aria-label={
                  index === 0
                    ? "Показать главное изображение"
                    : `Показать дополнительное изображение ${index}`
                }
                aria-pressed={isSelected}
                onPress={() => setSelectedIndex(index)}
                className={({ isFocusVisible }) =>
                  cn(
                    "relative aspect-square w-full min-w-11 overflow-hidden rounded-lg border bg-muted outline-none transition-colors duration-150",
                    isSelected
                      ? "border-foreground ring-1 ring-foreground"
                      : "border-border hover:border-foreground",
                    isFocusVisible && "ring-2 ring-ring ring-offset-2 ring-offset-background",
                  )
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt=""
                  className="absolute inset-0 size-full object-contain p-1.5"
                />
              </Button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
