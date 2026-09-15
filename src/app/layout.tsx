import type { Metadata, Viewport } from "next"
import { SITE_URL } from "@/env"
import { PwaRegister } from "@/src/app/_components/pwa-register"
import { defaultSocialImage, SITE_DESCRIPTION, SITE_NAME } from "@/src/shared/lib/seo"
import { Toaster } from "@/src/shared/ui/sonner"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FLEXX — интернет-магазин кроссовок и обуви",
    template: "%s | FLEXX",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "shopping",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "кроссовки",
    "обувь",
    "интернет-магазин обуви",
    "мужские кроссовки",
    "брендовые кроссовки",
  ],
  openGraph: {
    title: "FLEXX — интернет-магазин кроссовок и обуви",
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "ru_RU",
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "FLEXX — интернет-магазин кроссовок и обуви",
    description: SITE_DESCRIPTION,
    images: [defaultSocialImage.url],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
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
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: SITE_NAME,
    url: SITE_URL,
    logo: new URL("/images/logo.png", SITE_URL).toString(),
    description: SITE_DESCRIPTION,
  }

  return (
    <html lang="ru">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <Toaster theme="light" position="top-center" richColors />
        <PwaRegister />
      </body>
    </html>
  )
}
