"use client"
import Image from "next/image"
import { LinkButton } from "@/src/shared/ui/button"
import { ArrowRightIcon } from "lucide-react"
import { Navigation, Pagination } from 'swiper/modules';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


export function MainSlider() {
  return (
    <section className="relative isolate bg-muted overflow-hidden rounded-xl md:min-h-136">
      <Image
        src="/images/home-hero-sneaker.png"
        alt="Чёрно-белый высокий кроссовок на каменной подставке"
        fill
        priority
        sizes="(max-width: 767px) 0px, (max-width: 1280px) 100vw, 1280px"
        className="hidden object-cover"
      />
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        <SwiperSlide>
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
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative z-10 flex flex-col items-start gap-6 px-6 py-8 sm:px-10 sm:py-12 md:max-w-[47%] md:justify-center md:py-20 lg:px-16">
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

        <SwiperSlide>
          <div className="relative z-10 flex flex-col items-start gap-6 px-6 py-8 sm:px-10 sm:py-12 md:max-w-[47%] md:justify-center md:py-20 lg:px-16">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Интернет-магазин обуви
            </p>
            <h1 className="text-4xl/[2.5rem] font-bold tracking-tight sm:text-5xl/[3.25rem] lg:text-[4rem]/[4.25rem]">
              Скидка 50% на весё
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
      </Swiper>
    </section>
  );
}
