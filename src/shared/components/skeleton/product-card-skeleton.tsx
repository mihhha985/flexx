import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/shared/ui/card"
import { Skeleton } from "@/src/shared/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card size="sm" aria-hidden="true" className="h-full [&_[data-slot=skeleton]]:motion-reduce:animate-none">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <CardHeader>
        <CardTitle><Skeleton className="h-5 w-full" /></CardTitle>
        <CardAction><Skeleton className="h-5 w-16" /></CardAction>
      </CardHeader>
      <CardContent><Skeleton className="h-6 w-24" /></CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-full" />
      </CardFooter>
    </Card>
  )
}
