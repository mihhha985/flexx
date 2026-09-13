import Link from "next/link"
import { PackageIcon } from "lucide-react"

import Menu from "@/src/app/(site)/_components/menu"
import MobileMenu from "@/src/app/(site)/_components/mobile-menu"
import { TransitionWrapper } from "@/src/app/(site)/_components/transition-wrapper"
import { CartHydration } from "@/src/features/cart/cart-hydration"
import { FavoritesHydration } from "@/src/features/favorites/favorites-hydration"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <CartHydration />
      <FavoritesHydration />

      <div className="bg-primary px-4 py-2 text-center text-xs text-primary-foreground">
        Заказ без регистрации · детали доставки подтвердим перед отправкой
      </div>

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:min-h-20 lg:px-8">
          <Link
            href="/"
            className="ui-focus flex items-center gap-2 rounded-md text-xl font-bold tracking-tight"
            aria-label="Контур — на главную"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PackageIcon className="size-4" aria-hidden="true" />
            </span>
            <span>Flexx</span>
          </Link>

          <Menu />
        </div>
      </header>

      <TransitionWrapper>
        <main className="mx-auto min-h-screen max-w-7xl px-4 pb-20 pt-4 sm:px-6 sm:pt-6 md:pb-16 lg:px-8 lg:pt-8">
          {children}
        </main>
      </TransitionWrapper>

      <footer className="bg-primary pb-20 text-primary-foreground md:pb-0">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-8 lg:py-16">
          <div className="max-w-sm">
            <Link
              href="/"
              className="ui-focus inline-flex items-center gap-2 rounded-md text-xl font-bold tracking-tight"
              aria-label="Контур — на главную"
            >
              <PackageIcon className="size-5" aria-hidden="true" />
              Flexx
            </Link>
            <p className="mt-4 text-sm/6 text-primary-foreground/70">
              Обувь для повседневного ритма. Выбор и оформление заказа без лишних шагов.
            </p>
          </div>

          <nav aria-label="Разделы магазина">
            <h2 className="text-sm/5 font-semibold tracking-normal text-primary-foreground">
              Магазин
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link className="ui-focus rounded-sm hover:text-primary-foreground" href="/catalog">
                  Каталог
                </Link>
              </li>
              <li>
                <Link className="ui-focus rounded-sm hover:text-primary-foreground" href="/cart">
                  Корзина
                </Link>
              </li>
              <li>
                <Link
                  className="ui-focus rounded-sm hover:text-primary-foreground"
                  href="/contacts"
                >
                  Контакты
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm/5 font-semibold tracking-normal text-primary-foreground">
              Связаться
            </h2>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm text-primary-foreground/70">
              <a
                className="ui-focus rounded-sm hover:text-primary-foreground"
                href="tel:+74951234567"
              >
                +7 495 123-45-67
              </a>
              <a
                className="ui-focus rounded-sm hover:text-primary-foreground"
                href="mailto:hello@kontur.store"
              >
                hello@kontur.store
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/15">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>© 2026 Контур</p>
            <p>Оформление заказа без регистрации</p>
          </div>
        </div>
      </footer>

      <MobileMenu />
    </div>
  )
}
