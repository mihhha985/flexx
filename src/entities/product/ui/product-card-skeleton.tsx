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
      <Skeleton className="aspect-square w-full" />
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-full" />
        </CardTitle>
        <Skeleton className="h-6 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-24" />
      </CardContent>
      <CardFooter className="mt-auto grid grid-cols-1 gap-2">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </CardFooter>
    </Card>
  )
}
