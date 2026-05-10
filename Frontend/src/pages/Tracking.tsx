import { useEffect, useMemo, useState } from 'react'
import { Ship, Search, Wifi, WifiOff, Plus, X, Globe, Loader2, AlertTriangle } from 'lucide-react'
import { Seo } from '@/components/seo/Seo'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useVesselsHub } from '@/hooks/useVesselsHub'
import { VesselTrackingMap } from '@/components/tracking/VesselTrackingMap'
import { vesselsService } from '@/services/vessels.service'
import { notify } from '@/lib/toast'

function isValidMmsi(input: string): boolean {
  return /^\d{7,9}$/.test(input.trim())
}

// If a tracked MMSI hasn't yielded any AIS report after this long, show a warning
// suggesting the vessel may be docked, in a coverage gap, or the MMSI is invalid.
const NO_DATA_WARN_MS = 2 * 60 * 1000

export function TrackingPage() {
  const { vessels, isConnected, error } = useVesselsHub()
  const [query, setQuery] = useState('')
  const [tracked, setTracked] = useState<number[]>([])
  // When each tracked MMSI started waiting for AIS data — used to show a "no data" warning
  // after NO_DATA_WARN_MS has elapsed without any position arriving.
  const [trackedAt, setTrackedAt] = useState<Map<number, number>>(new Map())
  const [busyMmsi, setBusyMmsi] = useState<number | null>(null)
  const [adding, setAdding] = useState(false)
  // Ticker that forces a re-render so the timeout warning appears without user interaction.
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(id)
  }, [])

  // Load existing tracked list on mount. We don't know when previously-tracked MMSIs
  // were originally added, so we treat "now" as the start of waiting — giving them a
  // fresh grace period instead of warning immediately on page load.
  useEffect(() => {
    vesselsService
      .getTracked()
      .then((mmsis) => {
        setTracked(mmsis)
        const t = Date.now()
        setTrackedAt(new Map(mmsis.map((m) => [m, t])))
      })
      .catch(() => {
        /* non-fatal — list just stays empty */
      })
  }, [])

  const trimmed = query.trim()
  const queryIsMmsi = isValidMmsi(trimmed)
  const queryMmsi = queryIsMmsi ? Number(trimmed) : null
  const alreadyTracked = queryMmsi != null && tracked.includes(queryMmsi)

  const handleTrack = async () => {
    if (queryMmsi == null || alreadyTracked) return
    setAdding(true)
    try {
      await vesselsService.addTracked(queryMmsi)
      setTracked((prev) => (prev.includes(queryMmsi) ? prev : [...prev, queryMmsi]))
      setTrackedAt((prev) => {
        const next = new Map(prev)
        next.set(queryMmsi, Date.now())
        return next
      })
      notify.info(`Now tracking MMSI ${queryMmsi}. The feed will switch to global mode.`)
      setQuery('')
    } catch (err) {
      console.error(err)
      notify.error('Could not add tracking — check the MMSI and try again.')
    } finally {
      setAdding(false)
    }
  }

  const handleUntrack = async (mmsi: number) => {
    setBusyMmsi(mmsi)
    try {
      await vesselsService.removeTracked(mmsi)
      setTracked((prev) => prev.filter((m) => m !== mmsi))
      setTrackedAt((prev) => {
        const next = new Map(prev)
        next.delete(mmsi)
        return next
      })
    } catch (err) {
      console.error(err)
      notify.error(`Could not remove tracking for MMSI ${mmsi}.`)
    } finally {
      setBusyMmsi(null)
    }
  }

  const vesselList = useMemo(() => {
    const all = Array.from(vessels.values())
    const q = trimmed.toLowerCase()
    const filtered = q
      ? all.filter(
          (v) => v.name?.toLowerCase().includes(q) || String(v.mmsi).includes(q),
        )
      : all
    return filtered.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
  }, [vessels, trimmed])

  const trackingMode = tracked.length > 0

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Seo
        title="Live Vessel Tracking"
        description="Real-time AIS tracking of ships around Sri Lankan waters. Track specific vessels by MMSI."
        path="/tracking"
      />

      {/* Header strip */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ship className="h-5 w-5 text-primary" />
          <h1 className="font-semibold text-slate-900">Live Vessel Tracking</h1>
          <span className="text-xs text-slate-500">
            ({vesselList.length} {vesselList.length === 1 ? 'vessel' : 'vessels'})
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {isConnected ? (
            <span className="flex items-center gap-1 text-green-600">
              <Wifi className="h-3.5 w-3.5" /> Live
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400">
              <WifiOff className="h-3.5 w-3.5" /> Connecting…
            </span>
          )}
        </div>
      </div>

      {/* Mode banner */}
      {trackingMode && (
        <div className="bg-blue-50 border-b border-blue-200 text-blue-900 text-xs px-4 py-2 flex items-center gap-2">
          <Globe className="h-3.5 w-3.5" />
          <span>
            <span className="font-medium">Global tracking mode:</span> showing only the {tracked.length}{' '}
            tracked {tracked.length === 1 ? 'vessel' : 'vessels'} worldwide. Remove all tracked vessels to
            return to the Sri Lanka area view.
          </span>
        </div>
      )}

      {error && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-sm px-4 py-2">
          {error}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex w-80 border-r border-slate-200 bg-white flex-col">
          {/* Search + track */}
          <div className="p-3 border-b border-slate-200 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or enter MMSI…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && queryIsMmsi && !alreadyTracked) handleTrack()
                }}
              />
            </div>
            {queryIsMmsi && (
              <Button
                onClick={handleTrack}
                disabled={adding || alreadyTracked}
                size="sm"
                className="w-full"
              >
                {adding ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Adding…
                  </>
                ) : alreadyTracked ? (
                  <>Already tracking MMSI {queryMmsi}</>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Track MMSI {queryMmsi}
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Tracked list */}
          {tracked.length > 0 && (
            <div className="border-b border-slate-200 bg-slate-50">
              <div className="px-3 pt-3 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tracked
              </div>
              <ul>
                {tracked.map((mmsi) => {
                  const v = vessels.get(mmsi)
                  const since = trackedAt.get(mmsi) ?? now
                  const timedOut = !v && now - since > NO_DATA_WARN_MS
                  return (
                    <li
                      key={mmsi}
                      className="px-3 py-2 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {v?.name ?? `MMSI ${mmsi}`}
                        </div>
                        {v ? (
                          <div className="text-xs text-slate-500">
                            {v.sog.toFixed(1)} kn · {Math.round(v.cog)}°
                          </div>
                        ) : timedOut ? (
                          <div className="text-xs text-amber-700 flex items-start gap-1 mt-0.5">
                            <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span>
                              No AIS data after 2 min. Vessel may be docked, in a coverage
                              gap, or the MMSI may be invalid.
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500">
                            Waiting for first AIS report…
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleUntrack(mmsi)}
                        disabled={busyMmsi === mmsi}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        aria-label={`Stop tracking ${mmsi}`}
                      >
                        {busyMmsi === mmsi ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Vessel list */}
          <div className="flex-1 overflow-y-auto">
            {vesselList.length === 0 ? (
              <div className="p-4 text-sm text-slate-500 text-center">
                {isConnected
                  ? trackingMode
                    ? 'Waiting for AIS reports for tracked vessels…'
                    : 'No vessels in range yet…'
                  : 'Loading vessels…'}
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {vesselList.map((v) => (
                  <li key={v.mmsi} className="px-3 py-2.5 hover:bg-slate-50">
                    <div className="font-medium text-sm text-slate-900 truncate">
                      {v.name ?? `MMSI ${v.mmsi}`}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex justify-between">
                      <span>{v.sog.toFixed(1)} kn · {Math.round(v.cog)}°</span>
                      <span className="text-slate-400">
                        {new Date(v.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <VesselTrackingMap vessels={vesselList} />
        </main>
      </div>
    </div>
  )
}
