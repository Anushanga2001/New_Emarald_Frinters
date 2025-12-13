import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, MapPin, Calendar, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { trackShipment } from '@/services/tracking.service'
import type { Shipment } from '@/types'
import { format } from 'date-fns'

export function TrackingPage() {
  const [searchParams] = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('q') || '')
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number')
      return
    }

    setLoading(true)
    setError('')
    try {
      const result = await trackShipment(trackingNumber)
      setShipment(result)
    } catch (err) {
      setError('Shipment not found. Please check your tracking number.')
      setShipment(null)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      booked: 'default',
      'picked-up': 'secondary',
      'in-transit': 'default',
      'at-port': 'secondary',
      customs: 'outline',
      'out-for-delivery': 'success',
      delivered: 'success',
    }
    return colors[status] || 'default'
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Track Your Shipment</h1>
          <p className="text-lg text-muted-foreground">
            Enter your tracking number to get real-time shipment updates
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Enter tracking number (e.g., LS2024001)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                className="flex-1"
              />
              <Button onClick={handleTrack} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Tracking...' : 'Track'}
              </Button>
            </div>
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            <p className="text-xs text-muted-foreground mt-2">
              Try sample tracking numbers: LS2024001 or LS2024002
            </p>
          </CardContent>
        </Card>

        {/* Shipment Details */}
        {shipment && (
          <div className="space-y-6">
            {/* Overview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Tracking: {shipment.trackingNumber}</CardTitle>
                    <CardDescription>{shipment.service}</CardDescription>
                  </div>
                  <Badge variant={getStatusColor(shipment.status)}>
                    {shipment.status.replace(/-/g, ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Origin</p>
                      <p className="text-sm text-muted-foreground">{shipment.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Current Location</p>
                      <p className="text-sm text-muted-foreground">{shipment.currentLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Est. Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(shipment.estimatedDelivery), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Shipment Timeline</CardTitle>
                <CardDescription>Detailed tracking history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shipment.timeline.map((event, index) => (
                    <div key={index} className="relative">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-primary' : 'bg-muted'
                          }`} />
                          {index < shipment.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-muted my-1" style={{ minHeight: '40px' }} />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium">
                              {event.status.replace(/-/g, ' ').toUpperCase()}
                            </h4>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(event.date), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{event.location}</p>
                          <p className="text-sm">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Shipment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Destination</p>
                    <p className="font-medium">{shipment.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{shipment.weight} kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
