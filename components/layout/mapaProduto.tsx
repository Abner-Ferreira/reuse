'use client'

import { Coords, Pin } from '@/hooks/useGeocoding'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const userIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='10' fill='%232563eb' stroke='white' stroke-width='3'/%3E%3Ccircle cx='16' cy='16' r='4' fill='white'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
})

const productIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='36' viewBox='0 0 28 36'%3E%3Cpath d='M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z' fill='%23f97316'/%3E%3Ccircle cx='14' cy='14' r='6' fill='white'/%3E%3C/svg%3E",
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -36],
})

function RecenterMap({ coords }: { coords: Coords | null }) {
  const map = useMap()
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 11)
    }
  }, [coords, map])
  return null
}

interface ProductMapProps {
  pins: Pin[]
  userCoords: Coords | null
  currentUserLocation: string
}

export default function ProductMap({ pins, userCoords, currentUserLocation }: ProductMapProps) {
  const defaultCenter: [number, number] = userCoords
    ? [userCoords.lat, userCoords.lng]
    : [-23.55, -46.63]

  return (
    <MapContainer
      center={defaultCenter}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      className='z-0 rounded-b-xl'
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <RecenterMap coords={userCoords} />

      {/* Pin do usuário logado */}
      {userCoords && (
        <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
          <Popup>
            <div className='text-sm'>
              <p className='font-semibold text-blue-600'>📍 Você está aqui</p>
              <p className='text-gray-500 text-xs mt-1'>{currentUserLocation}</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Pins dos produtos */}
      {pins.map((pin, i) => {
        const distanceText =
          pin.distanceKm !== undefined
            ? pin.distanceKm < 1
              ? 'menos de 1 km de você'
              : `${pin.distanceKm.toFixed(1)} km de você`
            : null

        return (
          <Marker key={i} position={[pin.lat, pin.lng]} icon={productIcon}>
            <Popup minWidth={180}>
              <div className='text-sm'>
                <p className='font-semibold text-gray-800'>{pin.products[0].localization}</p>
                {distanceText && (
                  <p className='text-orange-500 text-xs mt-0.5'>📍 {distanceText}</p>
                )}
                <ul className='mt-2 space-y-1'>
                  {pin.products.map((p) => (
                    <li key={p.id} className='text-gray-600 text-xs flex items-center gap-1'>
                      <span className='w-1.5 h-1.5 rounded-full bg-orange-400 inline-block' />
                      {p.name}
                    </li>
                  ))}
                </ul>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}