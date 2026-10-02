"use client"
import Image from "next/image"
import { useRef, useState } from "react"
import { Button, LinkButton } from "@/src/shared/ui/button"
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import type { Swiper as SwiperInstance } from "swiper"
import { Pagination } from "swiper/modules"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"

export function MainSlider() {
  const swiperRef = useRef<SwiperInstance | null>(null)
  const [navigation, setNavigation] = useState({ isBeginning: true, isEnd: false })

  function updateNavigation(swiper: SwiperInstance) {
    setNavigation({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd })
  }

  return (
    <section className="main-swiper relative isolate bg-muted overflow-hidden rounded-xl xl:min-h-136">
      <Swiper
        modules={[Pagination]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
          updateNavigation(swiper)
        }}
        onSlideChange={updateNavigation}
        pagination={{ clickable: false }}
        scrollbar={{ draggable: true }}
      >
        <SwiperSlide className="relative flex! h-auto! flex-col xl:min-h-136">
          <div className="relative order-last mt-auto aspect-4/3 w-full xl:absolute xl:inset-0 xl:aspect-auto">
            <Image
              src="/images/home-slider-style.webp"
              alt="Чёрно-белый высокий кроссовок на каменной подставке"
              fill
              priority
              sizes="(max-width: 1279px) 180vw, 1280px"
              className="object-cover object-right"
            />
          </div>
          <div className="relative z-10 w-full flex flex-col items-start gap-6 px-6 py-8 sm:px-10 sm:py-12 xl:max-w-[47%] xl:justify-center xl:py-20 lg:px-16">
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
              <LinkButton href="/contacts" variant="outline" size="lg" className="w-full sm:w-auto">
                Помощь с выбором
              </LinkButton>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="relative flex! h-auto! flex-col xl:min-h-136">
          <div className="relative order-last mt-auto aspect-4/3 w-full xl:absolute xl:inset-0 xl:aspect-auto">
            <Image
              src="/images/home-slider-season.webp"
              alt="Бежевый и серый низкие кроссовки на светлых каменных ступенях"
              fill
              sizes="(max-width: 1279px) 180vw, 1280px"
              className="object-cover object-right"
            />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-6 px-6 py-8 sm:px-10 sm:py-12 xl:max-w-[67%] xl:justify-center xl:py-20 lg:px-16">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Интернет-магазин обуви
            </p>
            <h1 className="text-4xl/[2.5rem] font-bold tracking-tight sm:text-5xl/[3.25rem] lg:text-[4rem]/[4.25rem]">
              Новая колекция весна-осень
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
        </SwiperSlide>

        <SwiperSlide className="relative flex! h-auto! flex-col xl:min-h-136">
          <div className="relative order-last mt-auto aspect-4/3 w-full xl:absolute xl:inset-0 xl:aspect-auto">
            <Image
              src="/images/home-slider-sale.webp"
              alt="Три модели кроссовок в чёрных, белых и серых оттенках на каменных подставках"
              fill
              sizes="(max-width: 1279px) 180vw, 1280px"
              className="object-cover object-right"
            />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-6 px-6 py-8 sm:px-10 sm:py-12 xl:max-w-[67%] xl:justify-center xl:py-20 lg:px-16">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Интернет-магазин обуви
            </p>
            <h1 className="text-4xl/[2.5rem] font-bold tracking-tight sm:text-5xl/[3.25rem] lg:text-[4rem]/[4.25rem]">
              Скидка 50% на всю коллекцию
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
        </SwiperSlide>
        <div slot="container-end" className="main-swiper-navigation">
          <Button
            className="main-swiper-prev border-solid"
            variant="outline"
            size="icon"
            aria-label="Предыдущий слайд"
            isDisabled={navigation.isBeginning}
            onPress={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeftIcon className="size-6" aria-hidden="true" />
          </Button>
          <Button
            className="main-swiper-next border-solid"
            variant="outline"
            size="icon"
            aria-label="Следующий слайд"
            isDisabled={navigation.isEnd}
            onPress={() => swiperRef.current?.slideNext()}
          >
            <ChevronRightIcon className="size-6" aria-hidden="true" />
          </Button>
        </div>
      </Swiper>
    </section>
  )
}
