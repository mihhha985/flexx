import Image from "next/image"
import type { Metadata } from "next"
import { Suspense } from "react"
import {
  ArrowRightIcon,
  HeadphonesIcon,
  PackageCheckIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
} from "lucide-react"

import {
  FeaturedProductsSkeleton,
  MainCategoryListSkeleton,
} from "@/src/app/(site)/_components/home-skeleton"
import { MainCategoryList } from "@/src/app/(site)/_components/main-category-list"
import { RandomProductList } from "@/src/app/(site)/_components/random-product-list"
import { LinkButton } from "@/src/shared/ui/button"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { alternates: { canonical: "/" } }

const purchaseBenefits = [
  {
    icon: ShoppingBagIcon,
    title: "Без регистрации",
    text: "Только данные для связи и доставки.",
  },
  {
    icon: PackageCheckIcon,
    title: "Подтверждение заказа",
    text: "Уточним детали перед отправкой.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Проверка данных",
    text: "Цена и наличие проверяются при оформлении.",
  },
  {
    icon: HeadphonesIcon,
    title: "Помощь с выбором",
    text: "Ответим на вопросы о товаре.",
  },
] as const

export default function Home() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-20">
      <section className="relative isolate overflow-hidden rounded-xl bg-muted md:min-h-136">
        <Image
          src="/images/home-hero-sneaker.png"
          alt="Чёрно-белый высокий кроссовок на каменной подставке"
          fill
          priority
          sizes="(max-width: 767px) 0px, (max-width: 1280px) 100vw, 1280px"
          className="hidden object-cover md:block"
        />
        <div className="relative z-10 flex flex-col items-start gap-6 px-6 py-8 sm:px-10 sm:py-12 md:max-w-[47%] md:justify-center md:py-20 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Интернет-магазин обуви
          </p>
          <h1 className="text-4xl/[2.5rem] font-bold tracking-tight sm:text-5xl/[3.25rem] lg:text-[4rem]/[4.25rem]">
            Шаг навстречу своему стилю
          </h1>
          <p className="max-w-md text-base text-muted-foreground sm:text-lg/7">
            Выбирайте обувь в каталоге и оформляйте заказ без регистрации и лишних шагов.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <LinkButton href="/catalog" size="lg" className="w-full sm:w-auto">
              Смотреть каталог
              <ArrowRightIcon data-icon="inline-end" />
            </LinkButton>
            <LinkButton
              href="/contacts"
              variant="outline"
              size="lg"
              className="w-full bg-background/80 sm:w-auto"
            >
              Помощь с выбором
            </LinkButton>
          </div>
        </div>
        <div className="relative aspect-4/3 w-full md:hidden">
          <Image
            src="/images/home-hero-sneaker.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_center]"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 sm:gap-6" aria-labelledby="home-categories">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Найдите нужное
            </p>
            <h2 id="home-categories">Категории</h2>
          </div>
          <LinkButton href="/catalog" variant="ghost" size="sm">
            Все товары <ArrowRightIcon data-icon="inline-end" />
          </LinkButton>
        </div>
        <Suspense fallback={<MainCategoryListSkeleton />}>
          <MainCategoryList />
        </Suspense>
      </section>

      <section className="flex flex-col gap-4 sm:gap-6" aria-labelledby="home-products">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Подборка из каталога
            </p>
            <h2 id="home-products">Подборка товаров</h2>
          </div>
          <LinkButton href="/catalog" variant="ghost" size="sm">
            Смотреть всё <ArrowRightIcon data-icon="inline-end" />
          </LinkButton>
        </div>
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <RandomProductList />
        </Suspense>
      </section>

      <section
        className="relative isolate overflow-hidden rounded-xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-12 lg:px-16 lg:py-16"
        aria-labelledby="home-highlight"
      >
        <div
          className="pointer-events-none absolute left-6 sm:left-10 lg:left-1/5 bottom-0 -z-10 select-none text-[7rem]/[0.8] font-bold tracking-tighter text-primary-foreground/5 sm:text-[11rem]/[0.8] lg:text-[15rem]/[0.8]"
          aria-hidden="true"
        >
          FLEXX
        </div>
        <Image
          width={500}
          height={300}
          src="/images/baner.png"
          alt="Чёрно-белый высокий кроссовок на каменной подставке"
          className="absolute right-0 -top-10 opacity-60 mix-blend-exclusion -z-10"
        />
        <div className="flex max-w-xl flex-col items-start gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground/70">
            Весь каталог
          </p>
          <h2
            id="home-highlight"
            className="text-3xl/[2.375rem] font-semibold tracking-tight text-primary-foreground lg:text-[2.5rem]/[2.75rem]"
          >
            Найдите свою пару
          </h2>
          <p className="max-w-lg text-primary-foreground/75">
            Сравните модели, выберите размер и оформите заказ без регистрации.
          </p>
          <LinkButton href="/catalog" variant="inverse" size="lg" className="w-full sm:w-auto">
            Перейти в каталог
            <ArrowRightIcon data-icon="inline-end" />
          </LinkButton>
        </div>
      </section>

      <section aria-label="Преимущества покупки">
        <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {purchaseBenefits.map((benefit) => (
            <div key={benefit.title} className="flex gap-4 bg-background p-5 lg:p-6">
              <benefit.icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div>
                <h2 className="text-sm/5 font-semibold tracking-normal">{benefit.title}</h2>
                <p className="mt-1 text-sm/5 text-muted-foreground">{benefit.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
