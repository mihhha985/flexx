import { Card, CardContent, CardFooter, CardHeader } from "@/src/shared/ui/card"
import { Skeleton } from "@/src/shared/ui/skeleton"

export function ProductFormSkeleton() {
  return (
    <section
      className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-6"
      role="status"
      aria-label="Загрузка формы товара"
    >
      <div className="flex items-center gap-4">
        <Skeleton className="size-9" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
      </div>
      <Card>
        <CardHeader className="border-b">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
          <Skeleton className="h-32 w-full sm:col-span-2" />
        </CardContent>
        <CardFooter className="justify-end border-t pt-6">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-36" />
        </CardFooter>
      </Card>
    </section>
  )
}
