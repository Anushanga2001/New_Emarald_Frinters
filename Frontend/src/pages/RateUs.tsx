import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { notify } from '@/lib/toast'
import { Loader2, Send, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RatingStars } from '@/components/ui/rating-stars'
import { getMyRating, submitRating } from '@/services/ratings.service'

const MAX_COMMENT = 500

export function RateUsPage() {
  const [stars, setStars] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [hasExisting, setHasExisting] = useState(false)

  useEffect(() => {
    async function loadExisting() {
      try {
        const mine = await getMyRating()
        if (mine) {
          setStars(mine.stars)
          setComment(mine.comment ?? '')
          setHasExisting(true)
        }
      } catch {
        // silently ignore — fresh form is fine
      } finally {
        setLoading(false)
      }
    }
    loadExisting()
  }, [])

  const handleSubmit = async () => {
    if (stars < 1) {
      notify.error('Please select at least 1 star')
      return
    }
    setSubmitting(true)
    try {
      await submitRating({ stars, comment: comment.trim() || null })
      setHasExisting(true)
      notify.success(hasExisting ? 'Rating updated. Thanks!' : 'Thanks for your feedback!')
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      notify.error(axiosError?.response?.data?.message || 'Failed to submit rating')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-amber-100 mb-4">
            <Star className="h-7 w-7 text-amber-500 fill-amber-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3">
            {hasExisting ? 'Update your rating' : 'Rate our service'}
          </h1>
          <p className="text-lg text-muted-foreground">
            Your feedback helps us improve. Tell us how we're doing.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How would you rate us?</CardTitle>
            <CardDescription>Pick a star rating and optionally leave a comment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-3 py-4">
              <RatingStars value={stars} onChange={setStars} size="lg" />
              <p className="text-sm text-muted-foreground">
                {stars === 0
                  ? 'Tap a star to choose your rating'
                  : `${stars} out of 5`}
              </p>
            </div>

            <div>
              <Label htmlFor="comment">Comment (optional)</Label>
              <Textarea
                id="comment"
                placeholder="Tell us what you liked or what we can improve..."
                value={comment}
                maxLength={MAX_COMMENT}
                rows={5}
                onChange={(e) => setComment(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {comment.length} / {MAX_COMMENT}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild variant="outline" className="sm:flex-1">
                <Link to="/reviews">See what others said</Link>
              </Button>
              <Button
                className="sm:flex-1"
                onClick={handleSubmit}
                disabled={submitting || stars < 1}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {hasExisting ? 'Update rating' : 'Submit rating'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
