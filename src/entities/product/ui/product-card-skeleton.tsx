import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { Skeleton } from "@/src/shared/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card
      size="sm"
      variant="plain"
      aria-hidden="true"
      className="h-full [&_[data-slot=skeleton]]:motion-reduce:animate-none"
    >
      <div className="relative">
        <Skeleton className="aspect-square w-full" />
        <Skeleton className="absolute right-2 top-2 size-11 rounded-lg" />
      </div>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-full" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </CardContent>
      <CardFooter className="mt-auto grid grid-cols-1 gap-2">
        <Skeleton className="h-11 w-full" />
      </CardFooter>
    </Card>
  )
}
