import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
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
      toast.success(`Welcome back, ${data.user.name}!`)
      // Redirect based on user role
      if (data.user.role === 'Admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/customer/dashboard')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed. Please check your credentials.')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      toast.success('Registration successful! Please log in with your credentials.')
      navigate('/auth/login?registered=true')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed. Please try again.')
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
  const isCustomer = user?.role === 'Customer'

  return {
    user,
    isAuthenticated,
    isAdmin,
    isCustomer,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  }
}
