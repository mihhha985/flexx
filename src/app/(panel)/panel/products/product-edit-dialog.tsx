"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createProductAction } from "@/src/entities/product/actions/manageProductActions"
import { updateProductAction } from "@/src/entities/product/actions/updateProductAction"
import type { AdminCategory } from "@/src/entities/category/services/adminCategoryService"
import type { AdminProduct } from "@/src/entities/product/services/adminProductService"
import { Button } from "@/src/shared/ui/button"
import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/shared/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/src/shared/ui/field"
import { Input } from "@/src/shared/ui/input"
import { Textarea } from "@/src/shared/ui/textarea"

type ProductEditDialogProps = {
  product?: AdminProduct
  categories: AdminCategory[]
  onOpenChange: (isOpen: boolean) => void
}

export function ProductEditDialog({ product, categories, onOpenChange }: ProductEditDialogProps) {
  const router = useRouter()
  const [state, action, pending] = useActionState(product ? updateProductAction : createProductAction, {})

  useEffect(() => {
    if (!state.success) return

    toast.success(state.message)
    router.refresh()
    onOpenChange(false)
  }, [onOpenChange, router, state.message, state.success])

  return (
    <Dialog isOpen onOpenChange={(open) => { if (!pending) onOpenChange(open) }} isDismissable={!pending} isKeyboardDismissDisabled={pending} className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl" showCloseButton={!pending}>
      <form action={action} className="contents" aria-busy={pending}>
        {product && <input type="hidden" name="id" value={product.id} />}
        <DialogHeader>
          <DialogTitle>{product ? "Редактировать товар" : "Создать товар"}</DialogTitle>
          <DialogDescription>{product ? "Измените данные товара и сохраните изменения." : "Заполните данные. После создания товар появится в каталоге."}</DialogDescription>
        </DialogHeader>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(state.errors?.name)}>
            <FieldLabel htmlFor="product-name">Название</FieldLabel>
            <Input autoFocus id="product-name" name="name" defaultValue={product?.name ?? ""} maxLength={200} disabled={pending} aria-invalid={Boolean(state.errors?.name)} required />
            <FieldError>{state.errors?.name?.[0]}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.slug)}>
            <FieldLabel htmlFor="product-slug">Адрес в каталоге (слаг)</FieldLabel>
            <Input id="product-slug" name="slug" defaultValue={product?.slug ?? ""} maxLength={200} disabled={pending} aria-invalid={Boolean(state.errors?.slug)} required />
            <FieldError>{state.errors?.slug?.[0]}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.categoryId)}>
            <FieldLabel htmlFor="product-category">Категория</FieldLabel>
            <select id="product-category" name="categoryId" defaultValue={String(product?.categoryId ?? categories[0]?.id ?? "")} disabled={pending} aria-invalid={Boolean(state.errors?.categoryId)} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50" required>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <FieldError>{state.errors?.categoryId?.[0]}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.price)}>
            <FieldLabel htmlFor="product-price">Цена</FieldLabel>
            <Input id="product-price" name="price" type="number" defaultValue={String(product?.price ?? 0)} min="0" max="999999999.99" step="0.01" disabled={pending} aria-invalid={Boolean(state.errors?.price)} required />
            <FieldError>{state.errors?.price?.[0]}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.stock)}>
            <FieldLabel htmlFor="product-stock">Остаток</FieldLabel>
            <Input id="product-stock" name="stock" type="number" defaultValue={String(product?.stock ?? 0)} min="0" max="2147483647" step="1" disabled={pending} aria-invalid={Boolean(state.errors?.stock)} required />
            <FieldError>{state.errors?.stock?.[0]}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.imageUrl)}>
            <FieldLabel htmlFor="product-image-url">Ссылка на изображение</FieldLabel>
            <Input id="product-image-url" name="imageUrl" type="url" defaultValue={product?.imageUrl ?? ""} maxLength={2048} disabled={pending} aria-invalid={Boolean(state.errors?.imageUrl)} placeholder="https://example.com/image.jpg" />
            <FieldError>{state.errors?.imageUrl?.[0]}</FieldError>
          </Field>
          <Field className="sm:col-span-2" data-invalid={Boolean(state.errors?.description)}>
            <FieldLabel htmlFor="product-description">Описание</FieldLabel>
            <Textarea id="product-description" name="description" defaultValue={product?.description ?? ""} maxLength={10000} disabled={pending} aria-invalid={Boolean(state.errors?.description)} required />
            <FieldError>{state.errors?.description?.[0]}</FieldError>
          </Field>
        </FieldGroup>
        <FieldError>{!state.success && state.message}</FieldError>
        <DialogFooter>
          <DialogClose type="button" isDisabled={pending}>Отмена</DialogClose>
          <Button type="submit" isDisabled={pending || !categories.length}>{pending ? "Сохраняем…" : product ? "Сохранить изменения" : "Создать товар"}</Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
