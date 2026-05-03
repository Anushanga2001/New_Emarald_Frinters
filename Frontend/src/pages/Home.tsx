import { Link } from 'react-router-dom'
import { Ship, Plane, Truck, Warehouse, FileText, Package, ArrowRight, CheckCircle2, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { SERVICES } from '@/lib/constants'
import { Seo } from '@/components/seo/Seo'
import cargo from '@/assets/cargo-vessel-ship-2.jpg'

export function HomePage() {

  const features = [
    { icon: CheckCircle2, title: '24/7 Support', description: 'Round-the-clock customer service' },
    { icon: CheckCircle2, title: 'Global Network', description: 'Worldwide shipping coverage' },
    { icon: CheckCircle2, title: 'Real-time Tracking', description: 'Track your shipment anytime' },
    { icon: CheckCircle2, title: 'Secure Handling', description: 'Safe and secure cargo management' },
  ]

  const stats = [
    { value: '15+', label: 'Years of Experience' },
    { value: '10K+', label: 'Shipments Delivered' },
    { value: '50+', label: 'Countries Served' },
    { value: '98%', label: 'On-Time Delivery' },
  ]

  const testimonials = [
    {
      quote: 'New Emarald handled our urgent FCL shipment to Singapore flawlessly. Clear updates the whole way.',
      author: 'Anushanga Kaluarachchi',
      role: 'Operations Manager, Ceylon Apparel',
    },
    {
      quote: 'Their customs clearance team saved us days. We now route all our air freight through them.',
      author: 'Ravi Perera',
      role: 'Logistics Coordinator, Perera Exports',
    },
    {
      quote: 'Reliable, transparent pricing, and the warehousing has been a game changer for our distribution.',
      author: 'Samantha Fernando',
      role: 'Supply Chain Director, Lanka Distributors',
    },
  ]

  const iconMap: Record<string, any> = {
    Ship, Plane, Truck, Warehouse, FileText, Package
  }

  return (
    <div>
      <Seo
        title="Trusted Freight & Logistics in Sri Lanka"
        description="New Emarald Freighter offers reliable sea freight (FCL/LCL), air freight, land transportation, warehousing, and customs clearance services across Sri Lanka. Get a quote today."
        path="/"
      />
      {/* Hero Section */}
      <section
        className="relative text-white py-20 bg-black bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cargo})` }}
      >
        {/* Gradient overlay: lighter at top so the ship stays visible, darker at bottom for text legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/85"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <AnimateOnScroll animation="fade-in" duration={900}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                Your Trusted Shipping Partner in Sri Lanka
              </h1>
            </AnimateOnScroll>
            <AnimateOnScroll animation="slide-up" delay={150}>
              <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                Fast, Reliable, and Secure Freight Solutions for Your Business
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll animation="slide-up" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/quote">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Get a Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent hover:bg-white/10 border-white text-white">
                    Our Services
                  </Button>
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="slide-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive shipping and logistics solutions tailored to your needs
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => {
              const Icon = iconMap[service.icon]
              return (
                <AnimateOnScroll
                  key={service.id}
                  animation="zoom-in"
                  delay={index * 100}
                >
                  <Card className="bg-gray-100 hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to={`/services`}>
                        <Button variant="link" className="p-0">
                          Learn More <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll animation="slide-right">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">About New Emarald Freighter</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  For over 15 years we've connected Sri Lankan businesses to the world — moving cargo
                  by sea, air and land with the same care we'd give our own.
                </p>
                <p className="text-muted-foreground mb-6">
                  From a single FCL booking to end-to-end customs clearance, our team handles the
                  details so you can focus on growing your business.
                </p>
                <Link to="/about">
                  <Button variant="default">
                    Learn About Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="slide-left" delay={150}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature.title} className="bg-slate-50 rounded-lg p-5">
                    <feature.icon className="h-6 w-6 text-primary mb-2" />
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="slide-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">By the Numbers</h2>
              <p className="text-lg text-muted-foreground">A track record built on consistency</p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <AnimateOnScroll
                key={stat.label}
                animation="zoom-in"
                delay={index * 120}
              >
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="slide-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-lg text-muted-foreground">
                Trusted by importers, exporters and freight forwarders across the region
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <AnimateOnScroll
                key={t.author}
                animation="slide-up"
                delay={index * 150}
              >
                <Card className="bg-gray-100 h-full">
                  <CardContent className="pt-6">
                    <Quote className="h-8 w-8 text-primary/30 mb-4" />
                    <p className="text-muted-foreground mb-6 italic">"{t.quote}"</p>
                    <div>
                      <div className="font-semibold">{t.author}</div>
                      <div className="text-sm text-muted-foreground">{t.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimateOnScroll animation="zoom-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Ship?</h2>
            <p className="text-xl mb-8 text-white/80">Get started with your shipment today</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quote">
                <Button size="lg" variant="secondary">
                  Book Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-transparent hover:bg-white/10 border-white text-white">
                  Contact Us
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
