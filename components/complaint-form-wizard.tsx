"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useComplaints } from "@/hooks/use-complaints"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  Bold as Road,
  Trash2,
  Droplets,
  TreePine,
  Building,
  Car,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  MapPin,
  Loader2,
  Camera,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LocationMapWrapper } from "./location-map-wrapper"

const PROBLEM_TYPES = [
  {
    id: "iluminacion",
    name: "Iluminación",
    description: "Farolas dañadas, falta de luz",
    icon: Lightbulb,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    id: "pavimento",
    name: "Pavimento",
    description: "Baches, grietas, deterioro",
    icon: Road,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  {
    id: "basura",
    name: "Gestión de Basura",
    description: "Contenedores, limpieza",
    icon: Trash2,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    id: "agua",
    name: "Agua y Alcantarillado",
    description: "Fugas, drenaje, inundaciones",
    icon: Droplets,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "areas-verdes",
    name: "Áreas Verdes",
    description: "Parques, jardines, árboles",
    icon: TreePine,
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    id: "infraestructura",
    name: "Infraestructura",
    description: "Edificios, señalización",
    icon: Building,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: "transito",
    name: "Tránsito",
    description: "Semáforos, señales, estacionamiento",
    icon: Car,
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    id: "otros",
    name: "Otros",
    description: "Otros problemas municipales",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-800 border-red-200",
  },
]

interface ParsedAddress {
  region: string | null
  comuna: string | null
  calle: string | null
  numero: string | null
}

interface FormData {
  type: string
  typeName: string
  address: string
  parsedAddress: ParsedAddress | null
  coordinates: string
  description: string
  photos: File[]
}

export function ComplaintFormWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    type: "",
    typeName: "",
    address: "",
    parsedAddress: null,
    coordinates: "",
    description: "",
    photos: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showMap, setShowMap] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { createComplaint, isLoading } = useComplaints()
  const router = useRouter()
  const { toast } = useToast()

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.type) {
          newErrors.type = "Selecciona un tipo de problema"
        }
        break
      case 2:
        if (!formData.address.trim()) {
          newErrors.address = "Ingresa la dirección del problema"
        }
        break
      case 3:
        if (!formData.description.trim()) {
          newErrors.description = "Describe el problema"
        }
        if (formData.description.trim().length < 10) {
          newErrors.description = "La descripción debe tener al menos 10 caracteres"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleTypeSelect = (problemType: (typeof PROBLEM_TYPES)[0]) => {
    setFormData((prev) => ({
      ...prev,
      type: problemType.id,
      typeName: problemType.name,
    }))
    setErrors({})
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const validFiles: File[] = []
      const errors: string[] = []

      Array.from(files).forEach((file) => {
        // Validate file size (max 5MB per file)
        if (file.size > 5 * 1024 * 1024) {
          errors.push(`${file.name}: debe ser menor a 5MB`)
          return
        }
        // Validate file type
        if (!file.type.startsWith("image/")) {
          errors.push(`${file.name}: solo se permiten imágenes`)
          return
        }
        validFiles.push(file)
      })

      if (errors.length > 0) {
        setErrors({ photos: errors.join(", ") })
        return
      }

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...validFiles].slice(0, 5) // Max 5 photos
      }))
      setErrors({})
    }
  }

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ photos: "La imagen debe ser menor a 5MB" })
        return
      }

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, file].slice(0, 5) // Max 5 photos
      }))
      setErrors({})
    }
  }

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handleLocationSelect = (lat: number, lng: number, address?: string, parsedAddress?: ParsedAddress) => {
    const coordinates = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    setFormData((prev) => ({
      ...prev,
      coordinates,
      // Update address if we got one from reverse geocoding and current address is empty
      address: address && !prev.address.trim() ? address : prev.address,
      parsedAddress: parsedAddress || null
    }))
    setShowMap(false)
    toast({
      title: "Ubicación seleccionada",
      description: address ? "Ubicación y dirección actualizadas" : "La ubicación ha sido actualizada en el mapa",
    })
  }

  const openMap = () => {
    setShowMap(true)
  }

  const closeMap = () => {
    setShowMap(false)
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    const success = await createComplaint({
      type: formData.typeName,
      title: formData.typeName,
      description: formData.description,
      address: formData.address,
      coordinates: formData.coordinates || "-33.4489, -70.6693", // Default Santiago de Chile coordinates
    })

    if (success) {
      setIsRedirecting(true)
      toast({
        title: "¡Denuncia creada!",
        description: "Tu denuncia ha sido enviada correctamente",
      })
      // Small delay to show the success state before redirect
      setTimeout(() => {
        router.push("/mis-denuncias")
      }, 2000)
    } else {
      toast({
        title: "Error",
        description: "No se pudo crear la denuncia. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            Paso {currentStep} de {totalSteps}
          </span>
          <span>{Math.round(progress)}% completado</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step 1: Problem Type Selection */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Tipo de Problema</CardTitle>
            <p className="text-muted-foreground">Selecciona la categoría que mejor describe tu denuncia</p>
          </CardHeader>
          <CardContent>
            {errors.type && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{errors.type}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROBLEM_TYPES.map((problemType) => {
                const Icon = problemType.icon
                const isSelected = formData.type === problemType.id

                return (
                  <button
                    key={problemType.id}
                    onClick={() => handleTypeSelect(problemType)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-md ${problemType.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{problemType.name}</h3>
                        <p className="text-sm text-muted-foreground">{problemType.description}</p>
                      </div>
                      {isSelected && (
                        <Badge variant="default" className="ml-2">
                          Seleccionado
                        </Badge>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Location */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Ubicación del Problema</CardTitle>
            <p className="text-muted-foreground">Proporciona la dirección donde se encuentra el problema</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.address && (
              <Alert variant="destructive">
                <AlertDescription>{errors.address}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                placeholder="Ej: Av. Providencia 123, Providencia, Santiago"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                className={errors.address ? "border-destructive" : ""}
              />
              <p className="text-sm text-muted-foreground">
                Incluye calle, número, comuna y referencias. Usa el mapa para auto-completar la dirección.
              </p>
            </div>

            {/* Parsed Address Display */}
            {formData.parsedAddress && (
              <div className="p-3 bg-muted/50 rounded-lg border">
                <p className="text-sm font-medium mb-2">Dirección:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {formData.parsedAddress.region && (
                    <div className="flex">
                      <span className="font-medium w-16 shrink-0 text-muted-foreground">Región:</span>
                      <span>{formData.parsedAddress.region}</span>
                    </div>
                  )}
                  {formData.parsedAddress.comuna && (
                    <div className="flex">
                      <span className="font-medium w-16 shrink-0 text-muted-foreground">Comuna:</span>
                      <span>{formData.parsedAddress.comuna}</span>
                    </div>
                  )}
                  {formData.parsedAddress.calle && (
                    <div className="flex sm:col-span-2">
                      <span className="font-medium w-16 shrink-0 text-muted-foreground">Calle:</span>
                      <span>
                        {formData.parsedAddress.calle}
                        {formData.parsedAddress.numero && ` ${formData.parsedAddress.numero}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="coordinates">Coordenadas (opcional)</Label>
              <div className="flex gap-2">
                <Input
                  id="coordinates"
                  placeholder="-33.4489, -70.6693"
                  value={formData.coordinates}
                  onChange={(e) => setFormData((prev) => ({ ...prev, coordinates: e.target.value }))}
                  readOnly
                />
                <Button type="button" variant="outline" onClick={openMap}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Mapa
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Usa el mapa para seleccionar la ubicación exacta del problema
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Details and Photo */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Problema</CardTitle>
            <p className="text-muted-foreground">Describe el problema y agrega una foto si es posible</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {(errors.description || errors.photos) && (
              <Alert variant="destructive">
                <AlertDescription>{errors.description || errors.photos}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Descripción del problema *</Label>
              <Textarea
                id="description"
                placeholder="Describe detalladamente el problema que quieres reportar. Incluye información como cuándo ocurrió, qué tan grave es, y cualquier detalle relevante..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className={`min-h-32 ${errors.description ? "border-destructive" : ""}`}
              />
              <p className="text-sm text-muted-foreground">
                Mínimo 10 caracteres. Sé específico para ayudar a resolver el problema más rápido.
              </p>
            </div>

            <div className="space-y-4">
              <Label>Fotografías (opcional)</Label>

              {/* Upload area */}
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Selecciona imágenes desde tu dispositivo o toma fotos con la cámara
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* File upload */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="photo-upload"
                      multiple
                    />
                    <Button type="button" variant="outline" asChild>
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Seleccionar Imágenes
                      </label>
                    </Button>

                    {/* Camera capture */}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                      className="hidden"
                      id="camera-capture"
                    />
                    <Button type="button" variant="outline" asChild>
                      <label htmlFor="camera-capture" className="cursor-pointer">
                        <Camera className="h-4 w-4 mr-2" />
                        Tomar Foto
                      </label>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Máximo 5 fotos, 5MB cada una. Formatos: JPG, PNG, GIF
                  </p>
                </div>
              </div>

              {/* Photos preview */}
              {formData.photos.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    Fotos seleccionadas ({formData.photos.length}/5)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                              <Upload className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{photo.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(photo.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <LocationMapWrapper
              onLocationSelect={handleLocationSelect}
              onClose={closeMap}
              initialLocation={
                formData.coordinates
                  ? {
                    lat: parseFloat(formData.coordinates.split(",")[0]),
                    lng: parseFloat(formData.coordinates.split(",")[1]),
                  }
                  : undefined
              }
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={nextStep}>
            Siguiente
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Denuncia"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
