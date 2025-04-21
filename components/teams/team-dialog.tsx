"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Search, UserCircle, Phone, Mail, Briefcase } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  role?: string
}

interface Team {
  id: number
  name: string
  description: string
  memberCount: number
  type: string
  members: number[] // Array of member IDs
}

interface TeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team: Team | null
  onSave: (team: Omit<Team, "id">) => void
}

export function TeamDialog({ open, onOpenChange, team, onSave }: TeamDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [teamType, setTeamType] = useState("Development")

  useEffect(() => {
    // Load contacts from localStorage or use sample data
    const savedContacts = localStorage.getItem("contacts")
    if (savedContacts) {
      const parsedContacts = JSON.parse(savedContacts)
      setContacts(parsedContacts)
      setFilteredContacts(parsedContacts)
    } else {
      // Sample Contacts Data - Expanded to include more contacts with roles
      const sampleContacts = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "(555) 123-4567",
          role: "Marketing Director",
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          phone: "(555) 987-6543",
          role: "Content Strategist",
        },
        {
          id: 3,
          firstName: "Robert",
          lastName: "Johnson",
          email: "robert@example.com",
          phone: "(555) 234-5678",
          role: "SEO Specialist",
        },
        {
          id: 4,
          firstName: "Emily",
          lastName: "Davis",
          email: "emily.davis@example.com",
          phone: "(555) 876-5432",
          role: "Social Media Manager",
        },
        {
          id: 5,
          firstName: "Michael",
          lastName: "Wilson",
          email: "michael.wilson@example.com",
          phone: "(555) 345-6789",
          role: "Graphic Designer",
        },
        {
          id: 6,
          firstName: "Sarah",
          lastName: "Brown",
          email: "sarah.brown@example.com",
          phone: "(555) 456-7890",
          role: "Content Writer",
        },
        {
          id: 7,
          firstName: "David",
          lastName: "Miller",
          email: "david.miller@example.com",
          phone: "(555) 567-8901",
          role: "Marketing Analyst",
        },
        {
          id: 8,
          firstName: "Jennifer",
          lastName: "Taylor",
          email: "jennifer.taylor@example.com",
          phone: "(555) 678-9012",
          role: "PR Specialist",
        },
        {
          id: 9,
          firstName: "James",
          lastName: "Anderson",
          email: "james.anderson@example.com",
          phone: "(555) 789-0123",
          role: "Frontend Developer",
        },
        {
          id: 10,
          firstName: "Lisa",
          lastName: "Thomas",
          email: "lisa.thomas@example.com",
          phone: "(555) 890-1234",
          role: "Backend Developer",
        },
        {
          id: 11,
          firstName: "Daniel",
          lastName: "Jackson",
          email: "daniel.jackson@example.com",
          phone: "(555) 901-2345",
          role: "Full Stack Developer",
        },
        {
          id: 12,
          firstName: "Jessica",
          lastName: "White",
          email: "jessica.white@example.com",
          phone: "(555) 012-3456",
          role: "UI/UX Designer",
        },
        {
          id: 13,
          firstName: "Matthew",
          lastName: "Harris",
          email: "matthew.harris@example.com",
          phone: "(555) 123-4567",
          role: "QA Engineer",
        },
        {
          id: 14,
          firstName: "Amanda",
          lastName: "Martin",
          email: "amanda.martin@example.com",
          phone: "(555) 234-5678",
          role: "DevOps Engineer",
        },
        {
          id: 15,
          firstName: "Christopher",
          lastName: "Thompson",
          email: "christopher.thompson@example.com",
          phone: "(555) 345-6789",
          role: "Project Manager",
        },
      ]
      setContacts(sampleContacts)
      setFilteredContacts(sampleContacts)

      // Save to localStorage
      localStorage.setItem("contacts", JSON.stringify(sampleContacts))
    }
  }, [])

  useEffect(() => {
    if (team) {
      setName(team.name)
      setDescription(team.description || "")
      setSelectedMembers(team.members || [])
      setTeamType(team.type || "Development")

      // If the team has members but the members array is empty,
      // we'll create some dummy members based on the memberCount
      if (team.memberCount > 0 && (!team.members || team.members.length === 0)) {
        // Create dummy member IDs based on available contacts
        const dummyMembers = contacts.slice(0, team.memberCount).map((contact) => contact.id)
        setSelectedMembers(dummyMembers)
      }
    } else {
      setName("")
      setDescription("")
      setSelectedMembers([])
      setTeamType("Development")
    }
  }, [team, open, contacts])

  useEffect(() => {
    // Filter contacts based on search term
    if (searchTerm) {
      const filtered = contacts.filter(
        (contact) =>
          `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.phone && contact.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (contact.role && contact.role.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredContacts(filtered)
    } else {
      setFilteredContacts(contacts)
    }
  }, [searchTerm, contacts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      description,
      memberCount: selectedMembers.length,
      type: teamType,
      members: selectedMembers,
    })
  }

  const toggleMember = (contactId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
          <DialogTitle className="text-xl">{team ? "Edit Team" : "Add New Team"}</DialogTitle>
          <DialogClose className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-medium">
                Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter team name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type" className="font-medium">
                Type<span className="text-red-500">*</span>
              </Label>
              <Select value={teamType} onValueChange={setTeamType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Quality">Quality</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter team description"
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label className="font-medium">Members</Label>
              <div className="border rounded-md p-3 min-h-[42px] flex flex-wrap gap-2">
                {selectedMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No members selected</p>
                ) : (
                  contacts
                    .filter((contact) => selectedMembers.includes(contact.id))
                    .map((contact) => {
                      // Generate a random pastel color for each contact
                      const hue = (contact.id * 137) % 360 // Use contact ID to ensure consistent colors
                      const bgColor = `hsl(${hue}, 70%, 90%)`
                      const textColor = `hsl(${hue}, 70%, 30%)`

                      return (
                        <div
                          key={contact.id}
                          className="rounded-md px-2 py-1 text-sm flex items-center gap-1"
                          style={{ backgroundColor: bgColor, color: textColor }}
                          title={contact.role || ""}
                        >
                          {contact.firstName} {contact.lastName}
                          <button
                            type="button"
                            onClick={() => toggleMember(contact.id)}
                            className="hover:text-gray-700 transition-colors"
                            style={{ color: textColor }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )
                    })
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="border rounded-md max-h-[250px] overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-start space-x-3 p-3 border-b last:border-b-0 hover:bg-muted/50"
                  >
                    <Checkbox
                      id={`contact-${contact.id}`}
                      checked={selectedMembers.includes(contact.id)}
                      onCheckedChange={() => toggleMember(contact.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor={`contact-${contact.id}`}
                          className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1"
                        >
                          <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          {contact.firstName} {contact.lastName}
                        </label>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-primary flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          {contact.role || "No role assigned"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredContacts.length === 0 && (
                  <div className="p-3 text-center text-muted-foreground">No contacts found</div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {team ? "Save Changes" : "Add Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
