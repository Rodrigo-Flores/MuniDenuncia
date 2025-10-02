"use client"

import type { Complaint } from "@/hooks/use-complaints"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ComplaintStatusBadge } from "./complaint-status-badge"
import { Calendar, MapPin, FileText, MessageSquare, Building2, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import dynamic from "next/dynamic"
import { Suspense } from "react"

// Dynamically import the map component to avoid SSR issues
const ComplaintLocationMap = dynamic(() => import('./complaint-location-map').then(mod => ({ default: mod.ComplaintLocationMap })), {
  ssr: false,
  loading: () => (
    <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Cargando mapa...</p>
      </div>
    </div>
  )
})

interface ComplaintDetailModalProps {
  complaint: Complaint | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Simulate municipal responses based on status
const getMunicipalResponse = (complaint: Complaint): string => {
  switch (complaint.status) {
    case "Pendiente":
      return "Su denuncia ha sido recibida y se encuentra en cola para revisión. Nuestro equipo técnico la evaluará en los próximos días hábiles."
    case "En Revisión":
      return "Hemos asignado su denuncia al departamento correspondiente. Un técnico municipal realizará una inspección en el sitio reportado para evaluar la situación y determinar las acciones necesarias."
    case "Resuelto":
      return "El problema reportado ha sido atendido y resuelto por nuestro equipo de mantenimiento municipal. Agradecemos su participación ciudadana para mejorar nuestra ciudad."
    default:
      return "Su denuncia está siendo procesada por nuestro sistema."
  }
}

const getStatusColor = (status: Complaint["status"]) => {
  switch (status) {
    case "Pendiente":
      return "text-gray-600"
    case "En Revisión":
      return "text-yellow-600"
    case "Resuelto":
      return "text-green-600"
    default:
      return "text-gray-600"
  }
}

const getStatusIcon = (status: Complaint["status"]) => {
  switch (status) {
    case "Pendiente":
      return Clock
    case "En Revisión":
      return FileText
    case "Resuelto":
      return Building2
    default:
      return Clock
  }
}

export function ComplaintDetailModal({ complaint, open, onOpenChange }: ComplaintDetailModalProps) {
  if (!complaint) return null

  const municipalResponse = getMunicipalResponse(complaint)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Denuncia #{complaint.id}</span>
            <ComplaintStatusBadge status={complaint.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Tipo de Problema</h4>
                  <p className="font-medium">{complaint.type}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Fecha de Creación</h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(complaint.createdAt), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Ubicación</h4>
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{complaint.address}</p>
                    {complaint.coordinates && (
                      <p className="text-sm text-muted-foreground">Coordenadas: {complaint.coordinates}</p>
                    )}
                  </div>
                </div>

                {/* Mini Map */}
                {complaint.coordinates && (
                  <div className="mt-3">
                    <Suspense fallback={
                      <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Cargando mapa...</p>
                        </div>
                      </div>
                    }>
                      <ComplaintLocationMap
                        coordinates={complaint.coordinates}
                        address={complaint.address}
                      />
                    </Suspense>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Descripción</h4>
                <p className="text-sm leading-relaxed bg-muted/30 p-4 rounded-md">{complaint.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Municipal Response */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Respuesta de la Municipalidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Municipalidad de la Ciudad</h4>
                    <p className="text-sm leading-relaxed">{municipalResponse}</p>
                    <p className="text-xs text-muted-foreground mt-3">
                      Última actualización: {format(new Date(complaint.updatedAt), "dd/MM/yyyy HH:mm", { locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historial de Estados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaint.statusHistory.map((entry, index) => {
                  const StatusIcon = getStatusIcon(entry.status as Complaint["status"])
                  const isLast = index === complaint.statusHistory.length - 1

                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`p-2 rounded-full bg-background border-2 ${getStatusColor(entry.status as Complaint["status"])}`}
                        >
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        {!isLast && <div className="w-px h-8 bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={getStatusColor(entry.status as Complaint["status"])}>
                            {entry.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(entry.date), "dd/MM/yyyy HH:mm", { locale: es })}
                          </span>
                        </div>
                        {entry.comment && <p className="text-sm text-muted-foreground">{entry.comment}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-muted-foreground mb-1">ID de Denuncia</h4>
                  <p className="font-mono">{complaint.id}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-muted-foreground mb-1">Estado Actual</h4>
                  <p>{complaint.status}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-muted-foreground mb-1">Última Actualización</h4>
                  <p>{format(new Date(complaint.updatedAt), "dd/MM/yyyy", { locale: es })}</p>
                </div>
              </div>

              <Separator />

              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <strong>Nota:</strong> Los tiempos de respuesta pueden variar según la complejidad del problema y la
                  disponibilidad de recursos municipales.
                </p>
                <p>
                  Para consultas adicionales, puede contactar al departamento correspondiente con el ID de su denuncia.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
