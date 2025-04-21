"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DepartmentDialog } from "@/components/departments/department-dialog"
import { Pencil, Trash2, Building } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Department {
  id: number
  name: string
  description: string
  headOfDepartment: string
  location: string
  budget: string
  memberCount: number
  color: string
}

export function DepartmentsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load departments from localStorage or use sample data
    const savedDepartments = localStorage.getItem("departments")
    if (savedDepartments) {
      const parsedDepartments = JSON.parse(savedDepartments)
      setDepartments(parsedDepartments)
      setFilteredDepartments(parsedDepartments)
      updateTotalPages(parsedDepartments.length, rowsPerPage)
    } else {
      // Sample Departments Data
      const sampleDepartments = [
        {
          id: 1,
          name: "Engineering",
          description: "Software development and technical operations",
          headOfDepartment: "Michael Wilson",
          location: "Main Office - Floor 3",
          budget: "$1,200,000",
          memberCount: 24,
          color: "bg-blue-100 text-blue-800",
        },
        {
          id: 2,
          name: "Marketing",
          description: "Brand management and marketing campaigns",
          headOfDepartment: "Sarah Brown",
          location: "Main Office - Floor 2",
          budget: "$850,000",
          memberCount: 15,
          color: "bg-purple-100 text-purple-800",
        },
        {
          id: 3,
          name: "Sales",
          description: "Client acquisition and relationship management",
          headOfDepartment: "David Miller",
          location: "Downtown Office",
          budget: "$1,500,000",
          memberCount: 18,
          color: "bg-green-100 text-green-800",
        },
        {
          id: 4,
          name: "Human Resources",
          description: "Employee management and recruitment",
          headOfDepartment: "Jennifer Taylor",
          location: "Main Office - Floor 1",
          budget: "$450,000",
          memberCount: 8,
          color: "bg-red-100 text-red-800",
        },
        {
          id: 5,
          name: "Finance",
          description: "Financial planning and accounting",
          headOfDepartment: "Robert Johnson",
          location: "Main Office - Floor 4",
          budget: "$650,000",
          memberCount: 12,
          color: "bg-yellow-100 text-yellow-800",
        },
        {
          id: 6,
          name: "Customer Support",
          description: "Customer service and technical support",
          headOfDepartment: "Emily Davis",
          location: "Remote",
          budget: "$550,000",
          memberCount: 20,
          color: "bg-orange-100 text-orange-800",
        },
        {
          id: 7,
          name: "Research & Development",
          description: "Product innovation and research",
          headOfDepartment: "James Anderson",
          location: "Innovation Lab",
          budget: "$2,000,000",
          memberCount: 10,
          color: "bg-indigo-100 text-indigo-800",
        },
      ]
      setDepartments(sampleDepartments)
      setFilteredDepartments(sampleDepartments)
      updateTotalPages(sampleDepartments.length, rowsPerPage)

      // Save to localStorage
      localStorage.setItem("departments", JSON.stringify(sampleDepartments))
    }
  }, [router, rowsPerPage])

  useEffect(() => {
    if (searchTerm) {
      const filtered = departments.filter(
        (department) =>
          department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (department.description && department.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (department.headOfDepartment &&
            department.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (department.location && department.location.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredDepartments(filtered)
      setCurrentPage(1)
      updateTotalPages(filtered.length, rowsPerPage)
    } else {
      setFilteredDepartments(departments)
      updateTotalPages(departments.length, rowsPerPage)
    }
  }, [searchTerm, departments, rowsPerPage])

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
    updateTotalPages(filteredDepartments.length, newRowsPerPage)
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

  const handleAddDepartment = () => {
    setEditingDepartment(null)
    setDialogOpen(true)
  }

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department)
    setDialogOpen(true)
  }

  const handleDeleteDepartment = (id: number) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      const updatedDepartments = departments.filter((department) => department.id !== id)
      setDepartments(updatedDepartments)
      localStorage.setItem("departments", JSON.stringify(updatedDepartments))
    }
  }

  const handleSaveDepartment = (department: Omit<Department, "id" | "memberCount">) => {
    if (editingDepartment) {
      // Update existing department
      const updatedDepartments = departments.map((d) =>
        d.id === editingDepartment.id
          ? { ...department, id: editingDepartment.id, memberCount: editingDepartment.memberCount }
          : d,
      )
      setDepartments(updatedDepartments)
      localStorage.setItem("departments", JSON.stringify(updatedDepartments))
    } else {
      // Add new department
      const newId = departments.length > 0 ? Math.max(...departments.map((d) => d.id)) + 1 : 1
      const newDepartment = { ...department, id: newId, memberCount: 0 }
      const updatedDepartments = [...departments, newDepartment]
      setDepartments(updatedDepartments)
      localStorage.setItem("departments", JSON.stringify(updatedDepartments))
    }
    setDialogOpen(false)
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedDepartments = filteredDepartments.slice(startIndex, endIndex)

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Departments</h1>
          <Button onClick={handleAddDepartment}>Add Department</Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Department Management</h2>
          <p className="text-muted-foreground mb-6">Create, edit, and manage organizational departments.</p>

          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2">Departments</h3>
            <p className="text-muted-foreground mb-4">Manage your organization's departments and business units.</p>

            <div className="my-4">
              <Input placeholder="Search departments..." value={searchTerm} onChange={handleSearch} />
            </div>

            <div className="border rounded-md overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Head of Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedDepartments.length > 0 ? (
                    displayedDepartments.map((department) => (
                      <TableRow key={department.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="font-medium flex items-center">
                              <Badge className={department.color}>{department.name}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 max-w-[300px] truncate">
                              {department.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{department.headOfDepartment || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{department.location || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditDepartment(department)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDepartment(department.id)}
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
                      <TableCell colSpan={4} className="text-center py-8">
                        No departments found
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

      <DepartmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        department={editingDepartment}
        onSave={handleSaveDepartment}
      />
    </AppLayout>
  )
}
