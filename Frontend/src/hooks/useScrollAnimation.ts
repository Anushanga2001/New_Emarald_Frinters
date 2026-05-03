import { useEffect, useRef, useState } from 'react'

type Options = {
  /** Fraction of the element that must be visible to trigger (0–1). */
  threshold?: number
  /** Margin around the root. Negative bottom delays trigger until further into view. */
  rootMargin?: string
  /** If true (default), the animation fires only once and the observer disconnects. */
  once?: boolean
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -60px 0px',
  once = true,
}: Options = {}) {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setIsVisible(false)
          }
        })
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isVisible }
}
