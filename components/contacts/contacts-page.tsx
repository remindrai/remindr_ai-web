"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ContactDialog } from "@/components/contacts/contact-dialog"
import { Pencil, Trash2, Mail, Phone } from "lucide-react"

interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  role?: string
}

export function ContactsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load contacts from localStorage or use sample data
    const savedContacts = localStorage.getItem("contacts")
    try {
      if (savedContacts) {
        const parsedContacts = JSON.parse(savedContacts)
        // Validate that each contact has the required fields
        const validContacts = parsedContacts.map((contact) => ({
          id: contact.id,
          firstName: contact.firstName || "",
          lastName: contact.lastName || "",
          email: contact.email || "",
          phone: contact.phone || "",
          address: contact.address || "",
          role: contact.role || "",
        }))
        setContacts(validContacts)
        setFilteredContacts(validContacts)
        updateTotalPages(validContacts.length, rowsPerPage)
      } else {
        // Use sample data if no saved contacts
        const sampleContacts = [
          {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            phone: "123-456-7890",
            address: "123 Main St, Anytown, USA",
            role: "Marketing Director",
          },
          {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
            email: "jane@example.com",
            phone: "123-456-7891",
            address: "456 Oak Ave, Somewhere, USA",
            role: "Content Strategist",
          },
          {
            id: 3,
            firstName: "Bob",
            lastName: "Johnson",
            email: "bob@example.com",
            phone: "123-456-7892",
            address: "789 Pine Rd, Nowhere, USA",
            role: "SEO Specialist",
          },
          {
            id: 4,
            firstName: "Alice",
            lastName: "Williams",
            email: "alice@example.com",
            phone: "123-456-7893",
            address: "321 Elm St, Everywhere, USA",
            role: "Social Media Manager",
          },
          {
            id: 5,
            firstName: "Charlie",
            lastName: "Brown",
            email: "charlie@example.com",
            phone: "123-456-7894",
            address: "654 Maple Dr, Anywhere, USA",
            role: "Graphic Designer",
          },
        ]
        setContacts(sampleContacts)
        setFilteredContacts(sampleContacts)
        updateTotalPages(sampleContacts.length, rowsPerPage)

        // Save to localStorage
        localStorage.setItem("contacts", JSON.stringify(sampleContacts))
      }
    } catch (error) {
      console.error("Error loading contacts:", error)
      // Fallback to sample data if there's an error
      const sampleContacts = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "123-456-7890",
          address: "123 Main St, Anytown, USA",
          role: "Marketing Director",
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          phone: "123-456-7891",
          address: "456 Oak Ave, Somewhere, USA",
          role: "Content Strategist",
        },
        {
          id: 3,
          firstName: "Bob",
          lastName: "Johnson",
          email: "bob@example.com",
          phone: "123-456-7892",
          address: "789 Pine Rd, Nowhere, USA",
          role: "SEO Specialist",
        },
        {
          id: 4,
          firstName: "Alice",
          lastName: "Williams",
          email: "alice@example.com",
          phone: "123-456-7893",
          address: "321 Elm St, Everywhere, USA",
          role: "Social Media Manager",
        },
        {
          id: 5,
          firstName: "Charlie",
          lastName: "Brown",
          email: "charlie@example.com",
          phone: "123-456-7894",
          address: "654 Maple Dr, Anywhere, USA",
          role: "Graphic Designer",
        },
      ]
      setContacts(sampleContacts)
      setFilteredContacts(sampleContacts)
      updateTotalPages(sampleContacts.length, rowsPerPage)
      localStorage.setItem("contacts", JSON.stringify(sampleContacts))
    }
  }, [router, rowsPerPage])

  useEffect(() => {
    if (searchTerm) {
      const filtered = contacts.filter(
        (contact) =>
          contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.phone && contact.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (contact.address && contact.address.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredContacts(filtered)
      setCurrentPage(1)
      updateTotalPages(filtered.length, rowsPerPage)
    } else {
      setFilteredContacts(contacts)
      updateTotalPages(contacts.length, rowsPerPage)
    }
  }, [searchTerm, contacts, rowsPerPage])

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
    updateTotalPages(filteredContacts.length, newRowsPerPage)
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

  const handleAddContact = () => {
    setEditingContact(null)
    setDialogOpen(true)
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setDialogOpen(true)
  }

  const handleDeleteContact = (id: number) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      const updatedContacts = contacts.filter((contact) => contact.id !== id)
      setContacts(updatedContacts)
      localStorage.setItem("contacts", JSON.stringify(updatedContacts))
    }
  }

  const handleSaveContact = (contact: Omit<Contact, "id"> | Omit<Contact, "id">[]) => {
    if (Array.isArray(contact)) {
      // Handle bulk contacts
      const newContacts = contact.map((c, index) => {
        const newId = contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + index + 1 : index + 1
        return { ...c, id: newId }
      })

      const updatedContacts = [...contacts, ...newContacts]
      setContacts(updatedContacts)
      localStorage.setItem("contacts", JSON.stringify(updatedContacts))
    } else {
      // Handle single contact
      if (editingContact) {
        // Update existing contact
        const updatedContacts = contacts.map((c) =>
          c.id === editingContact.id ? { ...contact, id: editingContact.id } : c,
        )
        setContacts(updatedContacts)
        localStorage.setItem("contacts", JSON.stringify(updatedContacts))
      } else {
        // Add new contact
        const newId = contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1
        const newContact = { ...contact, id: newId }
        const updatedContacts = [...contacts, newContact]
        setContacts(updatedContacts)
        localStorage.setItem("contacts", JSON.stringify(updatedContacts))
      }
    }
    setDialogOpen(false)
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedContacts = filteredContacts.slice(startIndex, endIndex)

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Contacts</h1>
          <Button onClick={handleAddContact}>Add Contact</Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Contact Management</h2>
          <p className="text-muted-foreground mb-6">Manage your contacts and team members.</p>

          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2">Contacts</h3>
            <p className="text-muted-foreground mb-4">View and manage your contacts.</p>

            <div className="my-4">
              <Input placeholder="Search contacts..." value={searchTerm} onChange={handleSearch} />
            </div>

            <div className="border rounded-md overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedContacts.length > 0 ? (
                    displayedContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.firstName || "-"}</TableCell>
                        <TableCell>{contact.lastName || "-"}</TableCell>
                        <TableCell>
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center text-blue-600 hover:underline"
                          >
                            <Mail className="h-3.5 w-3.5 mr-1" />
                            {contact.email}
                          </a>
                        </TableCell>
                        <TableCell>
                          {contact.phone && (
                            <a href={`tel:${contact.phone}`} className="flex items-center hover:underline">
                              <Phone className="h-3.5 w-3.5 mr-1" />
                              {contact.phone}
                            </a>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={contact.address || ""}>
                          {contact.address || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditContact(contact)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteContact(contact.id)}
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
                        No contacts found
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

      <ContactDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        contact={editingContact}
        onSave={handleSaveContact}
      />
    </AppLayout>
  )
}
