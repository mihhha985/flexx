"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 motion-safe:animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "rounded-lg! border-border! bg-popover! text-popover-foreground! shadow-sm! font-sans!",
          title: "text-sm/5! font-medium!",
          description: "text-sm/5! text-muted-foreground!",
          actionButton: "ui-focus min-h-11! rounded-md! bg-primary! px-3! text-primary-foreground!",
          cancelButton:
            "ui-focus min-h-11! rounded-md! bg-secondary! px-3! text-secondary-foreground!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
