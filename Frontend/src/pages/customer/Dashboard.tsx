import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, RefreshCw, FileText, DollarSign } from 'lucide-react'
import { getUserQuotes } from '@/services/quote.service'
import { formatCurrency } from '@/lib/utils'
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
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
          <h1 className="text-3xl font-bold mb-2">
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
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Total Quotes</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{quotes.length}</div>
            <p className="text-xs text-purple-700">Saved quotes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900">Quotes Value</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">${totalQuotesValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-emerald-700">Total (USD)</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Booked</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{quotes.filter(q => q.id).length}</div>
            <p className="text-xs text-blue-700">Confirmed bookings</p>
          </CardContent>
        </Card>
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
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-3">
                No quotes yet. Get your first shipping quote!
              </p>
              <Button asChild size="sm">
                <Link to="/quote">Get Quote</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {quotes.slice(0, 5).map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
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
                    <p className="text-xs text-muted-foreground">
                      {quote.estimatedDays} days
                    </p>
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
