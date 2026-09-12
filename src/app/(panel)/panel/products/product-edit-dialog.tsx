"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Button as AriaButton,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ComboBox,
  Input as AriaInput,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"
import { createProductAction } from "@/src/entities/product/services/manage-product-service"
import { updateProductAction } from "@/src/entities/product/services/update-product-service"
import { productColors, productSizes } from "@/src/entities/product/domain"
import type { AdminCategory } from "@/src/entities/category/services/admin-category-service"
import type { AdminProduct } from "@/src/entities/product/services/admin-product-service"
import { Button } from "@/src/shared/ui/button"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/src/shared/ui/field"
import { Input } from "@/src/shared/ui/input"
import { Textarea } from "@/src/shared/ui/textarea"
import { cn } from "@/src/shared/lib/utils"

type ProductEditDialogProps = {
  product?: AdminProduct
  categories: AdminCategory[]
  onOpenChange: (isOpen: boolean) => void
}

export function ProductEditDialog({ product, categories, onOpenChange }: ProductEditDialogProps) {
  const router = useRouter()
  const [color, setColor] = useState(product?.detail?.color ?? productColors[0].value)
  const [sizes, setSizes] = useState(
    () => new Set((product?.detail?.size ?? []).map((size) => String(size))),
  )
  const [sizeSearch, setSizeSearch] = useState("")
  const [state, action, pending] = useActionState(
    product ? updateProductAction : createProductAction,
    {},
  )

  useEffect(() => {
    if (!state.success) return

    toast.success(state.message)
    router.refresh()
    onOpenChange(false)
  }, [onOpenChange, router, state.message, state.success])

  return (
    <Dialog
      isOpen
      onOpenChange={(open) => {
        if (!pending) onOpenChange(open)
      }}
      isDismissable={!pending}
      isKeyboardDismissDisabled={pending}
      className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl"
      showCloseButton={!pending}
    >
      <form action={action} className="contents" aria-busy={pending}>
        {product && <input type="hidden" name="id" value={product.id} />}
        <DialogHeader>
          <DialogTitle>{product ? "Редактировать товар" : "Создать товар"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Измените данные товара и его характеристики, затем сохраните изменения."
              : "Заполните данные и характеристики. После создания товар появится в каталоге."}
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(state.errors?.name)}>
            <FieldLabel htmlFor="product-name">Название</FieldLabel>
            <Input
              autoFocus
              id="product-name"
              name="name"
              defaultValue={product?.name ?? ""}
              maxLength={200}
              disabled={pending}
              aria-invalid={Boolean(state.errors?.name)}
              required
            />
            <FieldError>{state.errors?.name?.[0]}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.slug)}>
            <FieldLabel htmlFor="product-slug">Адрес в каталоге (слаг)</FieldLabel>
            <Input
              id="product-slug"
              name="slug"
              defaultValue={product?.slug ?? ""}
              maxLength={200}
              disabled={pending}
              aria-invalid={Boolean(state.errors?.slug)}
              required
            />
            <FieldError>{state.errors?.slug?.[0]}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.categoryId)}>
            <FieldLabel htmlFor="product-category">Категория</FieldLabel>
            <select
              id="product-category"
              name="categoryId"
              defaultValue={String(product?.categoryId ?? categories[0]?.id ?? "")}
              disabled={pending}
              aria-invalid={Boolean(state.errors?.categoryId)}
              className="ui-focus h-12 w-full min-w-0 rounded-md border border-input bg-background px-3 text-base outline-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FieldError>{state.errors?.categoryId?.[0]}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.price)}>
            <FieldLabel htmlFor="product-price">Цена</FieldLabel>
            <Input
              id="product-price"
              name="price"
              type="number"
              defaultValue={String(product?.price ?? 0)}
              min="0"
              max="999999999.99"
              step="0.01"
              disabled={pending}
              aria-invalid={Boolean(state.errors?.price)}
              required
            />
            <FieldError>{state.errors?.price?.[0]}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.stock)}>
            <FieldLabel htmlFor="product-stock">Остаток</FieldLabel>
            <Input
              id="product-stock"
              name="stock"
              type="number"
              defaultValue={String(product?.stock ?? 0)}
              min="0"
              max="2147483647"
              step="1"
              disabled={pending}
              aria-invalid={Boolean(state.errors?.stock)}
              required
            />
            <FieldError>{state.errors?.stock?.[0]}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.imageUrl)}>
            <FieldLabel htmlFor="product-image-url">Ссылка на изображение</FieldLabel>
            <Input
              id="product-image-url"
              name="imageUrl"
              type="url"
              defaultValue={product?.imageUrl ?? ""}
              maxLength={2048}
              disabled={pending}
              aria-invalid={Boolean(state.errors?.imageUrl)}
              placeholder="https://example.com/image.jpg"
            />
            <FieldError>{state.errors?.imageUrl?.[0]}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.color)}>
            <FieldLabel>Цвет</FieldLabel>
            <input name="color" type="hidden" value={color} />
            <ColorSwatchPicker
              aria-label="Цвет"
              value={color}
              onChange={(selectedColor) => {
                const nextColor = productColors.find(
                  (option) => option.value === selectedColor.toString("hex"),
                )
                if (nextColor) setColor(nextColor.value)
              }}
              className="flex flex-wrap gap-2"
            >
              {productColors.map((option) => (
                <ColorSwatchPickerItem
                  key={option.value}
                  color={option.value}
                  aria-label={option.label}
                  isDisabled={pending}
                  className={({ isSelected }) =>
                    cn(
                      "ui-focus relative flex size-11 items-center justify-center rounded-md border border-input outline-none transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
                      isSelected &&
                        "border-foreground ring-2 ring-ring ring-offset-2 ring-offset-background",
                    )
                  }
                >
                  {({ isSelected }) => (
                    <>
                      <ColorSwatch color={option.value} className="size-7 rounded-sm" />
                      {isSelected && (
                        <CheckIcon
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none absolute size-4",
                            option.value === "#FFFFFF" || option.value === "#808080"
                              ? "text-foreground"
                              : "text-primary-foreground",
                          )}
                        />
                      )}
                    </>
                  )}
                </ColorSwatchPickerItem>
              ))}
            </ColorSwatchPicker>
            <p className="text-sm text-muted-foreground">
              {productColors.find((option) => option.value === color)?.label}
            </p>
            <FieldError>{state.errors?.color?.[0]}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.size)}>
            <FieldLabel htmlFor="product-size">Размеры</FieldLabel>
            {Array.from(sizes).map((size) => (
              <input key={size} name="size" type="hidden" value={size} />
            ))}
            <ComboBox
              aria-label="Размеры"
              inputValue={sizeSearch}
              onInputChange={setSizeSearch}
              onSelectionChange={(key) => {
                if (key === null) return

                const selectedSize = String(key)
                setSizes((currentSizes) => {
                  const nextSizes = new Set(currentSizes)
                  if (nextSizes.has(selectedSize)) nextSizes.delete(selectedSize)
                  else nextSizes.add(selectedSize)
                  return nextSizes
                })
                setSizeSearch("")
              }}
              isDisabled={pending}
              className="relative"
            >
              <div className="relative">
                <AriaInput
                  id="product-size"
                  placeholder="Найдите или выберите размеры"
                  className="ui-focus h-12 w-full rounded-md border border-input bg-background py-3 pr-12 pl-3 text-base/6 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50"
                />
                <AriaButton
                  type="button"
                  aria-label="Показать размеры"
                  className="ui-focus absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronDownIcon aria-hidden="true" className="size-5" />
                </AriaButton>
              </div>
              <Popover className="z-50 mt-1 w-[--trigger-width] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-sm">
                <ListBox className="grid max-h-56 grid-cols-4 gap-1 overflow-y-auto p-1 sm:grid-cols-5">
                  {productSizes.map((size) => (
                    <ListBoxItem
                      key={size}
                      id={String(size)}
                      textValue={String(size)}
                      className={() =>
                        cn(
                          "ui-focus flex min-h-11 items-center justify-center rounded-sm text-sm outline-none transition-colors duration-150",
                          sizes.has(String(size))
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted data-focused:bg-muted",
                        )
                      }
                    >
                      {size}
                    </ListBoxItem>
                  ))}
                </ListBox>
              </Popover>
            </ComboBox>
            {sizes.size ? (
              <div aria-label="Выбранные размеры" className="flex flex-wrap gap-1.5">
                {Array.from(sizes, Number)
                  .sort((a, b) => a - b)
                  .map((size) => (
                    <AriaButton
                      key={size}
                      type="button"
                      onPress={() =>
                        setSizes((currentSizes) => {
                          const nextSizes = new Set(currentSizes)
                          nextSizes.delete(String(size))
                          return nextSizes
                        })
                      }
                      className="ui-focus inline-flex min-h-11 items-center gap-1 rounded-md bg-secondary px-3 text-sm text-secondary-foreground outline-none hover:bg-border"
                    >
                      {size}
                      <XIcon aria-hidden="true" className="size-4" />
                      <span className="sr-only">Удалить размер {size}</span>
                    </AriaButton>
                  ))}
              </div>
            ) : (
              <p aria-live="polite" className="text-sm text-muted-foreground">
                Выберите хотя бы один размер
              </p>
            )}
            <FieldError>{state.errors?.size?.[0]}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.country)}>
            <FieldLabel htmlFor="product-country">Страна</FieldLabel>
            <Input
              id="product-country"
              name="country"
              defaultValue={product?.detail?.country ?? ""}
              maxLength={200}
              disabled={pending}
              aria-invalid={Boolean(state.errors?.country)}
              required
            />
            <FieldError>{state.errors?.country?.[0]}</FieldError>
          </Field>
          <Field className="sm:col-span-2" data-invalid={Boolean(state.errors?.description)}>
            <FieldLabel htmlFor="product-description">Описание</FieldLabel>
            <Textarea
              id="product-description"
              name="description"
              defaultValue={product?.description ?? ""}
              maxLength={10000}
              disabled={pending}
              aria-invalid={Boolean(state.errors?.description)}
              required
            />
            <FieldError>{state.errors?.description?.[0]}</FieldError>
          </Field>
        </FieldGroup>
        <FieldError>{!state.success && state.message}</FieldError>
        <DialogFooter>
          <DialogClose type="button" isDisabled={pending}>
            Отмена
          </DialogClose>
          <Button type="submit" isDisabled={pending || !categories.length}>
            {pending ? "Сохраняем…" : product ? "Сохранить изменения" : "Создать товар"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
