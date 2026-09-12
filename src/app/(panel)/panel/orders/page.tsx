import type { Metadata } from "next"
import { ClipboardListIcon } from "lucide-react"
import { getOrdersForAdmin } from "@/src/entities/order/services/admin-order-service"
import { OrdersTable } from "./orders-table"

import { getOrderStats } from "@/src/entities/order/status"
import { OrderStatsCards } from "./order-stats-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/src/shared/ui/empty"

export const metadata: Metadata = { title: "Заявки — Контур" }

export default async function Page() {
  const data = await getOrdersForAdmin()
  const heading = (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">Заявки</h1>
      <p className="text-sm text-muted-foreground">
        Главная страница для обработки входящих заявок
      </p>
    </div>
  )

  if (!data.length) {
    return (
      <section className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6">
        {heading}
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ClipboardListIcon />
            </EmptyMedia>
            <EmptyTitle>Заявок пока нет</EmptyTitle>
            <EmptyDescription>
              Они появятся здесь после оформления заказов в магазине.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    )
  }

  const stats = getOrderStats(data)
  return (
    <section className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6">
      {heading}
      <OrderStatsCards stats={stats} />
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Входящие заявки</CardTitle>
          <CardDescription>Всего заявок: {stats.total}</CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable data={data} />
        </CardContent>
      </Card>
    </section>
  )
}
