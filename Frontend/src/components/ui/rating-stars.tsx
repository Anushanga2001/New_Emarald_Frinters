import { useState } from 'react'
import { Star } from 'lucide-react'

interface RatingStarsProps {
  value: number
  onChange?: (next: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_MAP = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
} as const

export function RatingStars({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  className = '',
}: RatingStarsProps) {
  const [hover, setHover] = useState<number | null>(null)
  const display = hover ?? value

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= display
        const interactive = !readOnly && onChange
        const Icon = (
          <Star
            className={`${SIZE_MAP[size]} transition-colors ${
              active ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-300'
            }`}
          />
        )
        if (!interactive) {
          return <span key={n}>{Icon}</span>
        }
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange!(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
          >
            {Icon}
          </button>
        )
      })}
    </div>
  )
}
