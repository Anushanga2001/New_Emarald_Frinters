import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Package,
  MapPin,
  Truck,
  Weight,
  DollarSign,
  Calendar,
  Hash,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import api from '@/services/api'

type QuoteStatus = 'Pending' | 'Approved' | 'Rejected'

interface QuoteDetail {
  id: number
  quoteNumber: string
  origin: string
  destination: string
  service: string
  cargoType: string
  weight: number
  containerSize?: string | null
  price: number
  currency: 'USD' | 'LKR'
  estimatedDays: number
  distance: number
  isBooked: boolean
  status: QuoteStatus
  createdAt: string
}

function StatusBadge({ status }: { status: QuoteStatus }) {
  if (status === 'Approved') {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Approved
      </Badge>
    )
  }
  if (status === 'Rejected') {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200">
        <XCircle className="h-3 w-3 mr-1" />
        Rejected
      </Badge>
    )
  }
  return (
    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
      <Clock className="h-3 w-3 mr-1" />
      Pending
    </Badge>
  )
}

export function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [quote, setQuote] = useState<QuoteDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQuote() {
      try {
        const response = await api.get(`/quotes/${id}`)
        setQuote(response.data)
      } catch {
        setError('Failed to load quote details.')
      } finally {
        setLoading(false)
      }
    }
    fetchQuote()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg text-muted-foreground">{error || 'Quote not found.'}</p>
        <Link to="/admin/dashboard">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/admin/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 w-10 h-10 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-xl">Booking {quote.quoteNumber}</CardTitle>
                  <StatusBadge status={quote.status ?? 'Pending'} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">Quote #{quote.id}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="bg-primary/5 p-5 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Price</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(quote.price, quote.currency)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Estimated Delivery</p>
                <p className="text-lg font-semibold">{quote.estimatedDays} days</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailRow icon={<MapPin className="h-4 w-4" />} label="Origin" value={quote.origin} />
              <DetailRow icon={<MapPin className="h-4 w-4" />} label="Destination" value={quote.destination} />
              <DetailRow icon={<Truck className="h-4 w-4" />} label="Service" value={quote.service} />
              <DetailRow icon={<Package className="h-4 w-4" />} label="Cargo Type" value={quote.cargoType} />
              <DetailRow icon={<Weight className="h-4 w-4" />} label="Weight" value={`${quote.weight.toLocaleString()} kg`} />
              {quote.containerSize && (
                <DetailRow icon={<Hash className="h-4 w-4" />} label="Container" value={quote.containerSize} />
              )}
              <DetailRow
                icon={<DollarSign className="h-4 w-4" />}
                label="Distance"
                value={`${quote.distance.toLocaleString()} km`}
              />
              <DetailRow
                icon={<Calendar className="h-4 w-4" />}
                label="Booked On"
                value={new Date(quote.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium break-words">{value}</p>
      </div>
    </div>
  )
}
