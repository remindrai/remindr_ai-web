"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertCircle, Upload } from "lucide-react"

// Update the Contact interface to include role
interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  role?: string
}

interface ContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact | null
  onSave: (contact: Omit<Contact, "id"> | Omit<Contact, "id">[]) => void
}

export function ContactDialog({ open, onOpenChange, contact, onSave }: ContactDialogProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [bulkContacts, setBulkContacts] = useState("")
  const [bulkError, setBulkError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("single")
  const [role, setRole] = useState("")

  useEffect(() => {
    if (contact) {
      setFirstName(contact.firstName || "")
      setLastName(contact.lastName || "")
      setEmail(contact.email)
      setPhone(contact.phone || "")
      setAddress(contact.address || "")
      setRole(contact.role || "")
      setActiveTab("single")
    } else {
      setFirstName("")
      setLastName("")
      setEmail("")
      setPhone("")
      setAddress("")
      setRole("")
      setBulkContacts("")
      setBulkError(null)
    }
  }, [contact, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab === "single") {
      // Validate required fields
      if (!firstName.trim() || !lastName.trim() || !email.trim()) {
        alert("First name, last name, and email are required fields")
        return
      }

      onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        role: role.trim() || undefined,
      })
    } else {
      // Process bulk contacts
      try {
        const lines = bulkContacts.trim().split("\n")
        const contacts: Omit<Contact, "id">[] = []

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue

          const parts = line.split(",")
          if (parts.length < 3) {
            setBulkError(
              `Line ${i + 1}: Not enough fields. Format should be: First Name, Last Name, Email, Phone (optional), Address (optional)`,
            )
            return
          }

          const [firstName, lastName, email, phone = "", address = "", role = ""] = parts.map((p) => p.trim())

          if (!firstName || !lastName || !email) {
            setBulkError(`Line ${i + 1}: First name, last name and email are required`)
            return
          }

          if (email && !/\S+@\S+\.\S+/.test(email)) {
            setBulkError(`Line ${i + 1}: Invalid email format`)
            return
          }

          contacts.push({
            firstName,
            lastName,
            email,
            phone: phone || undefined,
            address: address || undefined,
            role: role || undefined,
          })
        }

        if (contacts.length === 0) {
          setBulkError("No valid contacts found")
          return
        }

        onSave(contacts)
        setBulkError(null)
      } catch (error) {
        setBulkError("Error processing bulk contacts")
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        setBulkContacts(content)
        setBulkError(null)
      }
    }
    reader.onerror = () => {
      setBulkError("Error reading file")
    }
    reader.readAsText(file)

    // Reset the file input so the same file can be selected again
    e.target.value = ""
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{contact ? "Edit Contact" : "Add Contact"}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Contact</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <form id="single-contact-form" onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address (optional)</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role (optional)</Label>
                  <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Enter role" />
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="bulk">
            <form id="bulk-contact-form" onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="bulkContacts">Bulk Contacts</Label>
                    <div className="relative">
                      <input
                        type="file"
                        id="csv-upload"
                        accept=".csv,.txt"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                      />
                      <Button variant="outline" size="sm" className="h-8" type="button">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload CSV
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Enter one contact per line in the format:
                    <br />
                    First Name, Last Name, Email, Phone (optional), Address (optional)
                  </div>
                  <Textarea
                    id="bulkContacts"
                    value={bulkContacts}
                    onChange={(e) => {
                      setBulkContacts(e.target.value)
                      setBulkError(null)
                    }}
                    placeholder="John, Doe, john.doe@example.com, +1 (555) 123-4567, 123 Main St"
                    rows={8}
                    required
                  />
                  {bulkError && (
                    <div className="text-sm text-destructive flex items-start mt-1">
                      <AlertCircle className="h-4 w-4 mr-1 mt-0.5" />
                      <span>{bulkError}</span>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={activeTab === "single" ? "single-contact-form" : "bulk-contact-form"}>
            {contact ? "Save Changes" : activeTab === "single" ? "Add Contact" : "Import Contacts"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
