"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ComplaintFormWizard } from "@/components/complaint-form-wizard"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CrearDenunciaPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/ingresar")
    }
  }, [user, router])

  if (!user) {
    return null // Will redirect
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/mis-denuncias">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-balance">Nueva Denuncia</h1>
          <p className="text-muted-foreground mt-1">Reporta un problema municipal siguiendo estos sencillos pasos</p>
        </div>

        {/* Form Wizard */}
        <ComplaintFormWizard />
      </div>
    </DashboardLayout>
  )
}
