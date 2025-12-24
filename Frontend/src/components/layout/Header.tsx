import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Ship, Menu, X, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { COMPANY_INFO } from '@/lib/constants'
import { useAuth } from '@/hooks/useAuth'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Track Shipment', href: '/tracking' },
    { name: 'Get Quote', href: '/quote' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <Ship className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900">{COMPANY_INFO.name}</h1>
              <p className="text-xs text-slate-600">{COMPANY_INFO.tagline}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-slate-700 hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'Admin' ? '/admin/dashboard' : '/customer/dashboard'}
                  className="text-slate-700 hover:text-primary transition-colors font-medium flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <Button
                  onClick={() => {
                    logout()
                    navigate('/')
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/auth/login">Login</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/auth/register">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'Admin' ? '/admin/dashboard' : '/customer/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <Button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                    navigate('/')
                  }}
                  variant="outline"
                  className="mt-2 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="mt-2">
                  <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 mt-2">
                  <Link to="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
