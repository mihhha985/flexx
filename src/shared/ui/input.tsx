"use client"

import * as React from "react"
import { composeRenderProps, Input as InputPrimitive } from "react-aria-components"

import { cn } from "@/src/shared/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<typeof InputPrimitive>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={composeRenderProps(className, (className) =>
        cn(
          "ui-focus h-12 w-full min-w-0 rounded-md border border-input bg-background px-3 py-3 text-base/6 text-foreground transition-colors duration-150 outline-none file:mr-3 file:border-0 file:bg-muted file:px-2 file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive",
          className,
        ),
      )}
      {...props}
    />
  )
}

export { Input }
