"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, Clock3, Eye, MoreHorizontal, RefreshCw, Trash2, XCircle, CreditCard, Truck } from "lucide-react"
import { toast } from "sonner"
import type { AdminOrder } from "@/src/entities/order/services/adminOrderService"
import { deleteOrder, updateOrderStatus } from "@/src/entities/order/services/adminOrderActions"
import { orderStatuses, type OrderStatus } from "@/src/entities/order/services/order-status"
import { formatPrice } from "@/src/shared/lib/catalog"
import { Button } from "@/src/shared/ui/button"
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/shared/ui/dialog"
import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/src/shared/ui/dropdown-menu"

const statusIcons = { pending: Clock3, confirmed: CheckCircle2, paid: CreditCard, shipped: Truck, completed: CheckCircle2, cancelled: XCircle }

export function OrderRowActions({ order }: { order: AdminOrder }) {
  const router = useRouter()
  const [dialog, setDialog] = useState<"products" | "delete" | null>(null)
  const [pending, startTransition] = useTransition()

  function mutate(status?: OrderStatus) {
    if (pending || status === order.status) return
    startTransition(async () => {
      const toastId = toast.loading(status ? "Изменяем статус…" : "Удаляем заявку…")
      try {
        const result = status ? await updateOrderStatus(order.id, status) : await deleteOrder(order.id)
        if (!result.success) {
          toast.error(result.error, { id: toastId })
          return
        }
        toast.success(status ? "Статус изменён" : "Заявка удалена", { id: toastId })
        setDialog(null)
        router.refresh()
      } catch {
        toast.error("Не удалось сохранить изменения. Попробуйте ещё раз.", { id: toastId })
      }
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon-xs" aria-label={`Действия заявки #${order.id}`} isDisabled={pending}><MoreHorizontal /></Button>
          <DropdownMenu placement="bottom end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Заявка #{order.id}</DropdownMenuLabel>
              <DropdownMenuItem onAction={() => setDialog("products")}><Eye />Просмотреть товары</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger isDisabled={pending}><RefreshCw />Изменить статус</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Новый статус</DropdownMenuLabel>
                  {(Object.keys(orderStatuses) as OrderStatus[]).map((status) => {
                    const Icon = statusIcons[status]
                    return <DropdownMenuItem key={status} textValue={orderStatuses[status]} isDisabled={pending || status === order.status} onAction={() => mutate(status)}><Icon />{orderStatuses[status]}</DropdownMenuItem>
                  })}
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onAction={() => setDialog("delete")} isDisabled={pending}><Trash2 />Удалить заявку</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenu>
        </DropdownMenuTrigger>
      </div>
      <Dialog isOpen={dialog === "products"} onOpenChange={(open) => { if (!open) setDialog(null) }} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Товары заявки #{order.id}</DialogTitle>
          <DialogDescription>Состав заказа и стоимость на момент оформления.</DialogDescription>
        </DialogHeader>
        <ul className="flex max-h-80 flex-col gap-4 overflow-y-auto">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {item.product?.isActive ? <Link className="font-medium break-words underline underline-offset-4" href={`/product/${item.product.slug}`}>{item.productName}</Link> : <p className="font-medium break-words">{item.productName}</p>}
                <p className="text-muted-foreground">{item.quantity} шт. × {formatPrice(item.unitPrice)}</p>
                {!item.product?.isActive && <p className="text-xs text-muted-foreground">Товар недоступен в каталоге</p>}
              </div>
              <span className="shrink-0 font-medium">{formatPrice(item.quantity * item.unitPrice)}</span>
            </li>
          ))}
        </ul>
        {!order.items.length && <p className="text-muted-foreground">В заявке нет товаров.</p>}
        <DialogFooter><span className="font-medium">Итого: {formatPrice(order.total)}</span></DialogFooter>
      </Dialog>
      <Dialog isOpen={dialog === "delete"} onOpenChange={(open) => { if (!open && !pending) setDialog(null) }} isDismissable={!pending} isKeyboardDismissDisabled={pending} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Удалить заявку #{order.id}?</DialogTitle>
          <DialogDescription>Заявка и её состав будут удалены без возможности восстановления. Товары останутся в каталоге.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" isDisabled={pending} onPress={() => setDialog(null)}>Отмена</Button>
          <Button variant="destructive" isDisabled={pending} onPress={() => mutate()}>{pending ? "Удаляем…" : "Удалить"}</Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}
