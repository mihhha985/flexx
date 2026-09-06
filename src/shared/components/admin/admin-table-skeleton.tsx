import { Skeleton } from "@/src/shared/ui/skeleton"

export function AdminTableSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Загрузка списка">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-lg" />
      <Skeleton className="h-9 w-full max-w-md" />
      <div className="flex flex-col gap-3 rounded-lg border p-4">
        {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-10 w-full" />)}
      </div>
    </div>
  )
}
