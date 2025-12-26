import { Target, Users, Award, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Leadership } from '@/components/about/Leadership'

export function AboutPage() {
  const stats = [
    { label: 'Years of Experience', value: '15+' },
    { label: 'Shipments Delivered', value: '50K+' },
    { label: 'Countries Served', value: '100+' },
    { label: 'Happy Clients', value: '2K+' },
  ]

  const values = [
    {
      icon: Target,
      title: 'Reliability',
      description: 'On-time delivery and consistent service quality you can count on',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your success is our priority with dedicated support',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Industry-leading standards and best practices',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Worldwide network for seamless international shipping',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-primary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About New Emarald Frinters</h1>
            <p className="text-xl text-primary/80">
              Your trusted partner in freight forwarding and logistics since 2009
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <Leadership />

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-4">
                Founded in 2009, New Emarald Frinters has grown from a small local freight forwarder to one of 
                Sri Lanka's most trusted logistics partners. With our headquarters in Colombo and strong 
                connections to major ports including Colombo Port and Hambantota Port, we've built a 
                reputation for reliability and excellence.
              </p>
              <p className="text-muted-foreground mb-4">
                Our team of experienced logistics professionals understands the unique challenges of 
                international trade and works tirelessly to provide seamless shipping solutions. We've 
                invested in modern technology, established partnerships with leading carriers worldwide, 
                and built a network that spans over 100 countries.
              </p>
              <p className="text-muted-foreground">
                Today, we continue to innovate and expand our services, always keeping our customers' 
                needs at the forefront. Whether you're a small business shipping your first container 
                or a large enterprise managing complex supply chains, we're here to help you succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
