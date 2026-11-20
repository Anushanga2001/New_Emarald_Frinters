import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Eye,
  Settings,
  FileText,
  DollarSign,
} from 'lucide-react'
import {
  getAdminStats,
  getAllUsers,
  type AdminStats,
  type AdminUserResponse,
} from '@/services/admin.service'
import { getUserQuotes } from '@/services/quote.service'
import { formatCurrency } from '@/lib/utils'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton'
import type { Quote } from '@/types'

export function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUserResponse[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsData, usersData, quotesData] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getUserQuotes().catch(() => []),
      ])
      setStats(statsData)
      setUsers(usersData)
      setQuotes(quotesData)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const totalQuotesValue = quotes.reduce((sum, q) => {
    const usdValue = q.currency === 'LKR' ? q.price / 320 : q.price
    return sum + usdValue
  }, 0)

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <DashboardSkeleton statCount={4} />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col justify-center items-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Manage your logistics operations.
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats?.totalUsers || users.length} hint="Registered accounts" icon={Users} tone="primary" />
        <StatCard title="Total Quotes" value={quotes.length} hint="Saved quotes" icon={FileText} tone="neutral" />
        <StatCard
          title="Quotes Value"
          value={`$${totalQuotesValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          hint="Total (USD)"
          icon={DollarSign}
          tone="success"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || '0'}`}
          hint="All time"
          icon={TrendingUp}
          tone="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quotes - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Quotes</CardTitle>
                <CardDescription>All customer quote requests</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/quotes">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {quotes.length === 0 ? (
              <EmptyState icon={FileText} title="No quotes yet" description="Customer quote requests will show up here." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quotes.slice(0, 6).map((quote) => (
                  <div
                    key={quote.id}
                    className="p-4 border rounded-lg hover:bg-secondary/60 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-mono text-sm font-medium">{quote.id}</p>
                      <StatusBadge status={quote.status ?? 'Pending'} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {quote.origin} → {quote.destination}
                    </p>
                    <p className="text-xs font-medium text-foreground/80 mb-2">{quote.service}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {quote.cargoType} • {quote.weight} kg
                      </p>
                      <p className="font-semibold text-primary">
                        {formatCurrency(quote.price, quote.currency)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Est. {quote.estimatedDays} days
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Users - Takes 1 column */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest registrations</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/users">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <EmptyState icon={Users} title="No users found" />
            ) : (
              <div className="space-y-3">
                {users.slice(0, 5).map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {u.firstName?.[0]}
                        {u.lastName?.[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <Badge variant={u.role === 'Admin' ? 'default' : 'secondary'} className="text-xs">
                      {u.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
