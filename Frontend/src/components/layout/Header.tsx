import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Ship, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { COMPANY_INFO } from '@/lib/constants'
import { useAuth } from '@/hooks/useAuth'
import { NotificationBell } from './NotificationBell'

interface DropdownItem {
  name: string
  href: string
  destructive?: boolean
  action?: () => void
}

interface NavItem {
  name: string
  href?: string
  items?: DropdownItem[]
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const headerRef = useRef<HTMLElement>(null)

  // ── Navigation structure ──────────────────────────────────────────
  const navItems: NavItem[] = [
    { name: 'Home', href: '/' },   
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    {
      name: 'Services',
      items: [
        { name: 'Get a Quote', href: '/quote' },
        { name: 'All Quotes', href: '/quotes' },
      ],
    }
  ]

  const accountItem: NavItem = {
    name: 'My Account',
    items: [
      {
        name: 'Dashboard',
        href: user?.role === 'Admin' ? '/admin/dashboard' : '/customer/dashboard',
      },
      { name: 'My Profile', href: '/customer/profile' },
      { name: 'Logout', href: '#', destructive: true, action: logout },
    ],
  }

  // ── Helpers ───────────────────────────────────────────────────────
  const isActive = useCallback(
    (href: string) => {
      if (href === '/') return location.pathname === '/'
      return location.pathname === href || location.pathname.startsWith(href + '/')
    },
    [location.pathname],
  )

  const hasActiveChild = (items: DropdownItem[]) =>
    items.some((i) => isActive(i.href))

  // ── Side effects ──────────────────────────────────────────────────
  // Close desktop dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Close everything on navigation
  useEffect(() => {
    setActiveDropdown(null)
    setMobileOpen(false)
    setMobileDropdown(null)
  }, [location.pathname])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // ── Desktop dropdown renderer ─────────────────────────────────────
  function DesktopDropdown({ item }: { item: NavItem }) {
    const open = activeDropdown === item.name
    const active = item.items ? hasActiveChild(item.items) : false

    return (
      <div className="relative">
        <button
          onClick={() => setActiveDropdown(open ? null : item.name)}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors
            ${active || open ? 'text-primary' : 'text-slate-700 hover:bg-slate-50'}`}
        >
          {item.name}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Panel */}
        <div
          className={`absolute left-0 top-full mt-1 min-w-[190px] bg-white border border-slate-200 rounded-lg overflow-hidden
            transition-all duration-200 origin-top
            ${open ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'}`}
        >
          {item.items?.map((sub) =>
            sub.action ? (
              <button
                key={sub.name}
                onClick={() => { sub.action?.(); setActiveDropdown(null) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                  ${sub.destructive
                    ? 'text-red-600 hover:bg-red-50 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'}`}
              >
                {sub.name}
              </button>
            ) : (
              <Link
                key={sub.name}
                to={sub.href}
                className={`block px-4 py-2.5 text-sm transition-colors
                  ${isActive(sub.href)
                    ? 'text-primary bg-primary/5 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'}`}
              >
                {sub.name}
              </Link>
            ),
          )}
        </div>
      </div>
    )
  }

  // ── Mobile accordion section renderer ─────────────────────────────
  function MobileSection({ item }: { item: NavItem }) {
    const open = mobileDropdown === item.name

    return (
      <div>
        <button
          onClick={() => setMobileDropdown(open ? null : item.name)}
          className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors
            ${item.items && hasActiveChild(item.items) ? 'text-primary' : 'text-slate-700 hover:bg-slate-50'}`}
        >
          {item.name}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        <div
          className={`overflow-hidden transition-[max-height] duration-300 ease-in-out
            ${open ? 'max-h-60' : 'max-h-0'}`}
        >
          {item.items?.map((sub) =>
            sub.action ? (
              <button
                key={sub.name}
                onClick={() => { sub.action?.(); setMobileOpen(false) }}
                className={`w-full text-left pl-8 pr-4 py-2.5 text-sm transition-colors
                  ${sub.destructive
                    ? 'text-red-600 hover:bg-red-50 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {sub.name}
              </button>
            ) : (
              <Link
                key={sub.name}
                to={sub.href}
                onClick={() => setMobileOpen(false)}
                className={`block pl-8 pr-4 py-2.5 text-sm transition-colors
                  ${isActive(sub.href)
                    ? 'text-primary font-medium bg-primary/5'
                    : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {sub.name}
              </Link>
            ),
          )}
        </div>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────
  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="bg-primary rounded-lg p-2">
                <Ship className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 hidden sm:inline">
                {COMPANY_INFO.name}
              </span>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden md:flex items-center gap-1">
              {/* Home (standalone) */}
              <Link
                to="/"
                className={`px-3 py-2 text-sm font-medium rounded transition-colors
                  ${isActive('/') ? 'text-primary' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 text-sm font-medium rounded transition-colors
                  ${isActive('/about') ? 'text-primary' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-2 text-sm font-medium rounded transition-colors
                  ${isActive('/contact') ? 'text-primary' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                Contact
              </Link>

              {/* Dropdown groups */}
              {navItems.filter((n) => n.items).map((item) => (
                <DesktopDropdown key={item.name} item={item} />
              ))}

              {/* Authenticated: notification bell + My Account dropdown */}
              {isAuthenticated ? (
                <div className="flex items-center gap-1 ml-auto">
                  <DesktopDropdown item={accountItem} />
                  <NotificationBell />
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-auto">
                  <Button asChild variant="ghost" size="sm" className="hover:text-inherit">
                    <Link to="/auth/login">Login</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                    <Link to="/auth/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>

            {/* ── Hamburger button ── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        className={`fixed inset-0 bg-black/25 z-40 md:hidden transition-opacity duration-300
          ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile slide-out drawer ── */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white border-l border-slate-200 z-50 md:hidden
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
          <span className="font-bold text-lg text-slate-900">{COMPANY_INFO.name}</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer body */}
        <nav className="overflow-y-auto h-[calc(100%-4rem)]">
          {/* Home */}
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className={`block px-4 py-3 text-sm font-medium transition-colors
              ${isActive('/') ? 'text-primary bg-primary/5' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            Home
          </Link>

          {/* Dropdown groups */}
          {navItems.filter((n) => n.items).map((item) => (
            <MobileSection key={item.name} item={item} />
          ))}

          {/* Divider */}
          <div className="border-t border-slate-200 my-2" />

          {/* Auth section */}
          {isAuthenticated ? (
            <>
              <div className="px-4 py-2">
                <NotificationBell />
              </div>
              <MobileSection item={accountItem} />
            </>
          ) : (
            <div className="flex flex-col gap-2 px-4 py-3">
              <Button asChild variant="ghost" className="w-full justify-center">
                <Link to="/auth/login" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button asChild className="w-full justify-center bg-primary hover:bg-primary/90">
                <Link to="/auth/register" onClick={() => setMobileOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}
