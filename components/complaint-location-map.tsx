"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default markers in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface ComplaintLocationMapProps {
  coordinates: string
  address: string
}

export function ComplaintLocationMap({ coordinates, address }: ComplaintLocationMapProps) {
  const mapRef = useRef<L.Map | null>(null)

  // Parse coordinates string "lat, lng"
  const parseCoordinates = (coordStr: string): { lat: number; lng: number } | null => {
    try {
      const [latStr, lngStr] = coordStr.split(',').map(s => s.trim())
      const lat = parseFloat(latStr)
      const lng = parseFloat(lngStr)

      if (isNaN(lat) || isNaN(lng)) {
        return null
      }

      return { lat, lng }
    } catch (error) {
      console.error('Error parsing coordinates:', error)
      return null
    }
  }

  const location = parseCoordinates(coordinates)

  // If coordinates are invalid, don't render the map
  if (!location) {
    return (
      <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <span className="text-sm text-muted-foreground">Ubicación no disponible</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-48 w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        zoomControl={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        boxZoom={false}
        keyboard={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]} />
      </MapContainer>
    </div>
  )
}