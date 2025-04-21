"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PriorityDialog } from "@/components/priorities/priority-dialog"
import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Priority {
  id: number
  name: string
  description: string
  color: string
}

export function PrioritiesPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [priorities, setPriorities] = useState<Priority[]>([])
  const [filteredPriorities, setFilteredPriorities] = useState<Priority[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPriority, setEditingPriority] = useState<Priority | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load priorities from localStorage or use sample data
    const savedPriorities = localStorage.getItem("priorities")
    if (savedPriorities) {
      const parsedPriorities = JSON.parse(savedPriorities)
      setPriorities(parsedPriorities)
      setFilteredPriorities(parsedPriorities)
      updateTotalPages(parsedPriorities.length, rowsPerPage)
    } else {
      // Sample Priorities Data
      const samplePriorities = [
        {
          id: 1,
          name: "High",
          description: "Urgent tasks that need immediate attention",
          color: "bg-red-100 text-red-800",
        },
        {
          id: 2,
          name: "Medium",
          description: "Important tasks with flexible deadlines",
          color: "bg-yellow-100 text-yellow-800",
        },
        {
          id: 3,
          name: "Low",
          description: "Tasks that can be completed when time permits",
          color: "bg-blue-100 text-blue-800",
        },
      ]
      setPriorities(samplePriorities)
      setFilteredPriorities(samplePriorities)
      updateTotalPages(samplePriorities.length, rowsPerPage)

      // Save to localStorage
      localStorage.setItem("priorities", JSON.stringify(samplePriorities))
    }
  }, [router, rowsPerPage])

  useEffect(() => {
    if (searchTerm) {
      const filtered = priorities.filter(
        (priority) =>
          priority.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (priority.description && priority.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredPriorities(filtered)
      setCurrentPage(1)
      updateTotalPages(filtered.length, rowsPerPage)
    } else {
      setFilteredPriorities(priorities)
      updateTotalPages(priorities.length, rowsPerPage)
    }
  }, [searchTerm, priorities, rowsPerPage])

  const updateTotalPages = (itemCount: number, rowsPerPage: number) => {
    setTotalPages(Math.ceil(itemCount / rowsPerPage) || 1)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = Number.parseInt(e.target.value)
    setRowsPerPage(newRowsPerPage)
    setCurrentPage(1)
    updateTotalPages(filteredPriorities.length, newRowsPerPage)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleAddPriority = () => {
    setEditingPriority(null)
    setDialogOpen(true)
  }

  const handleEditPriority = (priority: Priority) => {
    setEditingPriority(priority)
    setDialogOpen(true)
  }

  const handleDeletePriority = (id: number) => {
    if (window.confirm("Are you sure you want to delete this priority?")) {
      const updatedPriorities = priorities.filter((priority) => priority.id !== id)
      setPriorities(updatedPriorities)
      localStorage.setItem("priorities", JSON.stringify(updatedPriorities))
    }
  }

  const handleSavePriority = (priority: Omit<Priority, "id">) => {
    if (editingPriority) {
      // Update existing priority
      const updatedPriorities = priorities.map((p) =>
        p.id === editingPriority.id ? { ...priority, id: editingPriority.id } : p,
      )
      setPriorities(updatedPriorities)
      localStorage.setItem("priorities", JSON.stringify(updatedPriorities))
    } else {
      // Add new priority
      const newId = priorities.length > 0 ? Math.max(...priorities.map((p) => p.id)) + 1 : 1
      const newPriority = { ...priority, id: newId }
      const updatedPriorities = [...priorities, newPriority]
      setPriorities(updatedPriorities)
      localStorage.setItem("priorities", JSON.stringify(updatedPriorities))
    }
    setDialogOpen(false)
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedPriorities = filteredPriorities.slice(startIndex, endIndex)

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Priorities</h1>
          <Button onClick={handleAddPriority}>Add Priority</Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Priority Management</h2>
          <p className="text-muted-foreground mb-6">Create, edit, and delete task priorities.</p>

          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2">Priorities</h3>
            <p className="text-muted-foreground mb-4">Manage task priorities.</p>

            <div className="my-4">
              <Input placeholder="Search priorities..." value={searchTerm} onChange={handleSearch} />
            </div>

            <div className="border rounded-md overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedPriorities.length > 0 ? (
                    displayedPriorities.map((priority) => (
                      <TableRow key={priority.id}>
                        <TableCell>
                          <Badge className={priority.color}>{priority.name}</Badge>
                        </TableCell>
                        <TableCell>{priority.description || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPriority(priority)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePriority(priority.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        No priorities found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <select
                  className="border rounded p-1 text-sm bg-background"
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handlePrevPage} disabled={currentPage <= 1}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage >= totalPages}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PriorityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        priority={editingPriority}
        onSave={handleSavePriority}
      />
    </AppLayout>
  )
}
