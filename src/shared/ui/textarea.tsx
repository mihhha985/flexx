"use client"

import * as React from "react"
import { composeRenderProps, TextArea as TextareaPrimitive } from "react-aria-components"

import { cn } from "@/src/shared/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<typeof TextareaPrimitive>) {
  return (
    <TextareaPrimitive
      data-slot="textarea"
      className={composeRenderProps(className, (className) =>
        cn(
          "ui-focus flex field-sizing-content min-h-32 w-full min-w-0 resize-y rounded-md border border-input bg-background px-3 py-3 text-base/6 text-foreground transition-colors duration-150 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive",
          className,
        ),
      )}
      {...props}
    />
  )
}

export { Textarea }
