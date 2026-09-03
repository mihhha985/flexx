"use client"

import Link from "next/link"
import { useEffect } from "react"
import { RotateCcwIcon, TriangleAlertIcon } from "lucide-react"

type BoundaryError = Error & { digest?: string }

type ErrorFallbackProps = {
  error: BoundaryError
  reset?: () => void
  retry?: () => void
}

/** Shared generic UI for route and global error boundaries. */
export function ErrorFallback({ error, reset, retry }: ErrorFallbackProps) {
  const tryAgain = retry ?? reset

  useEffect(() => {
    // Server-side details are deliberately hidden in production. The digest can
    // be matched to the structured server log when Next.js provides one.
    console.error("[error-boundary]", {
      digest: error.digest,
      name: error.name,
      message: error.message,
    })
  }, [error])

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-xl border bg-card p-6 text-center shadow-sm" role="alert">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlertIcon className="size-5" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-xl font-semibold">Что-то пошло не так</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Мы уже знаем о проблеме. Попробуйте обновить страницу или вернитесь на главную.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {tryAgain ? (
            <button
              type="button"
              onClick={tryAgain}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              <RotateCcwIcon className="size-4" aria-hidden="true" />
              Попробовать снова
            </button>
          ) : null}
          <Link
            href="/"
            className="inline-flex h-9 items-center rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            На главную
          </Link>
        </div>
      </section>
    </main>
  )
}
