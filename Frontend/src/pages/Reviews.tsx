import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Loader2, MessageCircle, RefreshCw, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RatingStars } from '@/components/ui/rating-stars'
import { useAuth } from '@/hooks/useAuth'
import { getRatings, type RatingResponse } from '@/services/ratings.service'

export function ReviewsPage() {
  const [ratings, setRatings] = useState<RatingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  const fetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRatings()
      setRatings(data)
    } catch {
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  const stats = useMemo(() => {
    if (ratings.length === 0) return { average: 0, count: 0 }
    const sum = ratings.reduce((acc, r) => acc + r.stars, 0)
    return { average: sum / ratings.length, count: ratings.length }
  }, [ratings])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={fetch}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-amber-100 mb-4">
          <Star className="h-7 w-7 text-amber-500 fill-amber-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3">What our clients say</h1>
        <p className="text-lg text-muted-foreground">
          Real feedback from people who've used our service.
        </p>
      </div>

      {/* Aggregate */}
      <div className="max-w-3xl mx-auto mb-8">
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
      </div>

      {/* Reviews list */}
      <div className="max-w-3xl mx-auto">
        {ratings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No ratings yet. Be the first to leave one!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
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
                <Card key={r.id}>
                  <CardContent className="py-5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-primary">{initials || '?'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-semibold">{name}</p>
                          <RatingStars value={r.stars} readOnly size="sm" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(displayDate).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                            {r.updatedAt && (
                              <span className="ml-1 italic">(edited)</span>
                            )}
                          </span>
                        </div>
                        {r.comment && (
                          <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">
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
        )}
      </div>
    </div>
  )
}
