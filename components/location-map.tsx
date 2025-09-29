"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Locate, X, Loader2 } from "lucide-react"

// Fix for default markers in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface LocationMapProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void
  onClose: () => void
  initialLocation?: { lat: number; lng: number }
}

// Santiago de Chile default coordinates
const SANTIAGO_COORDS = { lat: -33.4489, lng: -70.6693 }

function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null)

  useMapEvents({
    click: (e) => {
      setPosition(e.latlng)
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  return position === null ? null : (
    <Marker position={position} />
  )
}

export function LocationMap({ onLocationSelect, onClose, initialLocation }: LocationMapProps) {
  const [center, setCenter] = useState(initialLocation || SANTIAGO_COORDS)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  )
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [suggestedAddress, setSuggestedAddress] = useState<string | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    // Try to get user's current location on component mount
    getCurrentLocation()
  }, [])

  const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    setIsLoadingAddress(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'MuniDenuncia/1.0 (Municipal Complaint System)',
          },
        }
      )

      if (!response.ok) throw new Error('Geocoding failed')

      const data = await response.json()

      if (data && data.display_name) {
        return data.display_name
      }

      return null
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return null
    } finally {
      setIsLoadingAddress(false)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocalización no está disponible en este navegador")
      return
    }

    setIsLoadingLocation(true)
    setLocationError(null)
    setSuggestedAddress(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const newLocation = { lat: latitude, lng: longitude }
        setCenter(newLocation)
        setSelectedLocation(newLocation)
        setIsLoadingLocation(false)

        // Pan to the new location if map is available
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15)
        }

        // Get address for this location
        const address = await reverseGeocode(latitude, longitude)
        if (address) {
          setSuggestedAddress(address)
        }
      },
      (error) => {
        setIsLoadingLocation(false)
        let errorMessage = "No se pudo obtener la ubicación"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permisos de ubicación denegados"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Información de ubicación no disponible"
            break
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado para obtener ubicación"
            break
        }

        setLocationError(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    )
  }

  const handleLocationPick = async (lat: number, lng: number) => {
    const newLocation = { lat, lng }
    setSelectedLocation(newLocation)
    setSuggestedAddress(null)

    // Get address for the clicked location
    const address = await reverseGeocode(lat, lng)
    if (address) {
      setSuggestedAddress(address)
    }
  }

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.lat, selectedLocation.lng, suggestedAddress || undefined)
      onClose()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Seleccionar Ubicación
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Haz clic en el mapa para seleccionar la ubicación exacta del problema
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {locationError && (
          <Alert>
            <AlertDescription>{locationError}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
          >
            <Locate className="h-4 w-4 mr-2" />
            {isLoadingLocation ? "Obteniendo..." : "Mi Ubicación"}
          </Button>

          {selectedLocation && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </div>
              {isLoadingAddress && (
                <div className="text-sm text-muted-foreground flex items-center">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Obteniendo dirección...
                </div>
              )}
              {suggestedAddress && (
                <div className="text-sm text-foreground p-2 bg-muted rounded">
                  <p className="font-medium mb-1">Dirección encontrada:</p>
                  <p className="text-xs">{suggestedAddress}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-96 w-full rounded-lg overflow-hidden border">
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
            )}

            <LocationPicker onLocationSelect={handleLocationPick} />
          </MapContainer>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedLocation}>
            Confirmar Ubicación
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}