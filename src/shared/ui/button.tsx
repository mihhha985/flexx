"use client"

import NextLink from "next/link"
import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Button as ButtonPrimitive,
  Link as LinkPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  type LinkProps as LinkPrimitiveProps,
} from "react-aria-components"

import { cn } from "@/src/shared/lib/utils"

const buttonVariants = cva(
  "ui-focus group/button inline-flex min-w-11 shrink-0 items-center justify-center rounded-lg border border-transparent text-sm/5 font-medium whitespace-nowrap transition-colors duration-150 outline-none select-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-foreground data-pressed:bg-foreground",
        outline:
          "border-input bg-background text-foreground hover:bg-muted data-pressed:bg-secondary aria-expanded:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-border data-pressed:bg-border aria-expanded:bg-border",
        ghost: "text-foreground hover:bg-muted/60 data-pressed:bg-secondary aria-expanded:bg-muted",
        destructive:
          "border-destructive bg-background text-destructive hover:bg-destructive/10 data-pressed:bg-destructive/10",
        link: "text-primary underline-offset-4 hover:underline",
        inverse:
          "bg-primary-foreground text-primary hover:bg-background data-pressed:bg-background [--ring:var(--primary-foreground)]",
      },
      size: {
        default: "min-h-12 gap-2 px-5 py-3",
        xs: "min-h-11 gap-1.5 px-3 py-2 text-xs [&_svg:not([class*='size-'])]:size-4",
        sm: "min-h-11 gap-2 px-4 py-2",
        lg: "min-h-12 gap-2 px-6 py-3",
        icon: "size-11 p-0",
        "icon-xs": "size-11 p-0 [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-11 p-0",
        "icon-lg": "size-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: Omit<ButtonPrimitiveProps, "className"> &
  React.RefAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    className?: string
  }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

function LinkButton({
  className,
  variant = "default",
  size = "default",
  ...props
}: Omit<LinkPrimitiveProps, "className"> &
  VariantProps<typeof buttonVariants> & {
    className?: string
  }) {
  return (
    <LinkPrimitive
      render={(props) => ("href" in props ? <NextLink {...props} /> : <span {...props} />)}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, LinkButton, buttonVariants }
