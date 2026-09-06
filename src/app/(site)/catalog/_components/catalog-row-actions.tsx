"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeOffIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/src/shared/ui/button"
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/ui/dropdown-menu"

type MutationResult = { success: boolean; error?: string }

type CatalogRowActionsProps = {
  name: string
  kind: "product" | "category"
  onEdit: () => void
  onDelete: () => Promise<MutationResult>
  visibility?: { isActive: boolean; onChange: () => Promise<MutationResult> }
}

export function CatalogRowActions({
  name,
  kind,
  onEdit,
  onDelete,
  visibility,
}: CatalogRowActionsProps) {
  const router = useRouter()
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const noun = kind === "product" ? "товар" : "категорию"

  function mutate(action: () => Promise<MutationResult>, message: string) {
    if (pending) return
    setError(undefined)
    startTransition(async () => {
      const toastId = toast.loading("Сохраняем изменения…")
      try {
        const result = await action()
        if (!result.success) {
          const description = result.error ?? "Не удалось сохранить изменения. Попробуйте ещё раз."
          setError(description)
          toast.error(description, { id: toastId })
          return
        }
        toast.success(message, { id: toastId })
        setDeleteOpen(false)
        router.refresh()
      } catch {
        const description = "Не удалось сохранить изменения. Попробуйте ещё раз."
        setError(description)
        toast.error(description, { id: toastId })
      }
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="icon-xs"
            isDisabled={pending}
            aria-label={`Действия: ${name}`}
          >
            <MoreHorizontalIcon />
          </Button>
          <DropdownMenu placement="bottom end" className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="max-w-56 truncate">{name}</DropdownMenuLabel>
              <DropdownMenuItem onAction={onEdit} isDisabled={pending}>
                <PencilIcon />
                Редактировать {noun}
              </DropdownMenuItem>
              {visibility && (
                <DropdownMenuItem
                  isDisabled={pending}
                  onAction={() =>
                    mutate(
                      visibility.onChange,
                      visibility.isActive
                        ? "Товар скрыт из каталога."
                        : "Товар доступен в каталоге.",
                    )
                  }
                >
                  {visibility.isActive ? <EyeOffIcon /> : <EyeIcon />}
                  {visibility.isActive ? "Скрыть из каталога" : "Показать в каталоге"}
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                isDisabled={pending}
                onAction={() => {
                  setError(undefined)
                  setDeleteOpen(true)
                }}
              >
                <Trash2Icon />
                Удалить {noun}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenu>
        </DropdownMenuTrigger>
      </div>
      <Dialog
        isOpen={isDeleteOpen}
        onOpenChange={(open) => {
          if (!pending) setDeleteOpen(open)
        }}
        isDismissable={!pending}
        isKeyboardDismissDisabled={pending}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>
            Удалить {noun} «{name}»?
          </DialogTitle>
          <DialogDescription>
            {kind === "product"
              ? "Товар будет удалён без возможности восстановления. Если он используется в заявках, удаление будет недоступно — такой товар можно скрыть из каталога."
              : "Категория будет удалена без возможности восстановления. Если в ней есть товары, сначала перенесите их в другую категорию."}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button
            autoFocus
            variant="outline"
            isDisabled={pending}
            onPress={() => setDeleteOpen(false)}
          >
            Отмена
          </Button>
          <Button
            variant="destructive"
            isDisabled={pending}
            onPress={() =>
              mutate(onDelete, kind === "product" ? "Товар удалён." : "Категория удалена.")
            }
          >
            {pending ? "Удаляем…" : `Удалить ${noun}`}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}
