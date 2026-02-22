import api from './api'

export interface NotificationResponse {
  id: number
  title: string
  message: string
  type: number
  isRead: boolean
  referenceId: string | null
  createdAt: string
}

export interface UnreadCountResponse {
  count: number
}

export const NotificationType = {
  ShipmentCreated: 1,
  ShipmentStatusUpdate: 2,
  ShipmentDelivered: 3,
  ShipmentCancelled: 4,
  QuoteCreated: 5,
  General: 6,
} as const

export async function getNotifications(page = 1, pageSize = 20): Promise<NotificationResponse[]> {
  const response = await api.get('/notifications', { params: { page, pageSize } })
  return response.data
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  const response = await api.get('/notifications/unread-count')
  return response.data
}

export async function markNotificationAsRead(id: number): Promise<void> {
  await api.put(`/notifications/${id}/read`)
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await api.put('/notifications/mark-all-read')
}
