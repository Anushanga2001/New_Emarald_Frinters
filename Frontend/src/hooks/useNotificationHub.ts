import { useEffect, useRef } from 'react'
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/services/queryKeys'
import { toast } from 'sonner'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5253/api'
const HUB_URL = API_BASE_URL.replace('/api', '') + '/hubs/notifications'

export function useNotificationHub() {
  const queryClient = useQueryClient()
  const connectionRef = useRef<HubConnection | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) return

    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build()

    connection.on('ReceiveNotification', (notification) => {
      // Invalidate notification queries to refresh the list and unread count
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount })

      // Show a toast for the real-time notification
      toast.info(notification.title, {
        description: notification.message,
      })
    })

    connection.start().catch((err) => {
      console.error('SignalR connection error:', err)
    })

    connectionRef.current = connection

    return () => {
      connection.stop()
    }
  }, [queryClient])
}
