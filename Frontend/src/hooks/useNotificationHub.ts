import { useEffect, useRef } from 'react'
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/services/queryKeys'
import { toast } from 'react-toastify'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5253/api'
const HUB_URL = API_BASE_URL.replace('/api', '') + '/hubs/notifications'

export function useNotificationHub() {
  const queryClient = useQueryClient()
  const connectionRef = useRef<HubConnection | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) return

    // Stop any existing connection first (handles React StrictMode double-mount)
    if (connectionRef.current) {
      connectionRef.current.stop()
      connectionRef.current = null
    }

    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build()

    connection.on('ReceiveNotification', (notification) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount })

      toast.info(`${notification.title} — ${notification.message}`)
    })

    connectionRef.current = connection

    connection.start().catch((err) => {
      console.error('SignalR connection error:', err)
    })

    return () => {
      connection.stop()
      connectionRef.current = null
    }
  }, [queryClient])
}
