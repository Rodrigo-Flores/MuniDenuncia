import { Badge } from "@/components/ui/badge"
import type { Complaint } from "@/hooks/use-complaints"

interface ComplaintStatusBadgeProps {
  status: Complaint["status"]
}

export function ComplaintStatusBadge({ status }: ComplaintStatusBadgeProps) {
  const variants = {
    Pendiente: "secondary",
    "En Revisión": "default",
    Resuelto: "default",
  } as const

  const colors = {
    Pendiente: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    "En Revisión": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    Resuelto: "bg-green-100 text-green-800 hover:bg-green-100",
  }

  return (
    <Badge variant={variants[status]} className={colors[status]}>
      {status}
    </Badge>
  )
}
