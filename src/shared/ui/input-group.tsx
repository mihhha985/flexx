"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Group, type GroupProps } from "react-aria-components"

import { cn } from "@/src/shared/lib/utils"
import { Button } from "@/src/shared/ui/button"
import { Input } from "@/src/shared/ui/input"
import { Textarea } from "@/src/shared/ui/textarea"

function InputGroup({ className, ...props }: GroupProps) {
  return (
    <Group
      data-slot="input-group"
      className={cn(
        "group/input-group relative flex min-h-12 w-full min-w-0 items-center rounded-md border border-input bg-background transition-colors duration-150 has-disabled:bg-muted has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:outline-2 has-[[data-slot=input-group-control]:focus-visible]:outline-offset-2 has-[[data-slot=input-group-control]:focus-visible]:outline-ring has-[[data-slot][aria-invalid=true]]:border-destructive has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:flex-col has-[>[data-align=inline-end]]:[&>input]:pr-2 has-[>[data-align=inline-start]]:[&>input]:pl-2",
        className,
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-sm [&>svg:not([class*='size-'])]:size-5",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-3 has-[>button]:pl-0.5",
        "inline-end": "order-last pr-3 has-[>button]:pr-0.5",
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva("flex items-center gap-2 text-sm shadow-none", {
  variants: {
    size: {
      xs: "min-h-11 gap-2 rounded-md px-3 [&>svg:not([class*='size-'])]:size-3.5",
      sm: "min-h-11 px-4",
      "icon-xs": "size-11 rounded-md p-0 has-[>svg]:p-0",
      "icon-sm": "size-11 p-0 has-[>svg]:p-0",
    },
  },
  defaultVariants: {
    size: "xs",
  },
})

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  return (
    <Button
      type={type}
      size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:outline-none disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className,
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:outline-none disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className,
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
