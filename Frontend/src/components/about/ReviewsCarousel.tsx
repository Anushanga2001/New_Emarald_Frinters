import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, MessageCircle, RefreshCw, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RatingStars } from '@/components/ui/rating-stars'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/lib/errors'
import { getRatings, type RatingResponse } from '@/services/ratings.service'

const AUTO_SCROLL_INTERVAL_MS = 5000

export function ReviewsCarousel() {
  const [ratings, setRatings] = useState<RatingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useAuth()

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRatings()
      setRatings(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load reviews'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const stats = useMemo(() => {
    if (ratings.length === 0) return { average: 0, count: 0 }
    const sum = ratings.reduce((acc, r) => acc + r.stars, 0)
    return { average: sum / ratings.length, count: ratings.length }
  }, [ratings])

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const firstCard = track.querySelector<HTMLElement>('[data-review-card]')
    const step = firstCard ? firstCard.offsetWidth + 24 : track.clientWidth
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4
    const atStart = track.scrollLeft <= 0

    if (direction === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' })
    } else if (direction === -1 && atStart) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' })
    } else {
      track.scrollBy({ left: direction * step, behavior: 'smooth' })
    }
  }

  // Auto-scroll
  useEffect(() => {
    if (paused || ratings.length <= 1) return
    const id = window.setInterval(() => scrollByCard(1), AUTO_SCROLL_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [paused, ratings.length])

  const headerCta = (
    <Card>
      <CardContent className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold text-primary">
            {stats.count === 0 ? '—' : stats.average.toFixed(1)}
          </div>
          <div>
            <RatingStars value={Math.round(stats.average)} readOnly size="md" />
            <p className="text-sm text-muted-foreground mt-1">
              {stats.count === 0
                ? 'No ratings yet'
                : `Based on ${stats.count} rating${stats.count === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to={isAuthenticated ? '/rate-us' : '/auth/login?redirect=/rate-us'}>
            <Star className="h-4 w-4 mr-2" />
            {isAuthenticated ? 'Leave your rating' : 'Sign in to rate'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-3">
          <Star className="h-6 w-6 text-amber-500 fill-amber-400" />
        </div>
        <h3 className="text-2xl font-bold mb-2">What our clients say</h3>
        <p className="text-muted-foreground">
          Real feedback from people who've used our service.
        </p>
      </div>

      <div className="mb-8">{headerCta}</div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center min-h-[200px] gap-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      ) : ratings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No ratings yet. Be the first to leave one!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous review"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-md text-slate-700 hover:text-primary hover:border-primary transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next review"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-md text-slate-700 hover:text-primary hover:border-primary transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-2 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {ratings.map((r) => {
              const name = r.customerName?.trim() || 'Anonymous'
              const initials = name
                .split(' ')
                .filter(Boolean)
                .map((p) => p[0]?.toUpperCase())
                .slice(0, 2)
                .join('')
              const displayDate = r.updatedAt ?? r.createdAt
              return (
                <Card
                  key={r.id}
                  data-review-card
                  className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <CardContent className="py-5 h-full">
                    <div className="flex items-start gap-3 h-full">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-primary">{initials || '?'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <RatingStars value={r.stars} readOnly size="sm" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(displayDate).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                            {r.updatedAt && <span className="ml-1 italic">(edited)</span>}
                          </span>
                        </div>
                        {r.comment && (
                          <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap line-clamp-5">
                            {r.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
