import { Navigate } from 'react-router-dom'
import { authApi } from '@/services/authApi'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'Customer' | 'Admin' | 'Staff'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const token = authApi.getToken()
  const user = authApi.getCurrentUser()

  if (!token || !user) {
    return <Navigate to="/auth/login" replace />
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'Admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
