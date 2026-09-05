import { Suspense } from "react"
import { ArrowRightIcon, CheckIcon, PackageCheckIcon, ShoppingBagIcon } from "lucide-react"
import { Badge } from "@/src/shared/ui/badge"
import { LinkButton } from "@/src/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { MainCategoryList } from "@/src/shared/components/main-category-list"
import { RandomProductList } from "@/src/shared/components/random-product-list"
import {
  FeaturedProductsSkeleton,
  MainCategoryListSkeleton
} from "@/src/shared/components/skeleton/home-skeleton"

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <section>
        <Card className="py-8 sm:py-12">
          <CardHeader className="max-w-3xl gap-3">
            <Badge variant="secondary">Простой заказ за пару минут</Badge>
            <CardTitle className="text-3xl tracking-tight sm:text-5xl">Нужные вещи — без лишних шагов</CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Выберите товар, добавьте в корзину и оставьте контакты. Регистрация не нужна.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <LinkButton href="/catalog" size="lg">
              Перейти в каталог
              <ArrowRightIcon data-icon="inline-end" />
            </LinkButton>
            <LinkButton href="/contacts" variant="outline" size="lg">
              Условия доставки
            </LinkButton>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckIcon className="size-4" /> Без регистрации</span>
            <span className="flex items-center gap-1.5"><CheckIcon className="size-4" /> Оплата после подтверждения</span>
            <span className="flex items-center gap-1.5"><CheckIcon className="size-4" /> Доставка 1–2 дня</span>
          </CardFooter>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Быстрый старт</p>
            <h2 className="text-2xl font-medium tracking-tight">Категории</h2>
          </div>
          <LinkButton href="/catalog" variant="ghost" size="sm">
            Все товары <ArrowRightIcon data-icon="inline-end" />
          </LinkButton>
        </div>
        <Suspense fallback={<MainCategoryListSkeleton />}>
          <MainCategoryList />
        </Suspense>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Можно заказать сейчас</p>
            <h2 className="text-2xl font-medium tracking-tight">Популярное</h2>
          </div>
          <LinkButton href="/catalog" variant="ghost" size="sm">
            Смотреть всё <ArrowRightIcon data-icon="inline-end" />
          </LinkButton>
        </div>
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <RandomProductList />
        </Suspense>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Понятный процесс</p>
          <h2 className="text-2xl font-medium tracking-tight">Как оформить заказ</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { icon: ShoppingBagIcon, title: "1. Выберите", text: "Найдите товар через поиск или категории." },
            { icon: PackageCheckIcon, title: "2. Проверьте", text: "Измените количество и проверьте итог в корзине." },
            { icon: CheckIcon, title: "3. Подтвердите", text: "Оставьте контакты — мы уточним детали доставки." },
          ].map((step) => (
            <Card key={step.title} size="sm">
              <CardHeader>
                <step.icon className="text-muted-foreground" />
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
