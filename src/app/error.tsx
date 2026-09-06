"use client"

import { ErrorFallback } from "@/src/shared/components/error-fallback"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  return <ErrorFallback error={error} reset={reset} />
}
