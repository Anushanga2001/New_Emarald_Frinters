import { Link } from 'react-router-dom'
import { Ship, Plane, Truck, Warehouse, FileText, Package, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SERVICES } from '@/lib/constants'

export function ServicesPage() {
  const iconMap: Record<string, any> = {
    Ship, Plane, Truck, Warehouse, FileText, Package
  }

  const detailedServices = SERVICES.map(service => ({
    ...service,
    features: [
      'Competitive pricing',
      'Real-time tracking',
      'Door-to-door delivery',
      'Insurance coverage available',
      'Expert handling and care',
    ]
  }))

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-primary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-primary/80">
              Comprehensive shipping and logistics solutions for all your needs
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {detailedServices.map((service) => {
              const Icon = iconMap[service.icon]
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{service.name}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <Link to="/quote" className="flex-1">
                        <Button className="w-full">
                          Get Quote
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to="/contact" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Contact Us
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            We offer tailored logistics solutions for your unique requirements
          </p>
          <Link to="/contact">
            <Button size="lg">Contact Our Team</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
