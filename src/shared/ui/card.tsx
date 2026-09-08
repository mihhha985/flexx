import * as React from "react"

import { cn } from "@/src/shared/lib/utils"

function Card({
  className,
  size = "default",
  variant = "outline",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm"
  variant?: "outline" | "plain"
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(
        "group/card flex min-w-0 flex-col gap-(--card-spacing) rounded-xl border border-border bg-card py-(--card-spacing) text-card-foreground [--card-spacing:--spacing(6)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        variant === "plain" && "rounded-none border-0 bg-transparent py-0",
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-2 rounded-t-xl px-(--card-spacing) group-data-[variant=plain]/card:px-0 has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-lg/6 font-semibold tracking-tight wrap-anywhere group-data-[size=sm]/card:text-base/6",
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm/6 text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing) group-data-[variant=plain]/card:px-0", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-b-xl px-(--card-spacing) pb-(--card-spacing) group-data-[variant=plain]/card:px-0 group-data-[variant=plain]/card:pb-0",
        className,
      )}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
