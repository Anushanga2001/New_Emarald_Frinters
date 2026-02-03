import axios from 'axios'
import { toast } from 'sonner'

// API base URL - points to .NET backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5253/api'

// Guard to prevent multiple 401 redirects when multiple requests fail simultaneously
let isRedirectingToLogin = false

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401/403 responses for authorization
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirectingToLogin) {
      // Unauthorized - clear auth and redirect to login (with race condition guard)
      isRedirectingToLogin = true
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      toast.error('Session expired. Please log in again.')
      // Small delay to allow toast to display before redirect
      setTimeout(() => {
        window.location.href = '/auth/login'
      }, 500)
    }
    if (error.response?.status === 403) {
      // Forbidden - user authenticated but not authorized
      toast.error('Access denied - insufficient permissions')
    }
    return Promise.reject(error)
  }
)

export default api
