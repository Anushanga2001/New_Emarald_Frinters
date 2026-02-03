import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi, type LoginRequest, type RegisterRequest } from '@/services/authApi'
import { queryKeys } from '@/services/queryKeys'

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const user = authApi.getCurrentUser()

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.user, data.user)
      // Redirect based on user role
      if (data.user.role === 'Admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/customer/dashboard')
      }
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      // Registration successful - redirect to login page with success message
      // User must log in with their new credentials
      navigate('/auth/login?registered=true')
    },
  })

  const logout = () => {
    authApi.logout()
    queryClient.clear()
    toast.success('You have been logged out successfully')
    navigate('/')
  }

  const isAuthenticated = !!authApi.getToken()

  // Role helper utilities
  const isAdmin = user?.role === 'Admin'
  const isStaff = user?.role === 'Staff'
  const isCustomer = user?.role === 'Customer'

  return {
    user,
    isAuthenticated,
    isAdmin,
    isStaff,
    isCustomer,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  }
}
