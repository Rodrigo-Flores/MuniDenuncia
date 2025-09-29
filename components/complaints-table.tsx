"use client"
import Link from "next/link"
import type { Complaint } from "@/hooks/use-complaints"
import { ComplaintStatusBadge } from "./complaint-status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ComplaintsTableProps {
  complaints: Complaint[]
  onViewComplaint: (complaint: Complaint) => void
}

export function ComplaintsTable({ complaints, onViewComplaint }: ComplaintsTableProps) {
  if (complaints.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No hay denuncias</h3>
            <p className="text-muted-foreground mb-4">
              Aún no has creado ninguna denuncia. ¡Comienza reportando un problema!
            </p>
            <Button asChild>
              <Link href="/crear-denuncia">Crear Primera Denuncia</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Problema</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="w-24">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow
                  key={complaint.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onViewComplaint(complaint)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{complaint.type}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">{complaint.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-xs">{complaint.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ComplaintStatusBadge status={complaint.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(complaint.createdAt), "dd MMM yyyy", { locale: es })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewComplaint(complaint)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {complaints.map((complaint) => (
          <Card
            key={complaint.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onViewComplaint(complaint)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{complaint.type}</CardTitle>
                <ComplaintStatusBadge status={complaint.status} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{complaint.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{complaint.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(complaint.createdAt), "dd MMM yyyy", { locale: es })}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewComplaint(complaint)
                }}
                className="w-full"
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalles
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
