import { Link } from 'react-router-dom'
import { Ship, Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react'
import { COMPANY_INFO } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Track Shipment', href: '/tracking' },
    { name: 'Get Quote', href: '/quote' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ]

  const services = [
    { name: 'Sea Freight', href: '/services/sea-freight' },
    { name: 'Air Freight', href: '/services/air-freight' },
    { name: 'Land Transport', href: '/services/land-transport' },
    { name: 'Warehousing', href: '/services/warehousing' },
    { name: 'Customs Clearance', href: '/services/customs' },
  ]

  return (
    <footer className="bg-white text-black">
      <div className="bg-grey-50 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary rounded-lg p-2">
                <Ship className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-black text-lg">{COMPANY_INFO.name}</h3>
            </div>
            <p className="text-sm mb-4">{COMPANY_INFO.tagline}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {COMPANY_INFO.address.street}<br />
                  {COMPANY_INFO.address.city}<br />
                  {COMPANY_INFO.address.country}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-primary">
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-primary">
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-black mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-black mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              {services.map((service) => (
                <li key={service.name}>
                  <Link to={service.href} className="hover:text-primary transition-colors">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours & Social */}
          <div>
            <h4 className="font-semibold text-black mb-4">Business Hours</h4>
            <p className="text-sm mb-6">{COMPANY_INFO.hours}</p>
            
            <h4 className="font-semibold text-black mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href={COMPANY_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-200 p-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={COMPANY_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-200 p-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={COMPANY_INFO.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-200 p-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-300" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
