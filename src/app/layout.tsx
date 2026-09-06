import type { Metadata, Viewport } from "next"
import { PwaRegister } from "@/src/app/_components/pwa-register"
import { Toaster } from "@/src/shared/ui/sonner"

import "./globals.css"

export const metadata: Metadata = {
  title: "Контур — простой интернет-магазин",
  description: "Быстрый заказ товаров без регистрации.",
  applicationName: "Контур",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Контур",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body>
        {children}
        <Toaster theme="light" position="top-center" richColors />
        <PwaRegister />
      </body>
    </html>
  )
}
