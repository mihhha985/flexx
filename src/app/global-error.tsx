"use client"

import "./globals.css"

import { ErrorFallback } from "@/src/shared/components/error-fallback"

export default function GlobalError({
  error,
  reset,
  retry,
}: {
  error: Error & { digest?: string }
  reset?: () => void
  retry?: () => void
}) {
  return (
    <html lang="ru">
      <body>
        <title>Ошибка — Контур</title>
        <ErrorFallback error={error} reset={reset} retry={retry} />
      </body>
    </html>
  )
}
