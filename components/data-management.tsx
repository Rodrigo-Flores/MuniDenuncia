"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Trash2, Download, RefreshCw, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { initializeSampleData } from "@/lib/sample-data"

export function DataManagement() {
  const [isClearing, setIsClearing] = useState(false)
  const [stats, setStats] = useState({
    users: 0,
    complaints: 0,
    hasSession: false,
  })
  const { toast } = useToast()

  const getStorageStats = () => {
    if (typeof window === "undefined") {
      return {
        users: 0,
        complaints: 0,
        hasSession: false,
      }
    }

    try {
      const users = JSON.parse(localStorage.getItem("munidenuncia_users") || "[]")
      const complaints = JSON.parse(localStorage.getItem("munidenuncia_complaints") || "[]")
      const currentUser = localStorage.getItem("munidenuncia_user")

      return {
        users: users.length,
        complaints: complaints.length,
        hasSession: !!currentUser,
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      return {
        users: 0,
        complaints: 0,
        hasSession: false,
      }
    }
  }

  useEffect(() => {
    setStats(getStorageStats())
  }, [])

  const clearAllData = async () => {
    if (typeof window === "undefined") return

    setIsClearing(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      localStorage.removeItem("munidenuncia_users")
      localStorage.removeItem("munidenuncia_complaints")
      localStorage.removeItem("munidenuncia_user")
      localStorage.removeItem("munidenuncia_token")

      setStats(getStorageStats())

      toast({
        title: "Datos eliminados",
        description: "Todos los datos han sido eliminados del almacenamiento local",
      })
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar los datos",
        variant: "destructive",
      })
    }

    setIsClearing(false)
  }

  const loadSampleData = () => {
    initializeSampleData()
    setStats(getStorageStats())

    toast({
      title: "Datos de ejemplo cargados",
      description: "Se han cargado usuarios y denuncias de ejemplo",
    })
  }

  const exportData = () => {
    if (typeof window === "undefined") return

    try {
      const data = {
        users: JSON.parse(localStorage.getItem("munidenuncia_users") || "[]"),
        complaints: JSON.parse(localStorage.getItem("munidenuncia_complaints") || "[]"),
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `munidenuncia-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Datos exportados",
        description: "Los datos han sido descargados como archivo JSON",
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al exportar los datos",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Gestión de Datos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold">{stats.users}</div>
            <div className="text-sm text-muted-foreground">Usuarios</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold">{stats.complaints}</div>
            <div className="text-sm text-muted-foreground">Denuncias</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Badge variant={stats.hasSession ? "default" : "secondary"}>
              {stats.hasSession ? "Sesión Activa" : "Sin Sesión"}
            </Badge>
          </div>
        </div>

        {/* Demo Account Info */}
        <Alert>
          <AlertDescription>
            <strong>Cuenta de demostración:</strong> Puedes usar el email "demo@munidenuncia.com" con contraseña
            "demo123" para probar la aplicación.
          </AlertDescription>
        </Alert>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={loadSampleData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Cargar Datos de Ejemplo
          </Button>

          <Button onClick={exportData} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Datos
          </Button>

          <Button onClick={clearAllData} variant="destructive" disabled={isClearing}>
            {isClearing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Limpiar Todo
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
