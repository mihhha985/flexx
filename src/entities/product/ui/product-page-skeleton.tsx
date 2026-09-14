import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card"
import { Separator } from "@/src/shared/ui/separator"
import { Skeleton } from "@/src/shared/ui/skeleton"

export function ProductPageSkeleton() {
  return (
    <div role="status" aria-label="Загрузка товара" className="flex flex-col gap-6">
      <span className="sr-only">Загрузка товара…</span>
      <div
        aria-hidden="true"
        className="flex flex-col gap-6 [&_[data-slot=skeleton]]:motion-reduce:animate-none"
      >
        <div className="flex h-5 items-center gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
          <div className="flex flex-col gap-5">
            <Card>
              <Skeleton className="aspect-square w-full" />
              <div className="grid grid-cols-4 gap-2 px-6 sm:grid-cols-5 md:grid-cols-6">
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton key={index} className="aspect-square w-full rounded-lg" />
                ))}
              </div>
              <CardHeader>
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <CardTitle>
                  <Skeleton className="h-8 w-3/4 sm:h-9" />
                </CardTitle>
                <CardDescription className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <Card key={index} size="sm">
                  <CardHeader>
                    <Skeleton className="size-6" />
                    <CardTitle>
                      <Skeleton className="h-5 w-3/4" />
                    </CardTitle>
                    <CardDescription>
                      <Skeleton className="h-4 w-full" />
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <Card size="sm">
              <CardHeader>
                <Skeleton className="size-6" />
                <CardTitle>
                  <Skeleton className="h-5 w-24" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-10 w-full" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-44" />
              </CardContent>
            </Card>
          </div>
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-7 w-24" />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-8 w-28" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-5 w-40" />
              </CardFooter>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
