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

export function CartSkeleton() {
  return (
    <div className="flex flex-col gap-6 [&_[data-slot=skeleton]]:motion-reduce:animate-none">
      <div className="flex flex-col gap-2">
        <Skeleton aria-hidden="true" className="h-5 w-16" />
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Корзина</h1>
        <p className="text-muted-foreground">Проверьте товары и заполните данные для связи.</p>
      </div>
      <div role="status" aria-label="Загрузка корзины">
        <span className="sr-only">Восстанавливаем сохранённую корзину…</span>
        <div aria-hidden="true" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Card key={index} size="sm">
                <CardContent className="flex gap-3">
                  <Skeleton className="size-20 shrink-0 rounded-lg" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-24" />
                    <div className="flex items-center justify-between gap-3">
                      <Skeleton className="h-11 w-32" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-11 w-20" />
                </CardFooter>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-28" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-10 w-full" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className={index === 4 ? "h-32 w-full" : "h-12 w-full"} />
                  </div>
                ))}
              </div>
              <Separator className="my-5" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-7 w-full" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
