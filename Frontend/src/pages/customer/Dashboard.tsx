import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Truck, CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react'
import { getCustomerShipments, getShipmentStats, getStatusLabel, ShipmentStatus } from '@/services/shipments.service'
import type { ShipmentResponse } from '@/services/shipments.service'

export function CustomerDashboard() {
  const { user } = useAuth()
  const [shipments, setShipments] = useState<ShipmentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchShipments() {
      try {
        const data = await getCustomerShipments()
        setShipments(data)
      } catch (err) {
        setError('Failed to load shipments')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchShipments()
  }, [])

  const stats = getShipmentStats(shipments)

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
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Manage your shipments and track your deliveries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">Active shipments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivered}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting pickup</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
          <CardDescription>Your latest shipping activity</CardDescription>
        </CardHeader>
        <CardContent>
          {shipments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No shipments yet. Create your first shipment to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {shipments.slice(0, 5).map((shipment) => (
                <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{shipment.trackingNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {shipment.originCity} → {shipment.destinationCity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      shipment.status === ShipmentStatus.Delivered 
                        ? 'bg-green-100 text-green-800'
                        : shipment.status === ShipmentStatus.InTransit 
                        ? 'bg-blue-100 text-blue-800'
                        : shipment.status === ShipmentStatus.Pending
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusLabel(shipment.status)}
                    </span>
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
