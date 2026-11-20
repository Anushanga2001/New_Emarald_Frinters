import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, FileText, DollarSign, CheckCircle2 } from 'lucide-react'
import { getUserQuotes } from '@/services/quote.service'
import { formatCurrency } from '@/lib/utils'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton'
import type { Quote } from '@/types'

export function CustomerDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const quotesData = await getUserQuotes()
      setQuotes(quotesData)
    } catch (err: unknown) {
      const axiosError = err as { response?: { status?: number; data?: { message?: string } } }

      if (axiosError?.response?.status === 401) {
        setError('Session expired. Please log in again.')
      } else if (axiosError?.response?.status === 403) {
        setError('Access denied. Your account may not have permission to view data.')
      } else if (!axiosError?.response) {
        setError('Cannot connect to server. Please ensure the backend is running at http://localhost:5253')
      } else {
        setError(axiosError?.response?.data?.message || 'Failed to load data')
      }
      console.error('Dashboard API error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const totalQuotesValue = quotes.reduce((sum, q) => {
    const usdValue = q.currency === 'LKR' ? q.price / 320 : q.price
    return sum + usdValue
  }, 0)

  if (loading) {
    return <DashboardSkeleton statCount={3} />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col justify-center items-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-destructive text-center max-w-md">{error}</p>
        <Button onClick={fetchData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Manage your quotes and track your requests
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Quotes" value={quotes.length} hint="Saved quotes" icon={FileText} tone="primary" />
        <StatCard
          title="Quotes Value"
          value={`$${totalQuotesValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          hint="Total (USD)"
          icon={DollarSign}
          tone="neutral"
        />
        <StatCard
          title="Approved"
          value={quotes.filter((q) => q.status === 'Approved').length}
          hint="Confirmed by our team"
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      {/* Recent Quotes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Quotes</CardTitle>
              <CardDescription>Your latest quote requests</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/quotes">View All</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/quote">Get Quote</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No quotes yet"
              description="Get your first shipping quote in under a minute."
              action={
                <Button asChild variant="cta">
                  <Link to="/quote">Get a Quote</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {quotes.slice(0, 5).map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/60 hover:shadow-sm transition-all">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-medium truncate">{quote.id}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {quote.origin} → {quote.destination}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {quote.service} • {quote.weight} kg
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-primary">
                      {formatCurrency(quote.price, quote.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      {quote.estimatedDays} days
                    </p>
                    <StatusBadge status={quote.status ?? 'Pending'} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
