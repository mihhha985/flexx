import { ClockIcon, MailIcon, MapPinIcon, MessageCircleIcon, PhoneIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/shared/ui/accordion"
import { Badge } from "@/src/shared/ui/badge"
import { LinkButton } from "@/src/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/ui/card"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Контакты — Контур",
  description: "Контакты магазина, график работы, доставка и ответы на вопросы.",
}

export default function ContactsPage() {

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary">Отвечаем каждый день</Badge>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Контакты</h1>
        <p className="max-w-2xl text-muted-foreground">Поможем с выбором, доставкой и вопросами по уже оформленному заказу.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: PhoneIcon, title: "Телефон", text: "+7 495 123-45-67", hint: "Ежедневно, 09:00–21:00", href: "tel:+74951234567" },
          { icon: MailIcon, title: "Почта", text: "hello@kontur.store", hint: "Ответим в течение дня", href: "mailto:hello@kontur.store" },
          { icon: MapPinIcon, title: "Пункт выдачи", text: "Москва, Тверская, 12", hint: "Вход со двора", href: "https://maps.google.com/?q=Москва+Тверская+12" },
          { icon: ClockIcon, title: "График", text: "09:00–21:00", hint: "Без выходных", href: null },
        ].map((contact) => (
          <Card key={contact.title} size="sm">
            <CardHeader>
              <contact.icon className="text-muted-foreground" />
              <CardTitle>{contact.title}</CardTitle>
              <CardDescription>{contact.hint}</CardDescription>
            </CardHeader>
            <CardContent>
              {contact.href ? (
                <a href={contact.href} className="font-medium underline underline-offset-4">{contact.text}</a>
              ) : (
                <p className="font-medium">{contact.text}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <MessageCircleIcon className="text-muted-foreground" />
            <CardTitle>Нужна помощь с выбором?</CardTitle>
            <CardDescription>Позвоните — уточним задачу и подскажем подходящий товар.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <LinkButton href="tel:+74951234567" size="lg">
              <PhoneIcon data-icon="inline-start" /> Позвонить
            </LinkButton>
            <LinkButton href="/catalog" variant="outline" size="lg">
              Открыть каталог
            </LinkButton>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Частые вопросы</CardTitle>
            <CardDescription>Коротко о доставке, оплате и возврате.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion>
              <AccordionItem id="delivery">
                <AccordionTrigger>Когда привезут заказ?</AccordionTrigger>
                <AccordionContent>Обычно доставка занимает 1–2 рабочих дня. Точный интервал согласуем по телефону.</AccordionContent>
              </AccordionItem>
              <AccordionItem id="payment">
                <AccordionTrigger>Как оплатить?</AccordionTrigger>
                <AccordionContent>После подтверждения заказа отправим безопасную ссылку на оплату или предложим оплату при получении.</AccordionContent>
              </AccordionItem>
              <AccordionItem id="return">
                <AccordionTrigger>Можно ли вернуть товар?</AccordionTrigger>
                <AccordionContent>Да, в течение 14 дней, если сохранены товарный вид и комплектность.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
