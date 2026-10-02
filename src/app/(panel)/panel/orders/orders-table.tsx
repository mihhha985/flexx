"use client"

import { useId, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { MapPin, MessageSquare, type LucideIcon } from "lucide-react"
import type { AdminOrder } from "@/src/entities/order/services/admin-order-service"
import { DataTable } from "@/src/app/(panel)/panel/_components/data-table"
import { Badge } from "@/src/shared/ui/badge"
import { Button } from "@/src/shared/ui/button"
import { Field, FieldLabel } from "@/src/shared/ui/field"
import { Tooltip, TooltipTrigger } from "@/src/shared/ui/tooltip"
import { formatPrice } from "@/src/shared/lib/format-price"

import { orderStatuses as statuses } from "@/src/entities/order/status"
import { OrderRowActions } from "./order-row-actions"

const dateFormat = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Europe/Moscow",
})

function OrderTextTooltip({
  text,
  label,
  icon: Icon,
}: {
  text: string
  label: string
  icon: LucideIcon
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <TooltipTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button variant="ghost" size="icon" aria-label={label} onPress={() => setIsOpen(true)}>
        <Icon aria-hidden="true" />
      </Button>
      <Tooltip className="max-h-64 overflow-y-auto whitespace-pre-wrap wrap-anywhere">
        {text}
      </Tooltip>
    </TooltipTrigger>
  )
}

const columns: ColumnDef<AdminOrder>[] = [
  {
    accessorKey: "id",
    header: "№",
    cell: ({ row }) => <span className="font-medium">#{row.original.id}</span>,
  },
  { accessorKey: "total", header: "Сумма", cell: ({ row }) => formatPrice(row.original.total) },
  { accessorKey: "customerName", header: "Покупатель" },
  { accessorKey: "customerPhone", header: "Телефон" },
  { accessorKey: "customerEmail", header: "Почта" },
  {
    accessorKey: "shippingAddress",
    header: "Адрес",
    cell: ({ row }) => (
      <OrderTextTooltip
        text={row.original.shippingAddress}
        label={`Адрес доставки заказа №${row.original.id}`}
        icon={MapPin}
      />
    ),
  },
  {
    accessorKey: "comment",
    header: "Комментарий",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.comment?.trim() ? (
        <OrderTextTooltip
          text={row.original.comment}
          label={`Комментарий к заказу №${row.original.id}`}
          icon={MessageSquare}
        />
      ) : (
        <span className="text-muted-foreground" aria-label="Комментария нет">
          —
        </span>
      ),
  },
  {
    id: "status",
    accessorFn: (row) => statuses[row.status],
    header: "Статус",
    cell: ({ row, getValue }) => (
      <Badge
        variant={
          row.original.status === "cancelled"
            ? "destructive"
            : row.original.status === "pending"
              ? "secondary"
              : "default"
        }
      >
        {getValue<string>()}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Дата создания",
    cell: ({ row }) => dateFormat.format(new Date(row.original.createdAt)),
  },
  {
    id: "actions",
    header: "Действие",
    enableSorting: false,
    cell: ({ row }) => <OrderRowActions order={row.original} />,
  },
]

export function OrdersTable({ data }: { data: AdminOrder[] }) {
  const searchParams = useSearchParams()
  const statusFilterId = useId()
  const selectedStatus =
    Object.keys(statuses).find((status) => status === searchParams.get("status")) ?? ""
  const filteredData = useMemo(
    () => (selectedStatus ? data.filter((order) => order.status === selectedStatus) : data),
    [data, selectedStatus],
  )

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      label="Список заказов"
      searchLabel="Поиск по заказам"
      searchPlaceholder="Номер, покупатель, контакт или статус…"
      globalFilterColumns={["id", "customerName", "customerPhone", "customerEmail", "status"]}
      filters={
        <Field className="w-full min-w-0 sm:w-56">
          <FieldLabel htmlFor={statusFilterId}>Статус</FieldLabel>
          <select
            id={statusFilterId}
            value={selectedStatus}
            onChange={(event) => {
              const url = new URL(window.location.href)
              if (event.target.value) url.searchParams.set("status", event.target.value)
              else url.searchParams.delete("status")
              window.history.replaceState(null, "", url)
            }}
            className="ui-focus h-12 w-full min-w-0 rounded-md border border-input bg-background px-3 text-base outline-none"
          >
            <option value="">Любой статус</option>
            {Object.entries(statuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      }
      emptyDescription={
        selectedStatus
          ? "Заказов с выбранным статусом пока нет. Выберите другой статус."
          : "Заказы появятся здесь после оформления в магазине."
      }
    />
  )
}
