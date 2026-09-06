import type { LucideIcon } from "lucide-react"
import { CheckCircle2, Clock3, TrendingUp, XCircle } from "lucide-react"

import type { getOrderStats } from "@/src/entities/order/services/order-status"
type BriefStats = ReturnType<typeof getOrderStats>
import { Badge } from "@/src/shared/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card"

const percentageFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 1,
})

type StatsCard = {
  title: string
  description: string
  value: string
  footer: string
  badge: string
  badgeVariant: "default" | "secondary" | "destructive" | "outline"
  icon: LucideIcon
}

function getPercentage(value: number, total: number) {
  if (total === 0) {
    return "0"
  }

  return percentageFormatter.format((value / total) * 100)
}

export function OrderStatsCards({ stats }: { stats: BriefStats }) {
  const cards: StatsCard[] = [
    {
      title: "Новые заявки",
      description: "Ожидают обработки",
      value: String(stats.pending),
      footer: `${getPercentage(stats.pending, stats.total)}% от всех заявок`,
      badge: "PENDING",
      badgeVariant: "secondary",
      icon: Clock3,
    },
    {
      title: "Подтверждённые",
      description: "Включая оплаченные, отправленные и завершённые",
      value: String(stats.confirmed),
      footer: `${getPercentage(stats.confirmed, stats.total)}% от всех заявок`,
      badge: "CONFIRMED",
      badgeVariant: "default",
      icon: CheckCircle2,
    },
    {
      title: "Отменённые",
      description: "Закрыты без подтверждения",
      value: String(stats.cancelled),
      footer: `${getPercentage(stats.cancelled, stats.total)}% от всех заявок`,
      badge: "CANCELED",
      badgeVariant: "destructive",
      icon: XCircle,
    },
    {
      title: "CTR подтверждений",
      description: "Подтверждённые / все заявки",
      value: `${percentageFormatter.format(stats.confirmationCtr)}%`,
      footer: `${stats.confirmed} из ${stats.total} заявок подтверждено`,
      badge: "CTR",
      badgeVariant: "outline",
      icon: TrendingUp,
    },
  ]

  return (
    <section
      aria-label="Статистика заявок"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card key={card.title} size="sm">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
              <CardAction>
                <Badge variant={card.badgeVariant}>
                  <Icon data-icon="inline-start" />
                  {card.badge}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums">
                {card.value}
              </p>
            </CardContent>
            <CardFooter className="border-t">
              <p className="text-xs text-muted-foreground">{card.footer}</p>
            </CardFooter>
          </Card>
        )
      })}
    </section>
  )
}
