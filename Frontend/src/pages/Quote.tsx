import { useState } from 'react'
import { notify } from '@/lib/toast'
import {
  Calculator, ArrowRight, ArrowLeft, Check, Clock, MapPin, Package as PackageIcon,
  Ship, Plane, Truck, Warehouse, FileText, Loader2, Route as RouteIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateQuote, saveQuote } from '@/services/quote.service'
import type { Quote } from '@/types'
import { cn, formatCurrency } from '@/lib/utils'
import { SERVICES, CARGO_TYPES, CONTAINER_SIZES } from '@/lib/constants'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Ship, Plane, Truck, Warehouse, FileText, Package: PackageIcon,
}

const STEPS = [
  { id: 1, label: 'Route' },
  { id: 2, label: 'Cargo' },
  { id: 3, label: 'Your Quote' },
]

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-destructive">
      {message}
    </p>
  )
}

export function QuotePage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    service: '',
    cargoType: '',
    weight: '',
    containerSize: '',
    currency: 'USD' as 'USD' | 'LKR',
  })

  const touch = (field: string) => setTouched((t) => ({ ...t, [field]: true }))

  // ---- Validation ----
  const weightNum = parseFloat(formData.weight)
  const errors: Record<string, string | undefined> = {
    origin: !formData.origin.trim() ? 'Enter where the cargo is coming from' : undefined,
    destination: !formData.destination.trim()
      ? 'Enter where the cargo is going'
      : formData.origin.trim() &&
          formData.origin.trim().toLowerCase() === formData.destination.trim().toLowerCase()
        ? 'Destination must be different from the origin'
        : undefined,
    service: !formData.service ? 'Choose a service' : undefined,
    cargoType: !formData.cargoType ? 'Select a cargo type' : undefined,
    weight:
      !formData.weight
        ? 'Enter the cargo weight'
        : !(weightNum > 0)
          ? 'Weight must be greater than 0'
          : undefined,
  }
  const step1Valid = !errors.origin && !errors.destination && !errors.service
  const step2Valid = !errors.cargoType && !errors.weight
  const show = (field: string) => (touched[field] ? errors[field] : undefined)

  const goToStep2 = () => {
    setTouched((t) => ({ ...t, origin: true, destination: true, service: true }))
    if (step1Valid) setStep(2)
  }

  const handleCalculate = async () => {
    setTouched((t) => ({ ...t, cargoType: true, weight: true }))
    if (!step2Valid) return
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
      notify.error('Error calculating quote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = async () => {
    if (!quote) return

    setBookingLoading(true)
    try {
      const savedQuote = await saveQuote(quote)
      notify.success(`Booking Confirmed! Your shipment has been booked successfully. Reference: ${savedQuote.id}`, {
        autoClose: 5000,
      })
      // Reset to start new quote after successful booking
      setTimeout(() => {
        resetAll()
      }, 2000)
    } catch (error) {
      notify.error('Error processing booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const resetAll = () => {
    setStep(1)
    setQuote(null)
    setTouched({})
  }

  const isFcl = formData.service.includes('FCL')
  const containerLabel = CONTAINER_SIZES.find((c) => c.value === formData.containerSize)?.label

  const summaryRows: { label: string; value?: string }[] = [
    { label: 'From', value: formData.origin.trim() },
    { label: 'To', value: formData.destination.trim() },
    { label: 'Service', value: formData.service },
    { label: 'Cargo', value: formData.cargoType },
    { label: 'Weight', value: weightNum > 0 ? `${weightNum} kg` : undefined },
    ...(isFcl ? [{ label: 'Container', value: containerLabel }] : []),
  ]

  return (
    <div className="bg-secondary/40 min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-cta mb-2">Instant estimate</p>
            <h1 className="text-3xl md:text-4xl mb-2">Get a Quote</h1>
            <p className="text-lg text-muted-foreground">
              Calculate shipping costs for your cargo in under a minute.
            </p>
          </div>

          {/* Stepper */}
          <nav aria-label="Quote progress" className="mb-8">
            <ol className="flex items-center">
              {STEPS.map((s, i) => {
                const done = step > s.id
                const current = step === s.id
                return (
                  <li key={s.id} className={cn('flex items-center', i < STEPS.length - 1 && 'flex-1')}>
                    <div className="flex items-center gap-3" aria-current={current ? 'step' : undefined}>
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                          done && 'bg-cta text-cta-foreground',
                          current && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                          !done && !current && 'bg-card text-muted-foreground ring-1 ring-border',
                        )}
                      >
                        {done ? <Check className="h-4 w-4" /> : s.id}
                      </span>
                      <span
                        className={cn(
                          'hidden sm:block text-sm font-medium',
                          current || done ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="mx-3 h-0.5 flex-1 rounded bg-border overflow-hidden">
                        <div className={cn('h-full bg-cta transition-all duration-500', done ? 'w-full' : 'w-0')} />
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <Card className="lg:col-span-2">
              {step === 1 && (
                <>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RouteIcon className="h-5 w-5 text-primary" /> Where is it going?
                    </CardTitle>
                    <CardDescription>Enter the route and pick a service</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="origin">Origin</Label>
                        <Input
                          id="origin"
                          placeholder="e.g., Singapore"
                          value={formData.origin}
                          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                          onBlur={() => touch('origin')}
                          aria-invalid={!!show('origin')}
                          aria-describedby="origin-error"
                          className={cn('mt-1.5', show('origin') && 'border-destructive')}
                        />
                        <FieldError id="origin-error" message={show('origin')} />
                      </div>
                      <div>
                        <Label htmlFor="destination">Destination</Label>
                        <Input
                          id="destination"
                          placeholder="e.g., Colombo, Sri Lanka"
                          value={formData.destination}
                          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                          onBlur={() => touch('destination')}
                          aria-invalid={!!show('destination')}
                          aria-describedby="destination-error"
                          className={cn('mt-1.5', show('destination') && 'border-destructive')}
                        />
                        <FieldError id="destination-error" message={show('destination')} />
                      </div>
                    </div>

                    <fieldset>
                      <legend className="text-sm font-medium mb-2">Service type</legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {SERVICES.map((service) => {
                          const Icon = iconMap[service.icon] ?? PackageIcon
                          const selected = formData.service === service.name
                          return (
                            <button
                              key={service.id}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={() => {
                                setFormData({ ...formData, service: service.name })
                                touch('service')
                              }}
                              className={cn(
                                'flex items-start gap-3 rounded-xl border p-3 text-left transition-all',
                                selected
                                  ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                                  : 'bg-card hover:border-primary/40 hover:bg-secondary/50',
                              )}
                            >
                              <span
                                className={cn(
                                  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                                  selected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary',
                                )}
                              >
                                <Icon className="h-5 w-5" />
                              </span>
                              <span>
                                <span className="block text-sm font-semibold">{service.name}</span>
                                <span className="block text-xs text-muted-foreground">{service.description}</span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      <FieldError id="service-error" message={show('service')} />
                    </fieldset>

                    <Button size="lg" className="w-full" onClick={goToStep2}>
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </>
              )}

              {step === 2 && (
                <>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PackageIcon className="h-5 w-5 text-primary" /> Tell us about your cargo
                    </CardTitle>
                    <CardDescription>These details determine your price</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <Label htmlFor="cargoType">Cargo type</Label>
                      <Select
                        value={formData.cargoType}
                        onValueChange={(value) => {
                          setFormData({ ...formData, cargoType: value })
                          touch('cargoType')
                        }}
                      >
                        <SelectTrigger id="cargoType" className={cn('mt-1.5', show('cargoType') && 'border-destructive')}>
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
                      <FieldError id="cargoType-error" message={show('cargoType')} />
                    </div>

                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        min="0"
                        inputMode="decimal"
                        placeholder="Enter weight in kg"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        onBlur={() => touch('weight')}
                        aria-invalid={!!show('weight')}
                        aria-describedby="weight-error"
                        className={cn('mt-1.5', show('weight') && 'border-destructive')}
                      />
                      <FieldError id="weight-error" message={show('weight')} />
                    </div>

                    {isFcl && (
                      <div>
                        <Label htmlFor="containerSize">Container size</Label>
                        <Select
                          value={formData.containerSize}
                          onValueChange={(value) => setFormData({ ...formData, containerSize: value })}
                        >
                          <SelectTrigger id="containerSize" className="mt-1.5">
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
                      <span className="text-sm font-medium">Preferred currency</span>
                      <div
                        role="radiogroup"
                        aria-label="Preferred currency"
                        className="mt-1.5 inline-flex rounded-lg bg-secondary p-1"
                      >
                        {(['USD', 'LKR'] as const).map((c) => (
                          <button
                            key={c}
                            type="button"
                            role="radio"
                            aria-checked={formData.currency === c}
                            onClick={() => setFormData({ ...formData, currency: c })}
                            className={cn(
                              'rounded-md px-4 py-1.5 text-sm font-semibold transition-colors',
                              formData.currency === c
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                            )}
                          >
                            {c === 'USD' ? 'USD ($)' : 'LKR (Rs)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button size="lg" variant="cta" className="flex-1" onClick={handleCalculate} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />}
                        {loading ? 'Calculating...' : 'Calculate Quote'}
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}

              {step === 3 && quote && (
                <CardContent className="p-0">
                  <div className="rounded-t-xl bg-navy text-navy-foreground p-8 text-center">
                    <p className="text-sm uppercase tracking-wider text-white/70 mb-2">Estimated cost</p>
                    <p className="font-heading text-5xl font-extrabold text-white tracking-tight">
                      {formatCurrency(quote.price, quote.currency)}
                    </p>
                    <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/90">
                      <Clock className="h-4 w-4" /> Estimated delivery: {quote.estimatedDays} days
                    </p>
                  </div>

                  <div className="p-6 space-y-6">
                    <dl className="divide-y">
                      {[
                        ['From', quote.origin],
                        ['To', quote.destination],
                        ['Service', quote.service],
                        ['Cargo type', quote.cargoType],
                        ['Weight', `${quote.weight} kg`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between py-2.5 text-sm">
                          <dt className="text-muted-foreground">{label}</dt>
                          <dd className="font-medium text-right">{value}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" size="lg" className="flex-1" onClick={resetAll}>
                        New Quote
                      </Button>
                      <Button size="lg" variant="cta" className="flex-1" onClick={handleBookNow} disabled={bookingLoading}>
                        {bookingLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {bookingLoading ? 'Processing...' : 'Book Now'}
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      * Prices are estimates and may vary based on actual cargo specifications and market conditions
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Live summary */}
            {step < 3 && (
              <aside className="lg:sticky lg:top-24">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> Your shipment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-3 text-sm">
                      {summaryRows.map((row) => (
                        <div key={row.label} className="flex justify-between gap-4">
                          <dt className="text-muted-foreground">{row.label}</dt>
                          <dd className={cn('text-right font-medium', !row.value && 'text-muted-foreground/60')}>
                            {row.value || '—'}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 border-t pt-4 text-xs text-muted-foreground">
                      Your price appears after the next step. No account fees, no obligation.
                    </p>
                  </CardContent>
                </Card>
              </aside>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
