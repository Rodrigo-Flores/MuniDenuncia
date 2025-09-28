"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Trash2, Download, RefreshCw, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { initializeSampleData } from "@/lib/sample-data"

export function DataManagement() {
  const [isClearing, setIsClearing] = useState(false)
  const { toast } = useToast()

  const getStorageStats = () => {
    const users = JSON.parse(localStorage.getItem("munidenuncia_users") || "[]")
    const complaints = JSON.parse(localStorage.getItem("munidenuncia_complaints") || "[]")
    const currentUser = localStorage.getItem("munidenuncia_user")

    return {
      users: users.length,
      complaints: complaints.length,
      hasSession: !!currentUser,
    }
  }

  const [stats, setStats] = useState(getStorageStats())

  const clearAllData = async () => {
    setIsClearing(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    localStorage.removeItem("munidenuncia_users")
    localStorage.removeItem("munidenuncia_complaints")
    localStorage.removeItem("munidenuncia_user")
    localStorage.removeItem("munidenuncia_token")

    setStats(getStorageStats())
    setIsClearing(false)

    toast({
      title: "Datos eliminados",
      description: "Todos los datos han sido eliminados del almacenamiento local",
    })
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
