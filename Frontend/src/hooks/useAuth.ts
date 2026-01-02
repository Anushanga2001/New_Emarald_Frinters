import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
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
      queryClient.setQueryData(queryKeys.auth.user, authApi.getCurrentUser())
      navigate('/customer/dashboard')
    },
  })

  const logout = () => {
    authApi.logout()
    queryClient.clear()
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
