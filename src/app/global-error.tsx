"use client"

import "./globals.css"

import { ErrorFallback } from "@/src/shared/components/error-fallback"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  return (
    <html lang="ru">
      <body>
        <title>Ошибка — Контур</title>
        <ErrorFallback error={error} reset={reset} />
      </body>
    </html>
  )
}
