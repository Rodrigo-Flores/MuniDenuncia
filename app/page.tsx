"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, FileText, Users, Shield } from "lucide-react"
import { DataManagement } from "@/components/data-management"
import { initializeSampleData } from "@/lib/sample-data"
import Link from "next/link"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData()

    if (user) {
      router.push("/mis-denuncias")
    }
  }, [user, router])

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">MuniDenuncia</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">Sistema Municipal de Denuncias</p>
                </div>
              </Link>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="sm:size-default" asChild>
                <Link href="/ingresar">Ingresar</Link>
              </Button>
              <Button size="sm" className="sm:size-default" asChild>
                <Link href="/registrarse">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4 sm:mb-6">
            Servicio Ciudadano Oficial
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance mb-4 sm:mb-6">
            Reporta problemas municipales de forma <span className="text-primary">rápida y segura</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground text-balance mb-6 sm:mb-8 leading-relaxed">
            Ayuda a mejorar tu ciudad reportando problemas de infraestructura, servicios públicos y más. Tu voz importa
            para construir una comunidad mejor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/registrarse">Comenzar Ahora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/ingresar">Ya tengo cuenta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 sm:py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">¿Cómo funciona?</h3>
            <p className="text-base sm:text-lg text-muted-foreground">
              Proceso simple y transparente para reportar problemas municipales
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>1. Reporta</CardTitle>
                <CardDescription>Describe el problema, agrega fotos y ubicación de forma sencilla</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>2. Seguimiento</CardTitle>
                <CardDescription>Recibe actualizaciones del estado de tu denuncia en tiempo real</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>3. Resolución</CardTitle>
                <CardDescription>La municipalidad trabaja para resolver el problema reportado</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-8 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Prueba la Aplicación</h3>
            <p className="text-base sm:text-lg text-muted-foreground">Explora todas las funcionalidades con datos de ejemplo</p>
          </div>

          <DataManagement />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-bold mb-4">¿Listo para hacer la diferencia?</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Únete a miles de ciudadanos que ya están ayudando a mejorar nuestra ciudad
          </p>
          <Button size="lg" asChild>
            <Link href="/registrarse">Crear Cuenta Gratuita</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold">MuniDenuncia</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Sistema oficial de denuncias municipales. Servicio gratuito para todos los ciudadanos.
          </p>
        </div>
      </footer>
    </div>
  )
}
