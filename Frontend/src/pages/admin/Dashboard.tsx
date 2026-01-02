import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Package,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Eye,
  Settings,
  FileText,
  DollarSign,
} from 'lucide-react'
import {
  getAdminStats,
  getAllShipments,
  getAllUsers,
  updateShipmentStatus,
  type AdminStats,
  type AdminShipmentResponse,
  type AdminUserResponse,
} from '@/services/admin.service'
import { ShipmentStatus, getStatusLabel } from '@/services/shipments.service'
import { getUserQuotes } from '@/services/quote.service'
import { formatCurrency } from '@/lib/utils'
import type { Quote } from '@/types'

export function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [shipments, setShipments] = useState<AdminShipmentResponse[]>([])
  const [users, setUsers] = useState<AdminUserResponse[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsData, shipmentsData, usersData, quotesData] = await Promise.all([
        getAdminStats(),
        getAllShipments(),
        getAllUsers(),
        getUserQuotes().catch(() => []), // Don't fail if quotes fail
      ])
      setStats(statsData)
      setShipments(shipmentsData)
      setUsers(usersData)
      setQuotes(quotesData)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate total quotes value
  const totalQuotesValue = quotes.reduce((sum, q) => {
    const usdValue = q.currency === 'LKR' ? q.price / 320 : q.price
    return sum + usdValue
  }, 0)

  useEffect(() => {
    fetchData()
  }, [])

  const handleStatusUpdate = async (shipmentId: number, newStatus: number) => {
    setUpdatingStatus(shipmentId)
    try {
      await updateShipmentStatus(shipmentId, newStatus)
      // Refresh shipments after update
      const updatedShipments = await getAllShipments()
      setShipments(updatedShipments)
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusBadgeVariant = (status: number) => {
    switch (status) {
      case ShipmentStatus.Delivered:
        return 'default'
      case ShipmentStatus.InTransit:
      case ShipmentStatus.OutForDelivery:
        return 'secondary'
      case ShipmentStatus.Pending:
        return 'outline'
      case ShipmentStatus.Cancelled:
        return 'destructive'
      default:
        return 'outline'
    }
  }

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
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats?.totalUsers || users.length}</div>
            <p className="text-xs text-blue-700">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats?.totalShipments || shipments.length}</div>
            <p className="text-xs text-green-700">All time</p>
          </CardContent>
        </Card>

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

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">Active Shipments</CardTitle>
            <Truck className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {stats?.activeShipments ||
                shipments.filter(
                  (s) =>
                    s.status === ShipmentStatus.InTransit ||
                    s.status === ShipmentStatus.PickedUp ||
                    s.status === ShipmentStatus.OutForDelivery
                ).length}
            </div>
            <p className="text-xs text-amber-700">In transit</p>
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
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shipments - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Shipments</CardTitle>
                <CardDescription>Manage and update shipment statuses</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {shipments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No shipments found.</p>
            ) : (
              <div className="space-y-3">
                {shipments.slice(0, 5).map((shipment) => (
                  <div
                    key={shipment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-mono font-medium text-sm">{shipment.trackingNumber}</p>
                        <Badge variant={getStatusBadgeVariant(shipment.status)}>
                          {getStatusLabel(shipment.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {shipment.originCity} → {shipment.destinationCity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {shipment.status !== ShipmentStatus.Delivered &&
                        shipment.status !== ShipmentStatus.Cancelled && (
                          <select
                            className="text-xs border rounded px-2 py-1 bg-white"
                            value={shipment.status}
                            onChange={(e) => handleStatusUpdate(shipment.id, Number(e.target.value))}
                            disabled={updatingStatus === shipment.id}
                          >
                            <option value={ShipmentStatus.Pending}>Pending</option>
                            <option value={ShipmentStatus.PickedUp}>Picked Up</option>
                            <option value={ShipmentStatus.InTransit}>In Transit</option>
                            <option value={ShipmentStatus.OutForDelivery}>Out For Delivery</option>
                            <option value={ShipmentStatus.Delivered}>Delivered</option>
                            <option value={ShipmentStatus.Cancelled}>Cancelled</option>
                          </select>
                        )}
                      {updatingStatus === shipment.id && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
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
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No users found.</p>
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

      {/* Recent Quotes Section */}
      <Card className="mt-6">
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
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No quotes found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quotes.slice(0, 6).map((quote) => (
                <div
                  key={quote.id}
                  className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-mono text-sm font-medium">{quote.id}</p>
                    <Badge variant="secondary" className="text-xs">
                      {quote.service}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {quote.origin} → {quote.destination}
                  </p>
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

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Delivered This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.deliveredThisMonth ||
                shipments.filter((s) => s.status === ShipmentStatus.Delivered).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${stats?.totalRevenue?.toLocaleString() || '0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {shipments.filter((s) => s.status === ShipmentStatus.Pending).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

