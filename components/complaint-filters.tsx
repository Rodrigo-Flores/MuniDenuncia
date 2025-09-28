"use client"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface ComplaintFiltersProps {
  onSearchChange: (search: string) => void
  onStatusChange: (status: string) => void
  searchValue: string
  statusValue: string
}

export function ComplaintFilters({ onSearchChange, onStatusChange, searchValue, statusValue }: ComplaintFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar denuncias..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={statusValue} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="Pendiente">Pendiente</SelectItem>
          <SelectItem value="En Revisión">En Revisión</SelectItem>
          <SelectItem value="Resuelto">Resuelto</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
