import { useAuth } from '@/hooks/useAuth'

interface AdminOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Wrapper component that only renders children for admin users.
 * Use this for inline admin controls on shared pages.
 */
export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

