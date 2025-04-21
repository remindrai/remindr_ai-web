"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PermissionSetGroupDialog } from "./permission-set-group-dialog"
import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PermissionSetGroup {
  id: number
  name: string
  description: string
  permissionSets: {
    id: number
    name: string
    feature: string
  }[]
  createdAt: string
  updatedAt: string
}

export function PermissionSetGroupsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [permissionSetGroups, setPermissionSetGroups] = useState<PermissionSetGroup[]>([])
  const [filteredGroups, setFilteredGroups] = useState<PermissionSetGroup[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<PermissionSetGroup | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load permission set groups from localStorage or use sample data
    const storedGroups = localStorage.getItem("permissionSetGroups")
    if (storedGroups) {
      const parsedGroups = JSON.parse(storedGroups)
      setPermissionSetGroups(parsedGroups)
      setFilteredGroups(parsedGroups)
      updateTotalPages(parsedGroups.length, rowsPerPage)
    } else {
      // Sample Permission Set Groups Data
      const sampleGroups: PermissionSetGroup[] = [
        {
          id: 1,
          name: "Basic User",
          description: "Basic view permissions for most features",
          permissionSets: [
            { id: 1, name: "Tasks View", feature: "Tasks" },
            { id: 2, name: "Calendar View", feature: "Calendar" },
            { id: 3, name: "Contacts View", feature: "Contacts" },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Team Manager",
          description: "Full access to team management features",
          permissionSets: [
            { id: 4, name: "Teams Full Access", feature: "Teams" },
            { id: 5, name: "Groups Full Access", feature: "Groups" },
            { id: 6, name: "Users View", feature: "Users" },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: "Content Creator",
          description: "Create and edit content across the system",
          permissionSets: [
            { id: 7, name: "Tasks Create/Edit", feature: "Tasks" },
            { id: 8, name: "Categories View", feature: "Categories" },
            { id: 9, name: "Priorities View", feature: "Priorities" },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 4,
          name: "System Administrator",
          description: "Full access to all system features",
          permissionSets: [
            { id: 10, name: "Users Full Access", feature: "Users" },
            { id: 11, name: "Profiles Full Access", feature: "Profiles" },
            { id: 12, name: "Permission Sets Full Access", feature: "Permission Sets" },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 5,
          name: "HR Manager",
          description: "Access to HR-related features",
          permissionSets: [
            { id: 13, name: "Departments Full Access", feature: "Departments" },
            { id: 14, name: "Roles Full Access", feature: "Roles" },
            { id: 15, name: "Levels Full Access", feature: "Levels" },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      setPermissionSetGroups(sampleGroups)
      setFilteredGroups(sampleGroups)
      updateTotalPages(sampleGroups.length, rowsPerPage)

      // Save to localStorage
      localStorage.setItem("permissionSetGroups", JSON.stringify(sampleGroups))
    }
  }, [router, rowsPerPage])

  useEffect(() => {
    if (searchTerm) {
      const filtered = permissionSetGroups.filter(
        (group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredGroups(filtered)
      setCurrentPage(1)
      updateTotalPages(filtered.length, rowsPerPage)
    } else {
      setFilteredGroups(permissionSetGroups)
      updateTotalPages(permissionSetGroups.length, rowsPerPage)
    }
  }, [searchTerm, permissionSetGroups, rowsPerPage])

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
    updateTotalPages(filteredGroups.length, newRowsPerPage)
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

  const handleAddGroup = () => {
    setEditingGroup(null)
    setDialogOpen(true)
  }

  const handleEditGroup = (group: PermissionSetGroup) => {
    setEditingGroup(group)
    setDialogOpen(true)
  }

  const handleDeleteGroup = (id: number) => {
    if (window.confirm("Are you sure you want to delete this permission set group?")) {
      const updatedGroups = permissionSetGroups.filter((group) => group.id !== id)
      setPermissionSetGroups(updatedGroups)
      localStorage.setItem("permissionSetGroups", JSON.stringify(updatedGroups))
    }
  }

  const handleSaveGroup = (group: PermissionSetGroup) => {
    if (editingGroup) {
      // Update existing group
      const updatedGroups = permissionSetGroups.map((g) =>
        g.id === editingGroup.id ? { ...group, id: editingGroup.id } : g,
      )
      setPermissionSetGroups(updatedGroups)
      localStorage.setItem("permissionSetGroups", JSON.stringify(updatedGroups))
    } else {
      // Add new group
      const newId = permissionSetGroups.length > 0 ? Math.max(...permissionSetGroups.map((g) => g.id)) + 1 : 1
      const newGroup = { ...group, id: newId }
      const updatedGroups = [...permissionSetGroups, newGroup]
      setPermissionSetGroups(updatedGroups)
      localStorage.setItem("permissionSetGroups", JSON.stringify(updatedGroups))
    }
    setDialogOpen(false)
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedGroups = filteredGroups.slice(startIndex, endIndex)

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Permission Set Groups</h1>
          <Button onClick={handleAddGroup}>Add Group</Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Permission Set Group Management</h2>
          <p className="text-muted-foreground mb-6">Manage permission set groups to organize related permissions.</p>

          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2">Permission Set Groups</h3>
            <p className="text-muted-foreground mb-4">Manage permission set groups.</p>

            <div className="my-4">
              <Input placeholder="Search permission set groups..." value={searchTerm} onChange={handleSearch} />
            </div>

            <div className="border rounded-md overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permission Sets</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedGroups.length > 0 ? (
                    displayedGroups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium">{group.name}</TableCell>
                        <TableCell>{group.description || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {group.permissionSets.slice(0, 3).map((set) => (
                              <Badge key={set.id} variant="outline" className="mr-1">
                                {set.name}
                              </Badge>
                            ))}
                            {group.permissionSets.length > 3 && (
                              <Badge variant="outline">+{group.permissionSets.length - 3} more</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(group.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(group.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditGroup(group)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteGroup(group.id)}
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
                        No permission set groups found
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

      <PermissionSetGroupDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        group={editingGroup}
        onSave={handleSaveGroup}
      />
    </AppLayout>
  )
}
