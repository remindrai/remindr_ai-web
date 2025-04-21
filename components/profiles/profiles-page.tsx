"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProfileDialog } from "@/components/profiles/profile-dialog"
import { Pencil, Trash2, Eye, Edit, Lock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Permission {
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

interface Profile {
  id: number
  name: string
  description: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
  isDefault: boolean
}

export function ProfilesPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load profiles from localStorage or use sample data
    const savedProfiles = localStorage.getItem("profiles")
    if (savedProfiles) {
      const parsedProfiles = JSON.parse(savedProfiles)
      setProfiles(parsedProfiles)
      setFilteredProfiles(parsedProfiles)
      updateTotalPages(parsedProfiles.length, rowsPerPage)
    } else {
      // Sample Profiles Data
      const sampleProfiles = [
        {
          id: 1,
          name: "System Administrator",
          description: "Full access to all features and settings",
          permissions: [
            {
              feature: "Users",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Profiles",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Tasks",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Calendar",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Contacts",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Categories",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Priorities",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Groups",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Teams",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Roles",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Departments",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Levels",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Permission Sets",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Permission Set Groups",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
          ],
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-01T00:00:00Z",
          isDefault: true,
        },
        {
          id: 2,
          name: "Standard User",
          description: "Basic access to common features",
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
            {
              feature: "Profiles",
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Tasks",
              view: true,
              create: true,
              edit: true,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: true,
              configure: false,
            },
            {
              feature: "Calendar",
              view: true,
              create: true,
              edit: true,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Contacts",
              view: true,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Categories",
              view: true,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Priorities",
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
            {
              feature: "Groups",
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
            {
              feature: "Teams",
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
            {
              feature: "Roles",
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Departments",
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
            {
              feature: "Levels",
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Permission Sets",
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Permission Set Groups",
              view: false,
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
          createdAt: "2023-01-02T00:00:00Z",
          updatedAt: "2023-01-02T00:00:00Z",
          isDefault: false,
        },
        {
          id: 3,
          name: "Read Only",
          description: "View-only access to most features",
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
            {
              feature: "Profiles",
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Tasks",
              view: true,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Calendar",
              view: true,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Contacts",
              view: true,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Categories",
              view: true,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Priorities",
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
            {
              feature: "Groups",
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
            {
              feature: "Teams",
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
            {
              feature: "Roles",
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Departments",
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
            {
              feature: "Levels",
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Permission Sets",
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Permission Set Groups",
              view: false,
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
          createdAt: "2023-01-03T00:00:00Z",
          updatedAt: "2023-01-03T00:00:00Z",
          isDefault: false,
        },
        {
          id: 4,
          name: "Task Manager",
          description: "Full access to tasks and related features",
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
            {
              feature: "Profiles",
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Tasks",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: true,
            },
            {
              feature: "Calendar",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Contacts",
              view: true,
              create: true,
              edit: true,
              delete: false,
              approve: false,
              export: true,
              import: true,
              assign: false,
              configure: false,
            },
            {
              feature: "Categories",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: false,
              export: true,
              import: true,
              assign: false,
              configure: false,
            },
            {
              feature: "Priorities",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: false,
              export: true,
              import: true,
              assign: false,
              configure: false,
            },
            {
              feature: "Groups",
              view: true,
              create: true,
              edit: true,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Teams",
              view: true,
              create: true,
              edit: true,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Roles",
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Departments",
              view: true,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Levels",
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Permission Sets",
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Permission Set Groups",
              view: false,
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
          createdAt: "2023-01-04T00:00:00Z",
          updatedAt: "2023-01-04T00:00:00Z",
          isDefault: false,
        },
        {
          id: 5,
          name: "HR Manager",
          description: "Access to user and department management",
          permissions: [
            {
              feature: "Users",
              view: true,
              create: true,
              edit: true,
              delete: false,
              approve: true,
              export: true,
              import: true,
              assign: true,
              configure: false,
            },
            {
              feature: "Profiles",
              view: true,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Tasks",
              view: true,
              create: true,
              edit: true,
              delete: false,
              approve: true,
              export: true,
              import: false,
              assign: true,
              configure: false,
            },
            {
              feature: "Calendar",
              view: true,
              create: true,
              edit: true,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Contacts",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: false,
              export: true,
              import: true,
              assign: false,
              configure: false,
            },
            {
              feature: "Categories",
              view: true,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: true,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Priorities",
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
            {
              feature: "Groups",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: false,
              export: true,
              import: true,
              assign: true,
              configure: false,
            },
            {
              feature: "Teams",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: false,
              export: true,
              import: true,
              assign: true,
              configure: false,
            },
            {
              feature: "Roles",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: false,
              export: true,
              import: true,
              assign: true,
              configure: false,
            },
            {
              feature: "Departments",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: false,
              export: true,
              import: true,
              assign: true,
              configure: false,
            },
            {
              feature: "Levels",
              view: true,
              create: true,
              edit: true,
              delete: true,
              approve: false,
              export: true,
              import: true,
              assign: true,
              configure: false,
            },
            {
              feature: "Permission Sets",
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            },
            {
              feature: "Permission Set Groups",
              view: false,
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
          createdAt: "2023-01-05T00:00:00Z",
          updatedAt: "2023-01-05T00:00:00Z",
          isDefault: false,
        },
      ]
      setProfiles(sampleProfiles)
      setFilteredProfiles(sampleProfiles)
      updateTotalPages(sampleProfiles.length, rowsPerPage)

      // Save to localStorage
      localStorage.setItem("profiles", JSON.stringify(sampleProfiles))
    }
  }, [router, rowsPerPage])

  useEffect(() => {
    if (searchTerm) {
      const filtered = profiles.filter(
        (profile) =>
          profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProfiles(filtered)
      setCurrentPage(1)
      updateTotalPages(filtered.length, rowsPerPage)
    } else {
      setFilteredProfiles(profiles)
      updateTotalPages(profiles.length, rowsPerPage)
    }
  }, [searchTerm, profiles, rowsPerPage])

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
    updateTotalPages(filteredProfiles.length, newRowsPerPage)
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

  const handleFirstPage = () => {
    setCurrentPage(1)
  }

  const handleLastPage = () => {
    setCurrentPage(totalPages)
  }

  const handleAddProfile = () => {
    setEditingProfile(null)
    setDialogOpen(true)
  }

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile)
    setDialogOpen(true)
  }

  const handleDeleteProfile = (id: number) => {
    // Check if it's the default profile
    const profileToDelete = profiles.find((profile) => profile.id === id)
    if (profileToDelete?.isDefault) {
      toast({
        title: "Cannot delete default profile",
        description: "The default profile cannot be deleted.",
        variant: "destructive",
      })
      return
    }

    if (window.confirm("Are you sure you want to delete this profile?")) {
      const updatedProfiles = profiles.filter((profile) => profile.id !== id)
      setProfiles(updatedProfiles)
      localStorage.setItem("profiles", JSON.stringify(updatedProfiles))
      toast({
        title: "Profile deleted",
        description: "The profile has been successfully deleted.",
      })
    }
  }

  const handleSaveProfile = (profileData: Profile) => {
    const now = new Date().toISOString()

    if (editingProfile) {
      // Update existing profile
      const updatedProfiles = profiles.map((profile) =>
        profile.id === editingProfile.id
          ? {
              ...profileData,
              id: editingProfile.id,
              updatedAt: now,
              createdAt: editingProfile.createdAt,
              isDefault: editingProfile.isDefault,
            }
          : profile,
      )
      setProfiles(updatedProfiles)
      localStorage.setItem("profiles", JSON.stringify(updatedProfiles))
      toast({
        title: "Profile updated",
        description: "The profile has been successfully updated.",
      })
    } else {
      // Add new profile
      const newId = profiles.length > 0 ? Math.max(...profiles.map((p) => p.id)) + 1 : 1
      const newProfile = {
        ...profileData,
        id: newId,
        createdAt: now,
        updatedAt: now,
        isDefault: false,
      }
      const updatedProfiles = [...profiles, newProfile]
      setProfiles(updatedProfiles)
      localStorage.setItem("profiles", JSON.stringify(updatedProfiles))
      toast({
        title: "Profile created",
        description: "The new profile has been successfully created.",
      })
    }
    setDialogOpen(false)
  }

  const handleSetDefaultProfile = (id: number) => {
    const updatedProfiles = profiles.map((profile) => ({
      ...profile,
      isDefault: profile.id === id,
    }))
    setProfiles(updatedProfiles)
    localStorage.setItem("profiles", JSON.stringify(updatedProfiles))
    toast({
      title: "Default profile updated",
      description: "The default profile has been updated successfully.",
    })
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  // Count permissions
  const countPermissions = (permissions: Permission[]) => {
    const viewCount = permissions.filter((p) => p.view).length
    const editCount = permissions.filter((p) => p.edit).length
    const deleteCount = permissions.filter((p) => p.delete).length

    return { viewCount, editCount, deleteCount }
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedProfiles = filteredProfiles.slice(startIndex, endIndex)

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Profiles</h1>
          <Button onClick={handleAddProfile}>Add Profile</Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Profile Management</h2>
          <p className="text-muted-foreground mb-6">
            Manage access profiles that control what features users can view, edit, and delete.
          </p>

          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2">Profiles</h3>
            <p className="text-muted-foreground mb-4">Configure access control profiles for your users.</p>

            <div className="my-4">
              <Input placeholder="Search profiles..." value={searchTerm} onChange={handleSearch} />
            </div>

            <div className="border rounded-md overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profile Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedProfiles.length > 0 ? (
                    displayedProfiles.map((profile) => {
                      const { viewCount, editCount, deleteCount } = countPermissions(profile.permissions)
                      return (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">{profile.name}</TableCell>
                          <TableCell>{profile.description}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <div className="flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                <Eye className="h-3 w-3 mr-1" />
                                {viewCount}
                              </div>
                              <div className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                <Edit className="h-3 w-3 mr-1" />
                                {editCount}
                              </div>
                              <div className="flex items-center text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                <Trash2 className="h-3 w-3 mr-1" />
                                {deleteCount}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(profile.createdAt)}</TableCell>
                          <TableCell>
                            {profile.isDefault ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Default
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Active
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditProfile(profile)}
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                title="Edit Profile"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteProfile(profile.id)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                disabled={profile.isDefault}
                                title={profile.isDefault ? "Cannot delete default profile" : "Delete Profile"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              {!profile.isDefault && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleSetDefaultProfile(profile.id)}
                                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                                  title="Set as Default Profile"
                                >
                                  <Lock className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No profiles found
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
                <Button variant="outline" size="icon" onClick={handleFirstPage} disabled={currentPage <= 1}>
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
                    <polyline points="11 17 6 12 11 7"></polyline>
                    <polyline points="18 17 13 12 18 7"></polyline>
                  </svg>
                </Button>
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
                <Button variant="outline" size="icon" onClick={handleLastPage} disabled={currentPage >= totalPages}>
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
                    <polyline points="13 17 18 12 13 7"></polyline>
                    <polyline points="6 17 11 12 6 7"></polyline>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profile={editingProfile}
        onSave={handleSaveProfile}
      />
    </AppLayout>
  )
}
