"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useComplaints, type Complaint } from "@/hooks/use-complaints"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ComplaintFilters } from "@/components/complaint-filters"
import { ComplaintsTable } from "@/components/complaints-table"
import { ComplaintDetailModal } from "@/components/complaint-detail-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Clock, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function MisDenunciasPage() {
  const { user } = useAuth()
  const { complaints, isLoading } = useComplaints()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/ingresar")
    }
  }, [user, router])

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch =
        complaint.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.address.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || complaint.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [complaints, searchTerm, statusFilter])

  const stats = useMemo(() => {
    const total = complaints.length
    const pending = complaints.filter((c) => c.status === "Pendiente").length
    const inReview = complaints.filter((c) => c.status === "En Revisión").length
    const resolved = complaints.filter((c) => c.status === "Resuelto").length

    return { total, pending, inReview, resolved }
  }, [complaints])

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setModalOpen(true)
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">Mis Denuncias</h1>
            <p className="text-muted-foreground mt-1">Gestiona y da seguimiento a tus reportes municipales</p>
          </div>
          <div className="flex flex-col gap-2 mt-4 sm:mt-0">
            <Button asChild>
              <Link href="/crear-denuncia">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Denuncia
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const section = document.getElementById("detalle-denuncias")
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Ver Estado
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">denuncias creadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">esperando revisión</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inReview}</div>
              <p className="text-xs text-muted-foreground">siendo procesadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resueltas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">completadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <ComplaintFilters
          searchValue={searchTerm}
          statusValue={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

        {/* Complaints Table */}
        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Cargando denuncias...</p>
            </CardContent>
          </Card>
        ) : (
          <div id="detalle-denuncias">
            <ComplaintsTable complaints={filteredComplaints} onViewComplaint={handleViewComplaint} />
          </div>
        )}

        {/* Detail Modal */}
        <ComplaintDetailModal complaint={selectedComplaint} open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    </DashboardLayout>
  )
}
