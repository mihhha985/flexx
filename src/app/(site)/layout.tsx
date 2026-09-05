import Link from "next/link";
import { PackageIcon } from "lucide-react";
import { Separator } from "@/src/shared/ui/separator";

import Menu from "@/src/shared/components/menu";
import MobileMenu from "@/src/shared/components/mobile-menu";
import { TransitionWrapper } from "@/src/shared/components/transition-wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
      <div className="min-h-dvh bg-background">
        <header className="sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-medium"
              aria-label="Контур — на главную"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <PackageIcon className="size-4" aria-hidden="true" />
              </span>
              <span>Контур</span>
            </Link>

            <Menu />
          </div>
        </header>

      <TransitionWrapper>
        <main className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-6 sm:px-6 md:pb-12 md:pt-10">
          {children}
        </main>
      </TransitionWrapper>

        <footer className="hidden md:block">
          <Separator />
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
            <p>© 2026 Контур</p>
            <p>Простой способ заказать нужное</p>
          </div>
        </footer>

        <MobileMenu />
      </div>
  );
}
