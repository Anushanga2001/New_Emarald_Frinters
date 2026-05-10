import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { PORTS } from '@/lib/constants'
import type { Vessel } from '@/services/vessels.service'

// SVG ship icon — rotated by COG (course over ground).
function shipIcon(cog: number): L.DivIcon {
  const rotation = Number.isFinite(cog) ? cog : 0
  return L.divIcon({
    className: 'vessel-icon',
    html: `
      <div style="transform: rotate(${rotation}deg); transform-origin: center; width: 22px; height: 22px;">
        <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2 L18 20 L12 17 L6 20 Z"
                fill="#0ea5e9" stroke="#0c4a6e" stroke-width="1.2" stroke-linejoin="round"/>
        </svg>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

interface VesselTrackingMapProps {
  vessels: Vessel[]
  center?: [number, number]
  zoom?: number
}

export function VesselTrackingMap({
  vessels,
  center = [7.5, 80.7], // Sri Lanka center
  zoom = 7,
}: VesselTrackingMapProps) {
  // Memoize markers so we don't re-create div icons on every parent render.
  const markers = useMemo(
    () =>
      vessels.map((v) => (
        <Marker key={v.mmsi} position={[v.lat, v.lng]} icon={shipIcon(v.cog)}>
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{v.name ?? `MMSI ${v.mmsi}`}</div>
              <div className="text-xs text-slate-500">MMSI: {v.mmsi}</div>
              <div className="mt-1">
                Speed: <span className="font-medium">{v.sog.toFixed(1)} kn</span>
              </div>
              <div>
                Course: <span className="font-medium">{Math.round(v.cog)}°</span>
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Updated {new Date(v.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </Popup>
        </Marker>
      )),
    [vessels],
  )

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Sri Lankan ports as static reference points */}
      {PORTS.map((p) => (
        <CircleMarker
          key={p.code}
          center={[p.lat, p.lng]}
          radius={6}
          pathOptions={{ color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.7, weight: 2 }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs text-slate-500">{p.code}</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {markers}
    </MapContainer>
  )
}
