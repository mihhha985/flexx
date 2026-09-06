"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { AdminOrder } from "@/src/entities/order/services/admin-order-service"
import { DataTable } from "@/src/app/(panel)/panel/_components/data-table"
import { Badge } from "@/src/shared/ui/badge"
import { formatPrice } from "@/src/shared/lib/format-price"

import { orderStatuses as statuses } from "@/src/entities/order/status"
import { OrderRowActions } from "./order-row-actions"

const dateFormat = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Europe/Moscow",
})

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
    cell: ({ getValue }) => (
      <span className="block max-w-64 whitespace-normal">{getValue<string>()}</span>
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
  return (
    <DataTable
      columns={columns}
      data={data}
      label="Список заявок"
      searchLabel="Поиск по заявкам"
      searchPlaceholder="Номер, покупатель, контакт или статус…"
      globalFilterColumns={["id", "customerName", "customerPhone", "customerEmail", "status"]}
      emptyDescription="Заявки появятся здесь после оформления заказов в магазине."
    />
  )
}
