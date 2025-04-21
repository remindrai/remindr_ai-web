"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TeamDialog } from "@/components/teams/team-dialog"
import { Pencil, Trash2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Team interface
interface Team {
  id: number
  name: string
  description: string
  memberCount: number
  type: string
  members: number[] // Array of member IDs
}

export function TeamsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load teams from localStorage or use sample data
    const savedTeams = localStorage.getItem("teams")
    if (savedTeams) {
      const parsedTeams = JSON.parse(savedTeams)
      setTeams(parsedTeams)
      setFilteredTeams(parsedTeams)
      updateTotalPages(parsedTeams.length, rowsPerPage)
    } else {
      // Sample Teams Data
      const sampleTeams = [
        {
          id: 1,
          name: "Frontend Team",
          description: "Responsible for UI/UX implementation",
          memberCount: 6,
          type: "Development",
          members: [1, 3, 5, 9, 12, 14], // 6 members
        },
        {
          id: 2,
          name: "Backend Team",
          description: "API and database development",
          memberCount: 5,
          type: "Development",
          members: [2, 4, 10, 11, 13], // 5 members
        },
        {
          id: 3,
          name: "QA Team",
          description: "Quality assurance and testing",
          memberCount: 4,
          type: "Quality",
          members: [6, 7, 8, 15], // 4 members
        },
        {
          id: 4,
          name: "Leadership Team",
          description: "Project management and leadership",
          memberCount: 3,
          type: "Management",
          members: [1, 2, 15], // 3 members
        },
        {
          id: 5,
          name: "DevOps Team",
          description: "Infrastructure and deployment",
          memberCount: 2,
          type: "Operations",
          members: [13, 14], // 2 members
        },
      ]
      setTeams(sampleTeams)
      setFilteredTeams(sampleTeams)
      updateTotalPages(sampleTeams.length, rowsPerPage)

      // Save to localStorage
      localStorage.setItem("teams", JSON.stringify(sampleTeams))
    }
  }, [router, rowsPerPage])

  useEffect(() => {
    if (searchTerm) {
      const filtered = teams.filter(
        (team) =>
          team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (team.description && team.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (team.type && team.type.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredTeams(filtered)
      setCurrentPage(1)
      updateTotalPages(filtered.length, rowsPerPage)
    } else {
      setFilteredTeams(teams)
      updateTotalPages(teams.length, rowsPerPage)
    }
  }, [searchTerm, teams, rowsPerPage])

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
    updateTotalPages(filteredTeams.length, newRowsPerPage)
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

  const handleAddTeam = () => {
    setEditingTeam(null)
    setDialogOpen(true)
  }

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team)
    setDialogOpen(true)
  }

  const handleDeleteTeam = (id: number) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      const updatedTeams = teams.filter((team) => team.id !== id)
      setTeams(updatedTeams)
      localStorage.setItem("teams", JSON.stringify(updatedTeams))
    }
  }

  const handleSaveTeam = (team: Omit<Team, "id">) => {
    if (editingTeam) {
      // Update existing team
      const updatedTeams = teams.map((t) => (t.id === editingTeam.id ? { ...team, id: editingTeam.id } : t))
      setTeams(updatedTeams)
      localStorage.setItem("teams", JSON.stringify(updatedTeams))
    } else {
      // Add new team
      const newId = teams.length > 0 ? Math.max(...teams.map((t) => t.id)) + 1 : 1
      const newTeam = { ...team, id: newId }
      const updatedTeams = [...teams, newTeam]
      setTeams(updatedTeams)
      localStorage.setItem("teams", JSON.stringify(updatedTeams))
    }
    setDialogOpen(false)
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedTeams = filteredTeams.slice(startIndex, endIndex)

  // Get badge color based on team type
  const getTeamTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "development":
        return "bg-blue-100 text-blue-800"
      case "quality":
        return "bg-green-100 text-green-800"
      case "management":
        return "bg-purple-100 text-purple-800"
      case "operations":
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
          <h1 className="text-3xl font-bold">Teams</h1>
          <Button onClick={handleAddTeam}>Add Team</Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Team Management</h2>
          <p className="text-muted-foreground mb-6">Create, edit, and manage your organization's teams.</p>

          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2">Teams</h3>
            <p className="text-muted-foreground mb-4">View and manage your teams.</p>

            <div className="my-4">
              <Input placeholder="Search teams..." value={searchTerm} onChange={handleSearch} />
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
                  {displayedTeams.length > 0 ? (
                    displayedTeams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.name}</TableCell>
                        <TableCell>{team.description || "-"}</TableCell>
                        <TableCell>
                          <Badge className={getTeamTypeBadgeColor(team.type)}>{team.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{team.memberCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditTeam(team)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTeam(team.id)}
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
                        No teams found
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

      <TeamDialog open={dialogOpen} onOpenChange={setDialogOpen} team={editingTeam} onSave={handleSaveTeam} />
    </AppLayout>
  )
}
