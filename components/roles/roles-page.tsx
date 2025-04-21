"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RoleDialog } from "@/components/roles/role-dialog"
import { Pencil, Trash2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Role {
  id: number
  name: string
  description: string
  department: string
  level: string
  assignedCount: number
}

export function RolesPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load roles from localStorage or use sample data
    const savedRoles = localStorage.getItem("roles")
    if (savedRoles) {
      const parsedRoles = JSON.parse(savedRoles)
      setRoles(parsedRoles)
      setFilteredRoles(parsedRoles)
      updateTotalPages(parsedRoles.length, rowsPerPage)
    } else {
      // Sample Roles Data
      const sampleRoles = [
        {
          id: 1,
          name: "Marketing Director",
          description: "Leads the marketing department and oversees all marketing initiatives",
          department: "Marketing",
          level: "Director",
          assignedCount: 1,
        },
        {
          id: 2,
          name: "Content Strategist",
          description: "Develops and implements content strategies across all platforms",
          department: "Marketing",
          level: "Senior",
          assignedCount: 2,
        },
        {
          id: 3,
          name: "Frontend Developer",
          description: "Builds and maintains user interfaces for web applications",
          department: "Engineering",
          level: "Mid-level",
          assignedCount: 3,
        },
        {
          id: 4,
          name: "Backend Developer",
          description: "Develops server-side logic and integrates with databases",
          department: "Engineering",
          level: "Senior",
          assignedCount: 2,
        },
        {
          id: 5,
          name: "UI/UX Designer",
          description: "Creates user-centered designs and improves user experience",
          department: "Design",
          level: "Mid-level",
          assignedCount: 1,
        },
        {
          id: 6,
          name: "Project Manager",
          description: "Oversees projects from inception to completion",
          department: "Operations",
          level: "Senior",
          assignedCount: 2,
        },
        {
          id: 7,
          name: "QA Engineer",
          description: "Ensures software quality through testing and validation",
          department: "Engineering",
          level: "Junior",
          assignedCount: 3,
        },
      ]
      setRoles(sampleRoles)
      setFilteredRoles(sampleRoles)
      updateTotalPages(sampleRoles.length, rowsPerPage)

      // Save to localStorage
      localStorage.setItem("roles", JSON.stringify(sampleRoles))
    }
  }, [router, rowsPerPage])

  useEffect(() => {
    if (searchTerm) {
      const filtered = roles.filter(
        (role) =>
          role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (role.department && role.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (role.level && role.level.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredRoles(filtered)
      setCurrentPage(1)
      updateTotalPages(filtered.length, rowsPerPage)
    } else {
      setFilteredRoles(roles)
      updateTotalPages(roles.length, rowsPerPage)
    }
  }, [searchTerm, roles, rowsPerPage])

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
    updateTotalPages(filteredRoles.length, newRowsPerPage)
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

  const handleAddRole = () => {
    setEditingRole(null)
    setDialogOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setDialogOpen(true)
  }

  const handleDeleteRole = (id: number) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      const updatedRoles = roles.filter((role) => role.id !== id)
      setRoles(updatedRoles)
      localStorage.setItem("roles", JSON.stringify(updatedRoles))
    }
  }

  const handleSaveRole = (role: Omit<Role, "id" | "assignedCount">) => {
    if (editingRole) {
      // Update existing role
      const updatedRoles = roles.map((r) =>
        r.id === editingRole.id ? { ...role, id: editingRole.id, assignedCount: editingRole.assignedCount } : r,
      )
      setRoles(updatedRoles)
      localStorage.setItem("roles", JSON.stringify(updatedRoles))
    } else {
      // Add new role
      const newId = roles.length > 0 ? Math.max(...roles.map((r) => r.id)) + 1 : 1
      const newRole = { ...role, id: newId, assignedCount: 0 }
      const updatedRoles = [...roles, newRole]
      setRoles(updatedRoles)
      localStorage.setItem("roles", JSON.stringify(updatedRoles))
    }
    setDialogOpen(false)
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedRoles = filteredRoles.slice(startIndex, endIndex)

  // Get badge color based on department
  const getDepartmentBadgeColor = (department: string) => {
    switch (department.toLowerCase()) {
      case "marketing":
        return "bg-purple-100 text-purple-800"
      case "engineering":
        return "bg-blue-100 text-blue-800"
      case "design":
        return "bg-pink-100 text-pink-800"
      case "operations":
        return "bg-yellow-100 text-yellow-800"
      case "finance":
        return "bg-green-100 text-green-800"
      case "hr":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get badge color based on level
  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "junior":
        return "bg-green-100 text-green-800"
      case "mid-level":
        return "bg-blue-100 text-blue-800"
      case "senior":
        return "bg-purple-100 text-purple-800"
      case "lead":
        return "bg-yellow-100 text-yellow-800"
      case "director":
        return "bg-red-100 text-red-800"
      case "executive":
        return "bg-gray-800 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Roles</h1>
          <Button onClick={handleAddRole}>Add Role</Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Role Management</h2>
          <p className="text-muted-foreground mb-6">Create, edit, and manage organizational roles.</p>

          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2">Roles</h3>
            <p className="text-muted-foreground mb-4">Manage roles that can be assigned to contacts.</p>

            <div className="my-4">
              <Input placeholder="Search roles..." value={searchTerm} onChange={handleSearch} />
            </div>

            <div className="border rounded-md overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedRoles.length > 0 ? (
                    displayedRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>
                          <Badge className={getDepartmentBadgeColor(role.department)}>{role.department}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getLevelBadgeColor(role.level)}>{role.level}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate" title={role.description}>
                          {role.description || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{role.assignedCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditRole(role)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRole(role.id)}
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
                      <TableCell colSpan={6} className="text-center py-8">
                        No roles found
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

      <RoleDialog open={dialogOpen} onOpenChange={setDialogOpen} role={editingRole} onSave={handleSaveRole} />
    </AppLayout>
  )
}
