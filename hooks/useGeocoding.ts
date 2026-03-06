'use client'

import { useEffect, useRef, useState } from 'react'

export interface Coords {
  lat: number
  lng: number
}

const geocodeCache = new Map<string, Coords | null>()

async function geocode(location: string): Promise<Coords | null> {
  if (geocodeCache.has(location)) {
    return geocodeCache.get(location)!
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      {
        headers: {
          'Accept-Language': 'pt-BR',
          'User-Agent': 'MyApp/1.0',
        },
      }
    )
    const data = await res.json()
    const result = data.length
      ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      : null

    geocodeCache.set(location, result)
    return result
  } catch {
    return null
  }
}

export function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export interface Product {
  id: string
  name: string
  city: string | null
  state: string | null
  country: string | null
  category?: string
  stateOfConservation?: string
  imageUrl?: string
  localization?: string 
}
export interface Pin extends Coords {
  products: Product[]
  distanceKm?: number
}

interface UseGeocodingProps {
  products: Product[]
  currentUserLocation: string
  radiusKm?: number
}

export function useGeocoding({
  products,
  currentUserLocation,
  radiusKm = 50,
}: UseGeocodingProps) {
  const [pins, setPins] = useState<Pin[]>([])
  const [userCoords, setUserCoords] = useState<Coords | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const prevDataRef = useRef<string>('')

  useEffect(() => {
    const key = `${currentUserLocation}|${products.map(p => p.id).join(',')}|${radiusKm}`
    if (prevDataRef.current === key) return
    prevDataRef.current = key

    async function build() {
      setIsLoading(true)
      setError(null)

      try {
        const userPos = await geocode(currentUserLocation)
        setUserCoords(userPos)

      
        const grouped = products.reduce(
          (acc, product) => {
            const localization = [product.city, product.state, product.country]
              .filter(Boolean)
              .join(', ')

            if (!localization) return acc 

            acc[localization] = acc[localization] ?? []
            acc[localization].push({ ...product, localization })
            return acc
          },
          {} as Record<string, (Product & { localization: string })[]>
        )

        const entries = Object.entries(grouped)
        const results: Pin[] = []

        for (let i = 0; i < entries.length; i++) {
          const [location, prods] = entries[i]
          if (i > 0) await new Promise(r => setTimeout(r, 1100))

          const coords = await geocode(location)
          if (!coords) continue

          const distanceKm = userPos
            ? getDistanceKm(userPos.lat, userPos.lng, coords.lat, coords.lng)
            : undefined

          if (userPos && distanceKm !== undefined && distanceKm > radiusKm)
            continue

          results.push({ ...coords, products: prods, distanceKm })
        }

        results.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
        setPins(results)
      } catch {
        setError('Erro ao carregar localizações. Tente novamente.')
      } finally {
        setIsLoading(false)
      }
    }

    build()
  }, [products, currentUserLocation, radiusKm])

  return { pins, userCoords, isLoading, error }
}
