import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react"

import { getOrderConfirmation } from "@/src/entities/order/services/confirmation-service"
import { LinkButton } from "@/src/shared/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/shared/ui/empty"

export const metadata: Metadata = {
  title: "Спасибо за ваш заказ",
  robots: { index: false, follow: false },
}

export default async function OrderThanksPage({
  params,
}: {
  params: Promise<{ publicId: string }>
}) {
  const { publicId } = await params
  const order = await getOrderConfirmation(publicId)
  if (!order) notFound()

  return (
    <Empty className="min-h-[60vh] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CheckCircle2Icon />
        </EmptyMedia>
        <EmptyTitle>Спасибо за ваш заказ!</EmptyTitle>
        <EmptyDescription>
          Заказ <span className="break-all">{order.publicId}</span> принят. Мы свяжемся с вами,
          чтобы подтвердить состав и время доставки.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <LinkButton href="/catalog" size="lg">
          Продолжить покупки <ArrowRightIcon data-icon="inline-end" />
        </LinkButton>
      </EmptyContent>
    </Empty>
  )
}
