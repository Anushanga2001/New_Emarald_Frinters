import api from './api'

export interface AdminStats {
  totalUsers: number
  pendingQuotes: number
  totalRevenue: number
}

export interface AdminUserResponse {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt: string
  companyName?: string
}

// Get dashboard statistics
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const response = await api.get('/admin/stats')
    return response.data
  } catch {
    return {
      totalUsers: 0,
      pendingQuotes: 0,
      totalRevenue: 0,
    }
  }
}

// Get all users (admin view)
export async function getAllUsers(): Promise<AdminUserResponse[]> {
  try {
    const response = await api.get('/admin/users')
    return response.data
  } catch {
    return []
  }
}

// Toggle user active status
export async function toggleUserStatus(userId: number): Promise<void> {
  await api.patch(`/admin/users/${userId}/toggle-status`)
}
