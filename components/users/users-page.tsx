"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserDialog } from "@/components/users/user-dialog"
import { Pencil, Trash2, Mail, Phone, MapPin } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  role: string
  department: string
  status: string
  lastLogin: string
  verified: boolean
}

export function UsersPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load users from localStorage or use sample data
    const savedUsers = localStorage.getItem("users")
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers)
      setUsers(parsedUsers)
      setFilteredUsers(parsedUsers)
      updateTotalPages(parsedUsers.length, rowsPerPage)
    } else {
      // Sample Users Data
      const sampleUsers = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "555-123-4567",
          address: "123 Main St, Anytown, CA 94321",
          role: "Administrator",
          department: "IT",
          status: "Active",
          lastLogin: "2023-04-15T10:30:00",
          verified: true,
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          phone: "555-987-6543",
          address: "456 Oak Ave, Somewhere, NY 10001",
          role: "Manager",
          department: "HR",
          status: "Active",
          lastLogin: "2023-04-14T14:45:00",
          verified: true,
        },
        {
          id: 3,
          firstName: "Robert",
          lastName: "Johnson",
          email: "robert@example.com",
          phone: "555-456-7890",
          address: "789 Pine Rd, Elsewhere, TX 75001",
          role: "Developer",
          department: "Engineering",
          status: "Inactive",
          lastLogin: "2023-03-28T09:15:00",
          verified: false,
        },
        {
          id: 4,
          firstName: "Emily",
          lastName: "Davis",
          email: "emily@example.com",
          phone: "555-789-0123",
          address: "321 Cedar Ln, Nowhere, WA 98001",
          role: "Designer",
          department: "Marketing",
          status: "Active",
          lastLogin: "2023-04-12T16:20:00",
          verified: true,
        },
        {
          id: 5,
          firstName: "Michael",
          lastName: "Wilson",
          email: "michael@example.com",
          phone: "555-234-5678",
          address: "654 Birch St, Anywhere, FL 33101",
          role: "Analyst",
          department: "Finance",
          status: "Active",
          lastLogin: "2023-04-10T11:05:00",
          verified: true,
        },
      ]
      setUsers(sampleUsers)
      setFilteredUsers(sampleUsers)
      updateTotalPages(sampleUsers.length, rowsPerPage)

      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(sampleUsers))
    }
  }, [router, rowsPerPage])

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)
      setCurrentPage(1)
      updateTotalPages(filtered.length, rowsPerPage)
    } else {
      setFilteredUsers(users)
      updateTotalPages(users.length, rowsPerPage)
    }
  }, [searchTerm, users, rowsPerPage])

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
    updateTotalPages(filteredUsers.length, newRowsPerPage)
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

  const handleAddUser = () => {
    setEditingUser(null)
    setDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const handleDeleteUser = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((user) => user.id !== id)
      setUsers(updatedUsers)
      localStorage.setItem("users", JSON.stringify(updatedUsers))
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      })
    }
  }

  // Generate random password
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handleSaveUser = (userData: User) => {
    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? { ...userData, id: editingUser.id } : user,
      )
      setUsers(updatedUsers)
      localStorage.setItem("users", JSON.stringify(updatedUsers))
      toast({
        title: "User updated",
        description: "The user has been successfully updated.",
      })
    } else {
      // Add new user
      const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1
      const newUser = {
        ...userData,
        id: newId,
        verified: false,
        lastLogin: new Date().toISOString(),
      }
      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Simulate sending verification email
      toast({
        title: "Verification email sent",
        description: `A verification email has been sent to ${userData.email}.`,
      })

      // Simulate email verification (in a real app, this would happen when the user clicks the link in the email)
      setTimeout(() => {
        const verifiedUsers = users.map((user) => (user.id === newId ? { ...user, verified: true } : user))
        setUsers(verifiedUsers)
        localStorage.setItem("users", JSON.stringify(verifiedUsers))

        // Generate and "send" password
        const password = generateRandomPassword()
        toast({
          title: "Account verified",
          description: `Email verified. A temporary password has been sent to ${userData.email}.`,
        })

        console.log(`Password for ${userData.email}: ${password}`)
      }, 5000) // Simulate a 5-second delay for verification
    }
    setDialogOpen(false)
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  // Get initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedUsers = filteredUsers.slice(startIndex, endIndex)

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Users</h1>
          <Button onClick={handleAddUser}>Add User</Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-muted-foreground mb-6">Manage your system users and their permissions.</p>

          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2">Users</h3>
            <p className="text-muted-foreground mb-4">Manage system users.</p>

            <div className="my-4">
              <Input placeholder="Search users..." value={searchTerm} onChange={handleSearch} />
            </div>

            <div className="border rounded-md overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedUsers.length > 0 ? (
                    displayedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 rounded-full bg-primary/10 text-primary items-center justify-center font-medium">
                              {getInitials(user.firstName, user.lastName)}
                            </div>
                            <div>
                              <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                              <div className="text-xs text-muted-foreground">
                                Last login: {formatDate(user.lastLogin)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                              {user.email}
                              {user.verified && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                              {user.phone}
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                              {user.address}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
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
                        No users found
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

      <UserDialog open={dialogOpen} onOpenChange={setDialogOpen} user={editingUser} onSave={handleSaveUser} />
    </AppLayout>
  )
}
