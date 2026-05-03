import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll to the top of the page on every pathname change.
 * React Router preserves scroll position by default; this restores the
 * standard "new page = top of page" behaviour users expect.
 *
 * Mount once inside <BrowserRouter>. Renders nothing.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}
