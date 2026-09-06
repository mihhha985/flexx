"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { saveCategoryAction } from "@/src/entities/category/actions/manageCategoryActions"
import type { AdminCategory } from "@/src/entities/category/services/adminCategoryService"
import { Button } from "@/src/shared/ui/button"
import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/shared/ui/dialog"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/src/shared/ui/field"
import { Input } from "@/src/shared/ui/input"

export function CategoryEditDialog({ category, onOpenChange }: { category?: AdminCategory; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const [state, action, pending] = useActionState(saveCategoryAction, {})

  useEffect(() => {
    if (!state.success) return
    toast.success(state.message)
    router.refresh()
    onOpenChange(false)
  }, [onOpenChange, router, state.message, state.success])

  return (
    <Dialog isOpen onOpenChange={(open) => { if (!pending) onOpenChange(open) }} isDismissable={!pending} isKeyboardDismissDisabled={pending} showCloseButton={!pending} className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-md">
      <form action={action} className="contents" aria-busy={pending}>
        {category && <input type="hidden" name="id" value={category.id} />}
        <DialogHeader>
          <DialogTitle>{category ? "Редактировать категорию" : "Создать категорию"}</DialogTitle>
          <DialogDescription>Название, адрес и порядок отображения в каталоге.</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field data-invalid={Boolean(state.errors?.name)}>
            <FieldLabel htmlFor="category-name">Название</FieldLabel>
            <Input autoFocus id="category-name" name="name" defaultValue={category?.name ?? ""} maxLength={200} required disabled={pending} aria-invalid={Boolean(state.errors?.name)} />
            <FieldError>{state.errors?.name}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.slug)}>
            <FieldLabel htmlFor="category-slug">Адрес в каталоге (слаг)</FieldLabel>
            <Input id="category-slug" name="slug" defaultValue={category?.slug ?? ""} maxLength={200} placeholder="bytovaya-tehnika" required disabled={pending} aria-invalid={Boolean(state.errors?.slug)} aria-describedby="category-slug-help" />
            <FieldDescription id="category-slug-help">Строчные латинские буквы, цифры и дефисы.</FieldDescription>
            <FieldError>{state.errors?.slug}</FieldError>
          </Field>
          <Field data-invalid={Boolean(state.errors?.order)}>
            <FieldLabel htmlFor="category-order">Порядок отображения</FieldLabel>
            <Input id="category-order" name="order" type="number" defaultValue={category?.order ?? 0} min={0} max={2147483647} step={1} required disabled={pending} aria-invalid={Boolean(state.errors?.order)} aria-describedby="category-order-help" />
            <FieldDescription id="category-order-help">Категории с меньшим числом отображаются раньше.</FieldDescription>
            <FieldError>{state.errors?.order}</FieldError>
          </Field>
        </FieldGroup>
        <FieldError>{!state.success && state.message}</FieldError>
        <DialogFooter>
          <DialogClose type="button" isDisabled={pending}>Отмена</DialogClose>
          <Button type="submit" isDisabled={pending}>{pending ? "Сохраняем…" : category ? "Сохранить изменения" : "Создать категорию"}</Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
