import { useEffect, useRef, useState } from 'react'
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr'
import { vesselsService, type Vessel } from '@/services/vessels.service'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5253/api'
const HUB_URL = API_BASE_URL.replace('/api', '') + '/hubs/vessels'

export interface UseVesselsHubResult {
  vessels: Map<number, Vessel>
  isConnected: boolean
  error: string | null
}

export function useVesselsHub(): UseVesselsHubResult {
  const [vessels, setVessels] = useState<Map<number, Vessel>>(new Map())
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const connectionRef = useRef<HubConnection | null>(null)

  useEffect(() => {
    let cancelled = false

    // 1. Initial snapshot — pre-populate map before WS catches up.
    vesselsService
      .getSnapshot()
      .then((snapshot) => {
        if (cancelled) return
        setVessels((prev) => {
          const next = new Map(prev)
          for (const v of snapshot) next.set(v.mmsi, v)
          return next
        })
      })
      .catch((err) => {
        console.error('Vessel snapshot fetch failed:', err)
        if (!cancelled) setError('Failed to load initial vessel positions')
      })

    // 2. SignalR connection — live deltas.
    if (connectionRef.current) {
      connectionRef.current.stop()
      connectionRef.current = null
    }

    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build()

    connection.on('VesselUpdate', (vessel: Vessel) => {
      setVessels((prev) => {
        const next = new Map(prev)
        next.set(vessel.mmsi, vessel)
        return next
      })
    })

    connection.on('VesselRemoved', (mmsi: number) => {
      setVessels((prev) => {
        if (!prev.has(mmsi)) return prev
        const next = new Map(prev)
        next.delete(mmsi)
        return next
      })
    })

    connection.onreconnected(() => setIsConnected(true))
    connection.onclose(() => setIsConnected(false))

    connectionRef.current = connection

    connection
      .start()
      .then(() => {
        if (!cancelled) setIsConnected(true)
      })
      .catch((err) => {
        console.error('Vessels hub connection error:', err)
        if (!cancelled) setError('Live tracking connection failed')
      })

    return () => {
      cancelled = true
      connection.stop()
      connectionRef.current = null
    }
  }, [])

  return { vessels, isConnected, error }
}
