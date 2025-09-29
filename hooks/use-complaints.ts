"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"

export interface Complaint {
  id: string
  userId: string
  title: string
  type: string
  description: string
  address: string
  coordinates: string
  status: "Pendiente" | "En Revisión" | "Resuelto"
  createdAt: string
  updatedAt: string
  municipalResponse?: string
  statusHistory: Array<{
    status: string
    date: string
    comment?: string
  }>
}

export function useComplaints() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadComplaints()
    }
  }, [user])

  const loadComplaints = () => {
    if (!user) return

    const allComplaints = JSON.parse(localStorage.getItem("munidenuncia_complaints") || "[]")
    const userComplaints = allComplaints.filter((c: Complaint) => c.userId === user.id)
    setComplaints(userComplaints)
  }

  const createComplaint = async (
    complaintData: Omit<Complaint, "id" | "userId" | "createdAt" | "updatedAt" | "statusHistory" | "status">,
  ): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newComplaint: Complaint = {
      ...complaintData,
      id: Date.now().toString(),
      userId: user.id,
      status: "Pendiente",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: "Pendiente",
          date: new Date().toISOString(),
          comment: "Denuncia creada",
        },
      ],
    }

    const allComplaints = JSON.parse(localStorage.getItem("munidenuncia_complaints") || "[]")
    allComplaints.push(newComplaint)
    localStorage.setItem("munidenuncia_complaints", JSON.stringify(allComplaints))

    setComplaints((prev) => [...prev, newComplaint])
    setIsLoading(false)
    return true
  }

  const getComplaintById = (id: string): Complaint | undefined => {
    return complaints.find((c) => c.id === id)
  }

  return {
    complaints,
    isLoading,
    createComplaint,
    getComplaintById,
    loadComplaints,
  }
}
