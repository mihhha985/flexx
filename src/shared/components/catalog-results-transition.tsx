"use client"

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { motion, useAnimationControls, useReducedMotion } from "motion/react"

type CategoryPosition = { slug: string | null; order: number }
type TransitionContextValue = {
  previous: CategoryPosition | null
  markDisplayed: (category: CategoryPosition) => void
}

const CatalogTransitionContext = createContext<TransitionContextValue | null>(null)

// The shared layout keeps the last displayed category across page remounts.
export function CatalogTransitionProvider({ children }: { children: ReactNode }) {
  const [previous, setPrevious] = useState<CategoryPosition | null>(null)
  const markDisplayed = useCallback((category: CategoryPosition) => {
    setPrevious((current) => current?.slug === category.slug && current.order === category.order
      ? current
      : category)
  }, [])
  const value = useMemo(() => ({ previous, markDisplayed }), [previous, markDisplayed])

  return (
    <CatalogTransitionContext.Provider value={value}>
      {children}
    </CatalogTransitionContext.Provider>
  )
}

export function CatalogResultsTransition({
  categorySlug = null,
  categoryOrder = 0,
  children,
}: {
  categorySlug?: string | null
  categoryOrder?: number
  children: ReactNode
}) {
  const context = useContext(CatalogTransitionContext)
  if (!context) throw new Error("CatalogResultsTransition requires CatalogTransitionProvider")
  const { previous, markDisplayed } = context
  const controls = useAnimationControls()
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (reduceMotion) {
      controls.set({ opacity: 1, x: 0 })
    } else if (previous && previous.slug !== categorySlug) {
      const movesForward = categorySlug !== null &&
        (previous.slug === null || categoryOrder >= previous.order)
      // Set the entry position before paint, including when a cached page returns.
      controls.set({ opacity: 0, x: movesForward ? 32 : -32 })
      void controls.start({
        opacity: 1,
        x: 0,
        transition: { type: "tween", duration: 0.28, ease: "easeOut" },
      })
    }
    markDisplayed({ slug: categorySlug, order: categoryOrder })
  }, [categorySlug, categoryOrder, previous, markDisplayed, controls, reduceMotion])

  return (
    <div className="overflow-x-clip">
      <motion.section
        aria-label="Результаты каталога"
        className="flex flex-col gap-4"
        initial={false}
        animate={controls}
      >
        {children}
      </motion.section>
    </div>
  )
}
