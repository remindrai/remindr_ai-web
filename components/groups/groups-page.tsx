"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GroupDialog } from "@/components/groups/group-dialog"
import { Pencil, Trash2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Update the Group interface to include members
interface Group {
  id: number
  name: string
  description: string
  memberCount: number
  type: string
  members: number[] // Array of member IDs
}

export function GroupsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load groups from localStorage or use sample data
    const savedGroups = localStorage.getItem("groups")
    if (savedGroups) {
      const parsedGroups = JSON.parse(savedGroups)
      setGroups(parsedGroups)
      setFilteredGroups(parsedGroups)
      updateTotalPages(parsedGroups.length, rowsPerPage)
    } else {
      // Update the sample data to include actual member IDs
      // Sample Groups Data
      const sampleGroups = [
        {
          id: 1,
          name: "Marketing Team",
          description: "Marketing department team members",
          memberCount: 8,
          type: "Department",
          members: [1, 2, 3, 4, 5, 6, 7, 8], // 8 members
        },
        {
          id: 2,
          name: "Development Team",
          description: "Software development team",
          memberCount: 12,
          type: "Department",
          members: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // 12 members
        },
        {
          id: 3,
          name: "Design Team",
          description: "UI/UX design team",
          memberCount: 6,
          type: "Department",
          members: [3, 4, 5, 6, 7, 8], // 6 members
        },
        {
          id: 4,
          name: "Project Alpha",
          description: "Website redesign project team",
          memberCount: 5,
          type: "Project",
          members: [1, 3, 5, 7, 9], // 5 members
        },
        {
          id: 5,
          name: "Project Beta",
          description: "Mobile app development team",
          memberCount: 7,
          type: "Project",
          members: [2, 4, 6, 8, 10, 12, 14], // 7 members
        },
      ]
      setGroups(sampleGroups)
      setFilteredGroups(sampleGroups)
      updateTotalPages(sampleGroups.length, rowsPerPage)

      // Save to localStorage
      localStorage.setItem("groups", JSON.stringify(sampleGroups))
    }
  }, [router, rowsPerPage])

  useEffect(() => {
    if (searchTerm) {
      const filtered = groups.filter(
        (group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (group.type && group.type.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredGroups(filtered)
      setCurrentPage(1)
      updateTotalPages(filtered.length, rowsPerPage)
    } else {
      setFilteredGroups(groups)
      updateTotalPages(groups.length, rowsPerPage)
    }
  }, [searchTerm, groups, rowsPerPage])

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

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group)
    setDialogOpen(true)
  }

  const handleDeleteGroup = (id: number) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      const updatedGroups = groups.filter((group) => group.id !== id)
      setGroups(updatedGroups)
      localStorage.setItem("groups", JSON.stringify(updatedGroups))
    }
  }

  const handleSaveGroup = (group: Omit<Group, "id">) => {
    if (editingGroup) {
      // Update existing group
      const updatedGroups = groups.map((g) => (g.id === editingGroup.id ? { ...group, id: editingGroup.id } : g))
      setGroups(updatedGroups)
      localStorage.setItem("groups", JSON.stringify(updatedGroups))
    } else {
      // Add new group
      const newId = groups.length > 0 ? Math.max(...groups.map((g) => g.id)) + 1 : 1
      const newGroup = { ...group, id: newId }
      const updatedGroups = [...groups, newGroup]
      setGroups(updatedGroups)
      localStorage.setItem("groups", JSON.stringify(updatedGroups))
    }
    setDialogOpen(false)
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedGroups = filteredGroups.slice(startIndex, endIndex)

  // Get badge color based on group type
  const getGroupTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "department":
        return "bg-blue-100 text-blue-800"
      case "project":
        return "bg-green-100 text-green-800"
      case "management":
        return "bg-purple-100 text-purple-800"
      case "committee":
        return "bg-yellow-100 text-yellow-800"
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
          <h1 className="text-3xl font-bold">Groups</h1>
          <Button onClick={handleAddGroup}>Add Group</Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Group Management</h2>
          <p className="text-muted-foreground mb-6">Create, edit, and manage team groups.</p>

          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2">Groups</h3>
            <p className="text-muted-foreground mb-4">Manage your organization's groups.</p>

            <div className="my-4">
              <Input placeholder="Search groups..." value={searchTerm} onChange={handleSearch} />
            </div>

            <div className="border rounded-md overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Members</TableHead>
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
                          <Badge className={getGroupTypeBadgeColor(group.type)}>{group.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{group.memberCount}</span>
                          </div>
                        </TableCell>
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
                      <TableCell colSpan={5} className="text-center py-8">
                        No groups found
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

      <GroupDialog open={dialogOpen} onOpenChange={setDialogOpen} group={editingGroup} onSave={handleSaveGroup} />
    </AppLayout>
  )
}
