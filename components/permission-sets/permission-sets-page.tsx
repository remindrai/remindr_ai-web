"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PermissionSetDialog } from "@/components/permission-sets/permission-set-dialog"
import { Pencil, Trash2 } from "lucide-react"

export interface Permission {
  feature: string
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
  approve: boolean
  export: boolean
  import: boolean
  assign: boolean
  configure: boolean
}

export interface PermissionSet {
  id: string
  name: string
  description: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
  feature: string
}

export function PermissionSetsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [permissionSets, setPermissionSets] = useState<PermissionSet[]>([])
  const [filteredPermissionSets, setFilteredPermissionSets] = useState<PermissionSet[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPermissionSet, setEditingPermissionSet] = useState<PermissionSet | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load permission sets from localStorage or use sample data
    const savedPermissionSets = localStorage.getItem("permissionSets")
    if (savedPermissionSets) {
      const parsedPermissionSets = JSON.parse(savedPermissionSets)
      setPermissionSets(parsedPermissionSets)
      setFilteredPermissionSets(parsedPermissionSets)
      updateTotalPages(parsedPermissionSets.length, rowsPerPage)
    } else {
      // Sample Permission Sets Data
      const samplePermissionSets = [
        {
          id: "1",
          name: "View Users",
          description: "Allows viewing user information",
          feature: "Users",
          permissions: [
            {
              feature: "Users",
              view: true,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Edit Tasks",
          description: "Allows editing tasks",
          feature: "Tasks",
          permissions: [
            {
              feature: "Tasks",
              view: true,
              create: true,
              edit: true,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "View Contacts",
          description: "Allows viewing contact information",
          feature: "Contacts",
          permissions: [
            {
              feature: "Contacts",
              view: true,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Manage System Settings",
          description: "Allows configuring system settings",
          feature: "Settings",
          permissions: [
            {
              feature: "Settings",
              view: true,
              create: false,
              edit: true,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: true,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "5",
          name: "View Calendar",
          description: "Allows viewing calendar events",
          feature: "Calendar",
          permissions: [
            {
              feature: "Calendar",
              view: true,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      setPermissionSets(samplePermissionSets)
      setFilteredPermissionSets(samplePermissionSets)
      updateTotalPages(samplePermissionSets.length, rowsPerPage)

      // Save to localStorage
      localStorage.setItem("permissionSets", JSON.stringify(samplePermissionSets))
    }
  }, [router, rowsPerPage])

  useEffect(() => {
    if (searchTerm) {
      const filtered = permissionSets.filter(
        (permissionSet) =>
          permissionSet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permissionSet.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPermissionSets(filtered)
      setCurrentPage(1)
      updateTotalPages(filtered.length, rowsPerPage)
    } else {
      setFilteredPermissionSets(permissionSets)
      updateTotalPages(permissionSets.length, rowsPerPage)
    }
  }, [searchTerm, permissionSets, rowsPerPage])

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
    updateTotalPages(filteredPermissionSets.length, newRowsPerPage)
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

  const handleAddPermissionSet = () => {
    setEditingPermissionSet(null)
    setDialogOpen(true)
  }

  const handleEditPermissionSet = (permissionSet: PermissionSet) => {
    setEditingPermissionSet(permissionSet)
    setDialogOpen(true)
  }

  const handleDeletePermissionSet = (id: string) => {
    if (window.confirm("Are you sure you want to delete this permission set?")) {
      const updatedPermissionSets = permissionSets.filter((permissionSet) => permissionSet.id !== id)
      setPermissionSets(updatedPermissionSets)
      localStorage.setItem("permissionSets", JSON.stringify(updatedPermissionSets))
    }
  }

  const handleSavePermissionSet = (permissionSet: Omit<PermissionSet, "id" | "createdAt" | "updatedAt">) => {
    if (editingPermissionSet) {
      // Update existing permissionSet
      const updatedPermissionSets = permissionSets.map((ps) =>
        ps.id === editingPermissionSet.id
          ? { ...permissionSet, id: editingPermissionSet.id, feature: editingPermissionSet.feature }
          : ps,
      )
      setPermissionSets(updatedPermissionSets)
      localStorage.setItem("permissionSets", JSON.stringify(updatedPermissionSets))
    } else {
      // Add new permissionSet
      const newId = Date.now().toString()
      const newPermissionSet = {
        ...permissionSet,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        feature: "Users",
      }
      const updatedPermissionSets = [...permissionSets, newPermissionSet]
      setPermissionSets(updatedPermissionSets)
      localStorage.setItem("permissionSets", JSON.stringify(updatedPermissionSets))
    }
    setDialogOpen(false)
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedPermissionSets = filteredPermissionSets.slice(startIndex, endIndex)

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Permission Sets</h1>
          <Button onClick={handleAddPermissionSet}>Add Permission Set</Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Permission Set Management</h2>
          <p className="text-muted-foreground mb-6">Create, edit, and manage permission sets.</p>

          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2">Permission Sets</h3>
            <p className="text-muted-foreground mb-4">Manage permission sets that can be assigned to profiles.</p>

            <div className="my-4">
              <Input placeholder="Search permission sets..." value={searchTerm} onChange={handleSearch} />
            </div>

            <div className="border rounded-md overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Feature</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedPermissionSets.length > 0 ? (
                    displayedPermissionSets.map((permissionSet) => (
                      <TableRow key={permissionSet.id}>
                        <TableCell className="font-medium">{permissionSet.name}</TableCell>
                        <TableCell>{permissionSet.description || "-"}</TableCell>
                        <TableCell>{permissionSet.feature || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPermissionSet(permissionSet)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePermissionSet(permissionSet.id)}
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
                        No permission sets found
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

      <PermissionSetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        permissionSet={editingPermissionSet}
        onSave={handleSavePermissionSet}
      />
    </AppLayout>
  )
}
