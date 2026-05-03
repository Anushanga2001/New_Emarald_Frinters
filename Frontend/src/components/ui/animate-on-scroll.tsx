import { type ElementType, type CSSProperties, type ReactNode } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

export type ScrollAnimation =
  | 'fade-in'
  | 'slide-up'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'

type Props = {
  animation?: ScrollAnimation
  /** ms before animation starts after element enters viewport */
  delay?: number
  /** ms transition duration */
  duration?: number
  /** Replay every time the element re-enters the viewport */
  replay?: boolean
  /** Render as a different element (defaults to <div>) */
  as?: ElementType
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function AnimateOnScroll({
  animation = 'slide-up',
  delay = 0,
  duration = 700,
  replay = false,
  as: Tag = 'div',
  className,
  style,
  children,
}: Props) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ once: !replay })

  return (
    <Tag
      ref={ref}
      data-animation={animation}
      className={cn('animate-on-scroll', isVisible && 'is-visible', className)}
      style={{
        ...style,
        ['--aos-delay' as string]: `${delay}ms`,
        ['--aos-duration' as string]: `${duration}ms`,
      }}
    >
      {children}
    </Tag>
  )
}
