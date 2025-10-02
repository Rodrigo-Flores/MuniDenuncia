"use client"

import { Suspense, lazy } from 'react'
import { Loader2 } from 'lucide-react'

// Dynamically import LocationMap to avoid SSR issues with Leaflet
const LocationMapComponent = lazy(() =>
  import('./location-map').then(module => ({ default: module.LocationMap }))
)

interface ParsedAddress {
  region: string | null
  comuna: string | null
  calle: string | null
  numero: string | null
}

interface LocationMapWrapperProps {
  onLocationSelect: (lat: number, lng: number, address?: string, parsedAddress?: ParsedAddress) => void
  onClose: () => void
  initialLocation?: { lat: number; lng: number }
}

export function LocationMapWrapper(props: LocationMapWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-96 w-full">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando mapa...</span>
          </div>
        </div>
      }
    >
      <LocationMapComponent {...props} />
    </Suspense>
  )
}