"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { ToggleButton as TogglePrimitive, type ToggleButtonProps } from "react-aria-components"

import { cn } from "@/src/shared/lib/utils"

const toggleVariants = cva(
  "ui-focus group/toggle inline-flex items-center justify-center gap-2 rounded-md text-sm/5 font-medium whitespace-nowrap transition-colors duration-150 outline-none hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 aria-invalid:border-destructive aria-pressed:bg-primary aria-pressed:text-primary-foreground data-selected:bg-primary data-selected:text-primary-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-background hover:bg-muted aria-pressed:border-primary data-selected:border-primary",
      },
      size: {
        default: "min-h-12 min-w-12 px-4 py-3",
        sm: "min-h-11 min-w-11 px-3 py-2",
        lg: "min-h-12 min-w-12 px-5 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: ToggleButtonProps & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
