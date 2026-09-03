"use client"

import { ErrorFallback } from "@/src/shared/components/error-fallback"

export default function SiteError({
  error,
  reset,
  retry,
}: {
  error: Error & { digest?: string }
  reset?: () => void
  retry?: () => void
}) {
  return <ErrorFallback error={error} reset={reset} retry={retry} />
}
