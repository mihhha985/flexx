import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/shared/lib/utils"

const badgeVariants = cva(
  "ui-focus group/badge inline-flex min-h-6 w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-transparent px-2 py-1 text-xs/4 font-medium whitespace-nowrap transition-colors duration-150 [&>svg]:pointer-events-none [&>svg]:size-3 [&:is(a,button)]:min-h-11 [&:is(a,button)]:min-w-11",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "border-destructive bg-background text-destructive [a]:hover:bg-destructive/10",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-foreground",
        ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    render?: (props: React.HTMLAttributes<HTMLElement>) => React.ReactNode
  }) {
  if (render) {
    const renderProps = {
      "data-slot": "badge",
      "data-variant": variant,
      className: cn(badgeVariants({ variant }), className),
      ...props,
    }

    return render(renderProps)
  }

  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
