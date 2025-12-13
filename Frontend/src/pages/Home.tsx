import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Ship, Plane, Truck, Warehouse, FileText, Package, ArrowRight, CheckCircle2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SERVICES } from '@/lib/constants'

export function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState('')

  const features = [
    { icon: CheckCircle2, title: '24/7 Support', description: 'Round-the-clock customer service' },
    { icon: CheckCircle2, title: 'Global Network', description: 'Worldwide shipping coverage' },
    { icon: CheckCircle2, title: 'Real-time Tracking', description: 'Track your shipment anytime' },
    { icon: CheckCircle2, title: 'Secure Handling', description: 'Safe and secure cargo management' },
  ]

  const iconMap: Record<string, any> = {
    Ship, Plane, Truck, Warehouse, FileText, Package
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#000000] text-primary py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Trusted Shipping Partner in Sri Lanka
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary/80">
              Fast, Reliable, and Secure Freight Solutions for Your Business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/quote">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Get a Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent hover:bg-primary/10 border-primary text-primary">
                  Our Services
                </Button>
              </Link>
            </div>

            {/* Quick Track Widget */}
            <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-left">Track Your Shipment</CardTitle>
                <CardDescription className="text-left">Enter your tracking number to get real-time updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter tracking number (e.g., LS2024001)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="flex-1"
                  />
                  <Link to={`/tracking?q=${trackingNumber}`}>
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Track
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-left">
                  Try: LS2024001 or LS2024002
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive shipping and logistics solutions tailored to your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => {
              const Icon = iconMap[service.icon]
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/services/${service.id}`}>
                      <Button variant="link" className="p-0">
                        Learn More <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose New Emarald Frinters?</h2>
            <p className="text-lg text-muted-foreground">Excellence in every shipment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Ship?</h2>
          <p className="text-xl mb-8 text-primary/80">Get started with your shipment today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button size="lg" variant="secondary">
                Book Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-transparent hover:bg-primary/10 border-primary text-primary">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
