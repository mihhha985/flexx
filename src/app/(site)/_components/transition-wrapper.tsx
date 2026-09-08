"use client"
import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"
export function TransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Keep the shared catalog layout mounted when only its category changes.
  const transitionKey =
    pathname === "/catalog" || pathname.startsWith("/catalog/") ? "/catalog" : pathname
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "tween",
          duration: 0.4,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
