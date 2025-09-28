import type { Complaint } from "@/hooks/use-complaints"

export const SAMPLE_USERS = [
  {
    id: "1",
    email: "demo@munidenuncia.com",
    password: "demo123",
    name: "Usuario Demo",
  },
  {
    id: "2",
    email: "maria.gonzalez@email.com",
    password: "password123",
    name: "María González",
  },
]

export const SAMPLE_COMPLAINTS: Complaint[] = [
  {
    id: "1",
    userId: "1",
    title: "Farola dañada",
    type: "Iluminación",
    description:
      "La farola ubicada en la esquina de Av. Reforma con Calle 5 de Mayo no funciona desde hace una semana. Esto genera inseguridad durante las noches ya que es una zona de mucho tránsito peatonal.",
    address: "Av. Reforma esquina con Calle 5 de Mayo, Col. Centro",
    coordinates: "19.4326, -99.1332",
    status: "En Revisión",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    statusHistory: [
      {
        status: "Pendiente",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        comment: "Denuncia creada",
      },
      {
        status: "En Revisión",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        comment: "Asignada al departamento de alumbrado público",
      },
    ],
  },
  {
    id: "2",
    userId: "1",
    title: "Bache en la calle",
    type: "Pavimento",
    description:
      "Hay un bache muy grande en la Calle Morelos que está causando daños a los vehículos. El bache tiene aproximadamente 1 metro de diámetro y 20 cm de profundidad.",
    address: "Calle Morelos 234, Col. San José",
    coordinates: "19.4285, -99.1277",
    status: "Resuelto",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    statusHistory: [
      {
        status: "Pendiente",
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        comment: "Denuncia creada",
      },
      {
        status: "En Revisión",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        comment: "Inspección programada",
      },
      {
        status: "Resuelto",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        comment: "Bache reparado por cuadrilla de mantenimiento",
      },
    ],
  },
  {
    id: "3",
    userId: "1",
    title: "Contenedor de basura desbordado",
    type: "Gestión de Basura",
    description:
      "El contenedor de basura ubicado en el Parque Central está constantemente desbordado. La basura se acumula alrededor del contenedor creando malos olores y atrayendo plagas.",
    address: "Parque Central, entrada principal",
    coordinates: "19.4350, -99.1290",
    status: "Pendiente",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    statusHistory: [
      {
        status: "Pendiente",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        comment: "Denuncia creada",
      },
    ],
  },
  {
    id: "4",
    userId: "1",
    title: "Fuga de agua en la calle",
    type: "Agua y Alcantarillado",
    description:
      "Hay una fuga de agua considerable en la tubería principal de la Av. Juárez. El agua está corriendo por la calle desde hace varios días y está causando erosión en el pavimento.",
    address: "Av. Juárez 456, frente al banco",
    coordinates: "19.4310, -99.1355",
    status: "En Revisión",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    statusHistory: [
      {
        status: "Pendiente",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        comment: "Denuncia creada",
      },
      {
        status: "En Revisión",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        comment: "Equipo técnico enviado para evaluación",
      },
    ],
  },
]

export function initializeSampleData() {
  // Initialize sample users if none exist
  const existingUsers = localStorage.getItem("munidenuncia_users")
  if (!existingUsers) {
    localStorage.setItem("munidenuncia_users", JSON.stringify(SAMPLE_USERS))
  }

  // Initialize sample complaints if none exist
  const existingComplaints = localStorage.getItem("munidenuncia_complaints")
  if (!existingComplaints) {
    localStorage.setItem("munidenuncia_complaints", JSON.stringify(SAMPLE_COMPLAINTS))
  }
}
