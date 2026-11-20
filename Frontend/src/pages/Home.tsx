import { Link } from 'react-router-dom'
import {
  Ship, Plane, Truck, Warehouse, FileText, Package,
  ArrowRight, Headphones, Globe2, Calculator, ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { SERVICES } from '@/lib/constants'
import { Seo } from '@/components/seo/Seo'
import cargo from '@/assets/cargo-vessel-ship-2.jpg'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Ship, Plane, Truck, Warehouse, FileText, Package,
}

const trustChips = ['Sea Freight FCL / LCL', 'Air Freight', 'Customs Clearance', 'Door-to-door']

const stats = [
  { value: '15+', label: 'Years of Experience' },
  { value: '10K+', label: 'Shipments Delivered' },
  { value: '50+', label: 'Countries Served' },
  { value: '98%', label: 'On-Time Delivery' },
]

const features = [
  { icon: Headphones, title: '24/7 Support', description: 'Round-the-clock customer service' },
  { icon: Globe2, title: 'Global Network', description: 'Worldwide shipping coverage' },
  { icon: Calculator, title: 'Instant Quotes', description: 'Get a shipping estimate in under a minute' },
  { icon: ShieldCheck, title: 'Secure Handling', description: 'Safe and secure cargo management' },
]

export function HomePage() {
  return (
    <div>
      <Seo
        title="Trusted Freight & Logistics in Sri Lanka"
        description="New Emarald Freighter offers reliable sea freight (FCL/LCL), air freight, land transportation, warehousing, and customs clearance services across Sri Lanka. Get a quote today."
        path="/"
      />

      {/* Hero */}
      <section
        className="relative text-white bg-navy bg-cover bg-center"
        style={{ backgroundImage: `url(${cargo})` }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/30"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 relative pt-20 pb-32 md:pt-28 md:pb-40">
          <div className="max-w-2xl">
            <AnimateOnScroll animation="fade-in" duration={800}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90 ring-1 ring-white/20 mb-6">
                <Ship className="h-4 w-4" /> Freight forwarding · Colombo, Sri Lanka
              </span>
              <h1 className="text-4xl md:text-6xl leading-[1.05] mb-6">
                Your Trusted Shipping Partner in Sri Lanka
              </h1>
            </AnimateOnScroll>
            <AnimateOnScroll animation="slide-up" delay={150}>
              <p className="text-lg md:text-xl mb-8 text-white/85 max-w-xl">
                Fast, reliable and secure freight solutions — by sea, air and land — for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button asChild size="lg" variant="cta" className="w-full sm:w-auto">
                  <Link to="/quote">
                    Get a Quote <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-white/60 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/services">Our Services</Link>
                </Button>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="slide-up" delay={300}>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
                {trustChips.map((chip) => (
                  <li key={chip} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cta" /> {chip}
                  </li>
                ))}
              </ul>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Stats strip, overlapping the hero */}
      <section className="relative z-10 -mt-16 md:-mt-20">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="slide-up">
            <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl bg-card shadow-xl ring-1 ring-border divide-x divide-y md:divide-y-0 divide-border overflow-hidden">
              {stats.map((stat) => (
                <div key={stat.label} className="px-6 py-6 md:py-8 text-center">
                  <div className="font-heading text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="slide-up">
            <div className="max-w-2xl mb-12">
              <p className="text-sm font-semibold uppercase tracking-wider text-cta mb-2">What we do</p>
              <h2 className="text-3xl md:text-4xl mb-3">Our Services</h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive shipping and logistics solutions tailored to your needs
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => {
              const Icon = iconMap[service.icon] ?? Package
              return (
                <AnimateOnScroll key={service.id} animation="zoom-in" delay={index * 80}>
                  <Link to="/services" className="group block h-full rounded-xl focus-visible:outline-none">
                    <Card className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1 group-hover:border-primary/40">
                      <CardHeader>
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-7 w-7" />
                        </div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <CardDescription className="text-base">{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                          Learn more
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimateOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-secondary/60">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll animation="slide-right">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-cta mb-2">Why choose us</p>
                <h2 className="text-3xl md:text-4xl mb-4">About New Emarald Freighter</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  For over 15 years we've connected Sri Lankan businesses to the world — moving cargo
                  by sea, air and land with the same care we'd give our own.
                </p>
                <p className="text-muted-foreground mb-6">
                  From a single FCL booking to end-to-end customs clearance, our team handles the
                  details so you can focus on growing your business.
                </p>
                <Button asChild>
                  <Link to="/about">
                    Learn About Us <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="slide-left" delay={150}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature.title} className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-cta/10 text-cta">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 bg-navy text-navy-foreground">
        <div className="container mx-auto px-4 text-center">
          <AnimateOnScroll animation="zoom-in">
            <h2 className="text-3xl md:text-4xl text-white mb-4">Ready to Ship?</h2>
            <p className="text-xl mb-8 text-white/80">Get a quote and get your cargo moving today</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" variant="cta">
                <Link to="/quote">Get a Quote</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white/60 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
