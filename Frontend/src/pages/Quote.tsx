import { useState } from 'react'
import { toast } from 'sonner'
import { Calculator, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { calculateQuote, saveQuote } from '@/services/quote.service'
import type { Quote } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { SERVICES, CARGO_TYPES, CONTAINER_SIZES } from '@/lib/constants'

export function QuotePage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    service: '',
    cargoType: '',
    weight: '',
    containerSize: '',
    currency: 'USD' as 'USD' | 'LKR',
  })

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const result = await calculateQuote({
        origin: formData.origin,
        destination: formData.destination,
        service: formData.service,
        cargoType: formData.cargoType,
        weight: parseFloat(formData.weight),
        containerSize: formData.containerSize || undefined,
        currency: formData.currency,
      })
      setQuote(result)
      setStep(3)
    } catch (error) {
      toast.error('Error calculating quote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = async () => {
    if (!quote) return
    
    setBookingLoading(true)
    try {
      const savedQuote = await saveQuote(quote)
      toast.success('Booking Confirmed!', {
        description: `Your shipment has been booked successfully. Reference: ${savedQuote.id}`,
        duration: 5000,
      })
      // Reset to start new quote after successful booking
      setTimeout(() => {
        setStep(1)
        setQuote(null)
      }, 2000)
    } catch (error) {
      toast.error('Error processing booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Get an Instant Quote</h1>
          <p className="text-lg text-muted-foreground">
            Calculate shipping costs for your cargo in seconds
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-primary text-white' : 'bg-muted'
            }`}>1</div>
            <div className="w-12 h-0.5 bg-muted"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-primary text-white' : 'bg-muted'
            }`}>2</div>
            <div className="w-12 h-0.5 bg-muted"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-primary text-white' : 'bg-muted'
            }`}>3</div>
          </div>
        </div>

        <Card>
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Step 1: Shipping Details</CardTitle>
                <CardDescription>Enter origin and destination information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="origin">Origin</Label>
                    <Input
                      id="origin"
                      placeholder="e.g., Singapore"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      placeholder="e.g., Colombo, Sri Lanka"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="service">Service Type</Label>
                  <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((service) => (
                        <SelectItem key={service.id} value={service.name}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setStep(2)}
                  disabled={!formData.origin || !formData.destination || !formData.service}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Step 2: Cargo Information</CardTitle>
                <CardDescription>Provide details about your cargo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cargoType">Cargo Type</Label>
                  <Select value={formData.cargoType} onValueChange={(value) => setFormData({ ...formData, cargoType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cargo type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CARGO_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.label}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight in kg"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>

                {formData.service.includes('FCL') && (
                  <div>
                    <Label htmlFor="containerSize">Container Size</Label>
                    <Select value={formData.containerSize} onValueChange={(value) => setFormData({ ...formData, containerSize: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select container size" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTAINER_SIZES.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label} - {size.dimensions}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="currency">Preferred Currency</Label>
                  <Select value={formData.currency} onValueChange={(value: 'USD' | 'LKR') => setFormData({ ...formData, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="LKR">LKR (Rs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCalculate}
                    disabled={!formData.cargoType || !formData.weight || loading}
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    {loading ? 'Calculating...' : 'Calculate Quote'}
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && quote && (
            <>
              <CardHeader>
                <CardTitle>Your Quote</CardTitle>
                <CardDescription>Estimated shipping cost</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Estimated Cost</p>
                  <p className="text-4xl font-bold text-primary">
                    {formatCurrency(quote.price, quote.currency)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Estimated delivery: {quote.estimatedDays} days
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From</span>
                    <span className="font-medium">{quote.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-medium">{quote.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{quote.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cargo Type</span>
                    <span className="font-medium">{quote.cargoType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight</span>
                    <span className="font-medium">{quote.weight} kg</span>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setStep(1); setQuote(null); }}>
                    New Quote
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={handleBookNow}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? 'Processing...' : 'Book Now'}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  * Prices are estimates and may vary based on actual cargo specifications and market conditions
                </p>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
