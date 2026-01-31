import api from './api'

export interface AdminStats {
  totalUsers: number
  totalShipments: number
  totalRevenue: number
  pendingQuotes: number
  activeShipments: number
  deliveredThisMonth: number
}

export interface AdminShipmentResponse {
  id: number
  trackingNumber: string
  customerId: number
  customerName: string
  customerEmail: string
  originCity: string
  destinationCity: string
  status: number
  weight: number
  serviceType: number
  estimatedDeliveryDate: string
  createdAt: string
}

export interface AdminUserResponse {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt: string
  customerCompanyName?: string
}

// Get dashboard statistics
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const response = await api.get('/admin/stats')
    return response.data
  } catch {
    // Return mock data if endpoint not available yet
    return {
      totalUsers: 0,
      totalShipments: 0,
      totalRevenue: 0,
      pendingQuotes: 0,
      activeShipments: 0,
      deliveredThisMonth: 0,
    }
  }
}

// Get all shipments (admin view)
export async function getAllShipments(): Promise<AdminShipmentResponse[]> {
  try {
    const response = await api.get('/admin/shipments')
    return response.data
  } catch {
    // Fallback to regular shipments endpoint
    const response = await api.get('/shipments')
    return response.data
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

// Update shipment status
export async function updateShipmentStatus(
  shipmentId: number,
  status: number
): Promise<void> {
  await api.patch(`/shipments/${shipmentId}/status`, { status })
}

// Toggle user active status
export async function toggleUserStatus(userId: number): Promise<void> {
  await api.patch(`/admin/users/${userId}/toggle-status`)
}

