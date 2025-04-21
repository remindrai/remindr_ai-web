"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LevelDialog } from "@/components/levels/level-dialog"
import { Pencil, Trash2 } from "lucide-react"

interface Level {
  id: number
  name: string
  description: string
  departmentIds: number[]
  parentLevelId: number | null
}

interface Department {
  id: number
  name: string
}

export function LevelsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [levels, setLevels] = useState<Level[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [filteredLevels, setFilteredLevels] = useState<Level[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLevel, setEditingLevel] = useState<Level | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load departments
    const sampleDepartments = [
      { id: 1, name: "Executive Office" },
      { id: 2, name: "Engineering" },
      { id: 3, name: "Marketing" },
      { id: 4, name: "Human Resources" },
    ]
    setDepartments(sampleDepartments)

    // Load levels from localStorage or use sample data
    const savedLevels = localStorage.getItem("levels")
    if (savedLevels) {
      const parsedLevels = JSON.parse(savedLevels)
      setLevels(parsedLevels)
      setFilteredLevels(parsedLevels)
      updateTotalPages(parsedLevels.length, rowsPerPage)
    } else {
      // Sample Levels Data
      const sampleLevels = [
        {
          id: 1,
          name: "Executive",
          description: "Top-level management positions",
          departmentIds: [1, 2],
          parentLevelId: null,
        },
        {
          id: 2,
          name: "Director",
          description: "Department directors and senior managers",
          departmentIds: [1, 3],
          parentLevelId: 1,
        },
        {
          id: 3,
          name: "Manager",
          description: "Team and project managers",
          departmentIds: [2, 3, 4],
          parentLevelId: 2,
        },
        {
          id: 4,
          name: "Team Lead",
          description: "Technical and functional team leaders",
          departmentIds: [2, 4],
          parentLevelId: 3,
        },
        {
          id: 5,
          name: "Senior",
          description: "Senior individual contributors",
          departmentIds: [1, 2, 3, 4],
          parentLevelId: 4,
        },
        {
          id: 6,
          name: "Mid-level",
          description: "Mid-level individual contributors",
          departmentIds: [2, 3, 4],
          parentLevelId: 5,
        },
        { id: 7, name: "Junior", description: "Entry-level positions", departmentIds: [2, 3, 4], parentLevelId: 6 },
      ]
      setLevels(sampleLevels)
      setFilteredLevels(sampleLevels)
      updateTotalPages(sampleLevels.length, rowsPerPage)

      // Save to localStorage
      localStorage.setItem("levels", JSON.stringify(sampleLevels))
    }
  }, [router, rowsPerPage])

  useEffect(() => {
    if (searchTerm) {
      const filtered = levels.filter(
        (level) =>
          level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (level.description && level.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredLevels(filtered)
      setCurrentPage(1)
      updateTotalPages(filtered.length, rowsPerPage)
    } else {
      setFilteredLevels(levels)
      updateTotalPages(levels.length, rowsPerPage)
    }
  }, [searchTerm, levels, rowsPerPage])

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
    updateTotalPages(filteredLevels.length, newRowsPerPage)
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

  const handleAddLevel = () => {
    setEditingLevel(null)
    setDialogOpen(true)
  }

  const handleEditLevel = (level: Level) => {
    setEditingLevel(level)
    setDialogOpen(true)
  }

  const handleDeleteLevel = (id: number) => {
    if (window.confirm("Are you sure you want to delete this level?")) {
      const updatedLevels = levels.filter((level) => level.id !== id)
      setLevels(updatedLevels)
      localStorage.setItem("levels", JSON.stringify(updatedLevels))
    }
  }

  const handleSaveLevel = (level: Level) => {
    if (editingLevel) {
      // Update existing level
      const updatedLevels = levels.map((l) => (l.id === editingLevel.id ? { ...level, id: editingLevel.id } : l))
      setLevels(updatedLevels)
      localStorage.setItem("levels", JSON.stringify(updatedLevels))
    } else {
      // Add new level
      const newId = levels.length > 0 ? Math.max(...levels.map((l) => l.id)) + 1 : 1
      const newLevel = { ...level, id: newId }
      const updatedLevels = [...levels, newLevel]
      setLevels(updatedLevels)
      localStorage.setItem("levels", JSON.stringify(updatedLevels))
    }
    setDialogOpen(false)
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedLevels = filteredLevels.slice(startIndex, endIndex)

  const getParentLevelName = (parentId: number | null) => {
    if (parentId === null) return "None"
    const parent = levels.find((level) => level.id === parentId)
    return parent ? parent.name : "Unknown"
  }

  const getDepartmentNames = (departmentIds: number[]) => {
    return departmentIds
      .map((id) => {
        const department = departments.find((dept) => dept.id === id)
        return department ? department.name : null
      })
      .filter(Boolean)
      .join(", ")
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Levels</h1>
          <Button onClick={handleAddLevel}>Add Level</Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Level Management</h2>
          <p className="text-muted-foreground mb-6">Create, edit, and delete organizational levels.</p>

          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2">Levels</h3>
            <p className="text-muted-foreground mb-4">Manage organizational hierarchy levels.</p>

            <div className="my-4">
              <Input placeholder="Search levels..." value={searchTerm} onChange={handleSearch} />
            </div>

            <div className="border rounded-md overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Level Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Parent Level</TableHead>
                    <TableHead>Departments</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedLevels.length > 0 ? (
                    displayedLevels.map((level) => (
                      <TableRow key={level.id}>
                        <TableCell className="font-medium">{level.name}</TableCell>
                        <TableCell>{level.description || "-"}</TableCell>
                        <TableCell>{getParentLevelName(level.parentLevelId)}</TableCell>
                        <TableCell>{getDepartmentNames(level.departmentIds)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditLevel(level)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteLevel(level.id)}
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
                        No levels found
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

      <LevelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        level={editingLevel}
        onSave={handleSaveLevel}
        levels={levels}
        departments={departments}
      />
    </AppLayout>
  )
}
