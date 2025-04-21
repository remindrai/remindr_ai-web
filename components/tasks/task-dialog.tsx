"use client"

import { Switch } from "@/components/ui/switch"
import { useState, useEffect, useRef } from "react"
import {
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  User,
  Users,
  UserPlus,
  Check,
  MessageSquare,
  Bell,
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LanguageSelector } from "@/components/language/language-selector"
import { TranslatableField } from "@/components/language/translatable-field"

interface Task {
  id: string
  title: string
  description: string
  status: "Not Started" | "In Progress" | "Completed"
  priority: string
  category: string
  assignees: {
    contacts: string[]
    groups: string[]
    teams: string[]
  }
  occurrence: string
  firstCommunicationIsApp: boolean
  communicationPriority: {
    type: "manual" | "ai"
    order: string[] // ["email", "whatsapp", "voice"]
  }
  dueDate: string
  dueDateTime?: string // Add this new property
  createdAt: string
  updatedAt: string
}

interface Priority {
  id: string
  name: string
  color: string
}

interface Category {
  id: string
  name: string
  description: string
}

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  role: string
  avatar?: string
}

interface Group {
  id: number
  name: string
  description: string
  memberCount: number
  type: string
  members: number[]
  icon?: string
}

interface Team {
  id: number
  name: string
  description: string
  memberCount: number
  type: string
  members: number[]
  icon?: string
}

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  onSave: (task: Task) => void
  priorities: Priority[]
  categories: Category[]
  contacts: Contact[]
  groups: Group[]
  teams: Team[]
}

const OCCURRENCE_OPTIONS = [
  { value: "once", label: "Once" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "twice-weekly", label: "Twice a week" },
  { value: "monthly", label: "Monthly" },
]

const COMMUNICATION_METHODS = [
  { id: "email", label: "Email" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "voice", label: "AI Voice" },
]

// Sample data for the enhanced assignee section
const SAMPLE_CONTACTS: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    role: "Marketing Director",
    avatar: "/green-tractor-field.png",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    role: "Content Strategist",
    avatar: "/javascript-code-abstract.png",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+1 (555) 456-7890",
    role: "SEO Specialist",
    avatar: "/musical-notes-flowing.png",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+1 (555) 234-5678",
    role: "Social Media Manager",
    avatar: "/abstract-southwest.png",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "+1 (555) 876-5432",
    role: "Graphic Designer",
    avatar: "/database-structure.png",
  },
]

const SAMPLE_GROUPS: Group[] = [
  {
    id: 1,
    name: "Marketing Team",
    description: "Marketing department team members",
    memberCount: 8,
    type: "Department",
    members: [1, 2, 3, 4, 5],
    icon: "📊",
  },
  {
    id: 2,
    name: "Development Team",
    description: "Software development team",
    memberCount: 12,
    type: "Department",
    members: [1, 2, 3],
    icon: "💻",
  },
  {
    id: 3,
    name: "Design Team",
    description: "UI/UX design team",
    memberCount: 6,
    type: "Department",
    members: [3, 4, 5],
    icon: "🎨",
  },
]

const SAMPLE_TEAMS: Team[] = [
  {
    id: 1,
    name: "Frontend Team",
    description: "Responsible for UI/UX implementation",
    memberCount: 6,
    type: "Development",
    members: [1, 3, 5],
    icon: "🖥️",
  },
  {
    id: 2,
    name: "Backend Team",
    description: "API and database development",
    memberCount: 5,
    type: "Development",
    members: [2, 4],
    icon: "⚙️",
  },
  {
    id: 3,
    name: "QA Team",
    description: "Quality assurance and testing",
    memberCount: 4,
    type: "Quality",
    members: [1, 2, 3, 4],
    icon: "🔍",
  },
]

function TaskDialog({
  open,
  onOpenChange,
  task,
  onSave,
  priorities,
  categories,
  contacts = SAMPLE_CONTACTS,
  groups = SAMPLE_GROUPS,
  teams = SAMPLE_TEAMS,
}: TaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"Not Started" | "In Progress" | "Completed">("Not Started")
  const [priority, setPriority] = useState("")
  const [category, setCategory] = useState("")
  const [assigneeTab, setAssigneeTab] = useState("contacts")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [occurrence, setOccurrence] = useState("once")
  const [firstCommunicationIsApp, setFirstCommunicationIsApp] = useState(true)
  const [communicationType, setCommunicationType] = useState<"manual" | "ai">("manual")
  const [communicationOrder, setCommunicationOrder] = useState<string[]>(["email", "whatsapp", "voice"])
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [dueTime, setDueTime] = useState<string>("12:00")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("details")

  // For search functionality
  const [contactSearchTerm, setContactSearchTerm] = useState("")
  const [groupSearchTerm, setGroupSearchTerm] = useState("")
  const [teamSearchTerm, setTeamSearchTerm] = useState("")

  // For quick access
  const [recentAssignees, setRecentAssignees] = useState<{
    contacts: Contact[]
    groups: Group[]
    teams: Team[]
  }>({
    contacts: SAMPLE_CONTACTS.slice(0, 3),
    groups: SAMPLE_GROUPS.slice(0, 2),
    teams: SAMPLE_TEAMS.slice(0, 2),
  })

  // For dropdowns
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setStatus(task.status)
      setPriority(task.priority)
      setCategory(task.category)
      setSelectedContacts(task.assignees.contacts)
      setSelectedGroups(task.assignees.groups)
      setSelectedTeams(task.assignees.teams)
      setOccurrence(task.occurrence)
      setFirstCommunicationIsApp(task.firstCommunicationIsApp)
      setCommunicationType(task.communicationPriority.type)
      setCommunicationOrder(task.communicationPriority.order)
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
      setDueTime(task.dueDateTime || "12:00") // Set default time or use existing
    } else {
      setTitle("")
      setDescription("")
      setStatus("Not Started")
      setPriority(priorities.length > 0 ? priorities[0].id : "")
      setCategory(categories.length > 0 ? categories[0].id : "")
      setSelectedContacts([])
      setSelectedGroups([])
      setSelectedTeams([])
      setOccurrence("once")
      setFirstCommunicationIsApp(true)
      setCommunicationType("manual")
      setCommunicationOrder(["email", "whatsapp", "voice"])
      setDueDate(undefined)
      setDueTime("12:00") // Default time
    }
    setErrors({})
    setActiveTab("details") // Reset to details tab when opening dialog
  }, [task, open, priorities, categories])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (assigneeDropdownOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [assigneeDropdownOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!priority) {
      newErrors.priority = "Priority is required"
    }

    if (!category) {
      newErrors.category = "Category is required"
    }

    if (selectedContacts.length === 0 && selectedGroups.length === 0 && selectedTeams.length === 0) {
      newErrors.assignees = "At least one assignee is required"
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const updatedTask: Task = {
      id: task?.id || "",
      title,
      description,
      status,
      priority,
      category,
      assignees: {
        contacts: selectedContacts,
        groups: selectedGroups,
        teams: selectedTeams,
      },
      occurrence,
      firstCommunicationIsApp,
      communicationPriority: {
        type: communicationType,
        order: communicationOrder,
      },
      dueDate: dueDate ? dueDate.toISOString().split("T")[0] : "",
      dueDateTime: dueTime, // Add the time
      createdAt: task?.createdAt || "",
      updatedAt: new Date().toISOString().split("T")[0],
    }

    onSave(updatedTask)
  }

  // Helper to get name by ID
  const getContactName = (id: string) => contacts.find((c) => c.id === id)?.name || id
  const getGroupName = (id: string) => groups.find((g) => g.id.toString() === id)?.name || id
  const getTeamName = (id: string) => teams.find((t) => t.id.toString() === id)?.name || id

  // Move communication method up or down
  const moveMethod = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === communicationOrder.length - 1)) {
      return
    }

    const newOrder = [...communicationOrder]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const temp = newOrder[index]
    newOrder[index] = newOrder[newIndex]
    newOrder[newIndex] = temp
    setCommunicationOrder(newOrder)
  }

  const handleLanguagesChange = (languages: string[]) => {
    setSelectedLanguages(languages)

    // Force translate existing content for newly added languages
    if (title.trim()) {
      const titleField = document.getElementById("title")
      if (titleField) {
        const translateButton = titleField.closest(".translatable-field")?.querySelector("button")
        if (translateButton) translateButton.click()
      }
    }

    if (description.trim()) {
      const descriptionField = document.getElementById("description")
      if (descriptionField) {
        const translateButton = descriptionField.closest(".translatable-field")?.querySelector("button")
        if (translateButton) translateButton.click()
      }
    }
  }

  // Handle description generation from title
  const handleGenerateDescription = (generatedDescription: string) => {
    setDescription(generatedDescription)
  }

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(
    (contact) =>
      (contact.name?.toLowerCase() || "").includes(contactSearchTerm.toLowerCase()) ||
      (contact.email?.toLowerCase() || "").includes(contactSearchTerm.toLowerCase()) ||
      (contact.role?.toLowerCase() || "").includes(contactSearchTerm.toLowerCase()),
  )

  // Filter groups based on search term
  const filteredGroups = groups.filter(
    (group) =>
      (group.name?.toLowerCase() || "").includes(groupSearchTerm.toLowerCase()) ||
      (group.description?.toLowerCase() || "").includes(groupSearchTerm.toLowerCase()) ||
      (group.type?.toLowerCase() || "").includes(groupSearchTerm.toLowerCase()),
  )

  // Filter teams based on search term
  const filteredTeams = teams.filter(
    (team) =>
      (team.name?.toLowerCase() || "").includes(teamSearchTerm.toLowerCase()) ||
      (team.description?.toLowerCase() || "").includes(teamSearchTerm.toLowerCase()) ||
      (team.type?.toLowerCase() || "").includes(teamSearchTerm.toLowerCase()),
  )

  // Toggle selection of a contact
  const toggleContact = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter((contactId) => contactId !== id))
    } else {
      setSelectedContacts([...selectedContacts, id])
    }
  }

  // Toggle selection of a group
  const toggleGroup = (id: string) => {
    if (selectedGroups.includes(id)) {
      setSelectedGroups(selectedGroups.filter((groupId) => groupId !== id))
    } else {
      setSelectedGroups([...selectedGroups, id])
    }
  }

  // Toggle selection of a team
  const toggleTeam = (id: string) => {
    if (selectedTeams.includes(id)) {
      setSelectedTeams(selectedTeams.filter((teamId) => teamId !== id))
    } else {
      setSelectedTeams([...selectedTeams, id])
    }
  }

  // Get total assignee count
  const totalAssigneeCount = selectedContacts.length + selectedGroups.length + selectedTeams.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 flex flex-row justify-between items-start">
          <div>
            <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {task ? "Update task details with the form below" : "Create a new task with the form below"}
            </p>
          </div>
          <LanguageSelector selectedLanguages={selectedLanguages} onLanguagesChange={handleLanguagesChange} />
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-6">
            <TabsList className="h-12">
              <TabsTrigger value="details" className="flex items-center py-1">
                <span>Details</span>
              </TabsTrigger>
              <TabsTrigger value="communications" className="flex items-center py-1">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>Communications</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="followups" className="flex items-center py-1">
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-1" />
                  <span>Follow-ups</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <TabsContent value="details" className="m-0 space-y-4">
              {/* Title */}
              <TranslatableField
                id="title"
                label="Title"
                value={title}
                onChange={setTitle}
                placeholder="Enter task title"
                selectedLanguages={selectedLanguages}
                className="translatable-field"
                isTitle={true}
                onGenerateDescription={handleGenerateDescription}
              />
              {errors.title && <p className="text-sm text-red-500 -mt-3">{errors.title}</p>}

              {/* Description */}
              <TranslatableField
                id="description"
                label="Description"
                value={description}
                onChange={setDescription}
                placeholder="Enter task description"
                multiline
                rows={4}
                selectedLanguages={selectedLanguages}
                className="translatable-field"
              />

              {/* Status */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priority && <p className="col-start-2 text-sm text-red-500">{errors.priority}</p>}
              </div>

              {/* Category */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="col-start-2 text-sm text-red-500">{errors.category}</p>}
              </div>

              {/* Assignee - Enhanced Version */}
              <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                <Label className="pt-2">Assignee</Label>
                <div className="space-y-3">
                  {/* Assignee Selection UI */}
                  <Popover open={assigneeDropdownOpen} onOpenChange={setAssigneeDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between h-auto py-2 px-3">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center">
                            {totalAssigneeCount > 0 ? (
                              <span className="font-medium">
                                {totalAssigneeCount} assignee{totalAssigneeCount !== 1 ? "s" : ""} selected
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Select assignees</span>
                            )}
                          </div>
                          {totalAssigneeCount > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedContacts.length > 0 && (
                                <Badge variant="outline" className="bg-blue-50">
                                  {selectedContacts.length} contact{selectedContacts.length !== 1 ? "s" : ""}
                                </Badge>
                              )}
                              {selectedGroups.length > 0 && (
                                <Badge variant="outline" className="bg-green-50">
                                  {selectedGroups.length} group{selectedGroups.length !== 1 ? "s" : ""}
                                </Badge>
                              )}
                              {selectedTeams.length > 0 && (
                                <Badge variant="outline" className="bg-purple-50">
                                  {selectedTeams.length} team{selectedTeams.length !== 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px] p-0" align="start">
                      <Tabs defaultValue="contacts" value={assigneeTab} onValueChange={setAssigneeTab}>
                        <div className="border-b px-3 pt-2">
                          <TabsList className="h-14">
                            <TabsTrigger
                              value="contacts"
                              className="flex flex-col items-center justify-center data-[state=active]:bg-blue-50 h-full"
                            >
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                <span>Contacts</span>
                              </div>
                              {selectedContacts.length > 0 && (
                                <Badge className="mt-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-500">
                                  {selectedContacts.length}
                                </Badge>
                              )}
                            </TabsTrigger>
                            <TabsTrigger
                              value="groups"
                              className="flex flex-col items-center justify-center data-[state=active]:bg-green-50 h-full"
                            >
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                <span>Groups</span>
                              </div>
                              {selectedGroups.length > 0 && (
                                <Badge className="mt-1 h-5 w-5 flex items-center justify-center p-0 bg-green-500">
                                  {selectedGroups.length}
                                </Badge>
                              )}
                            </TabsTrigger>
                            <TabsTrigger
                              value="teams"
                              className="flex flex-col items-center justify-center data-[state=active]:bg-purple-50 h-full"
                            >
                              <div className="flex items-center">
                                <UserPlus className="h-4 w-4 mr-1" />
                                <span>Teams</span>
                              </div>
                              {selectedTeams.length > 0 && (
                                <Badge className="mt-1 h-5 w-5 flex items-center justify-center p-0 bg-purple-500">
                                  {selectedTeams.length}
                                </Badge>
                              )}
                            </TabsTrigger>
                          </TabsList>
                        </div>

                        <div className="p-3">
                          <TabsContent value="contacts" className="m-0">
                            <div className="relative mb-3">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                ref={searchInputRef}
                                placeholder="Search contacts..."
                                className="pl-8"
                                value={contactSearchTerm}
                                onChange={(e) => setContactSearchTerm(e.target.value)}
                              />
                            </div>

                            {contactSearchTerm === "" && recentAssignees.contacts.length > 0 && (
                              <div className="mb-3">
                                <h4 className="text-sm font-medium mb-2">Recent Contacts</h4>
                                <div className="space-y-1">
                                  {recentAssignees.contacts.map((contact) => (
                                    <div
                                      key={contact.id}
                                      className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                                        selectedContacts.includes(contact.id) ? "bg-blue-100" : "hover:bg-muted"
                                      }`}
                                      onClick={() => toggleContact(contact.id)}
                                    >
                                      <Avatar className="h-8 w-8 mr-2">
                                        <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                                        <AvatarFallback>
                                          {contact.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{contact.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{contact.role}</p>
                                      </div>
                                      {selectedContacts.includes(contact.id) && (
                                        <Check className="h-4 w-4 text-blue-600" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <ScrollArea className="h-[200px] pr-3">
                              <div className="space-y-1">
                                {filteredContacts.length > 0 ? (
                                  filteredContacts.map((contact) => (
                                    <div
                                      key={contact.id}
                                      className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                                        selectedContacts.includes(contact.id) ? "bg-blue-100" : "hover:bg-muted"
                                      }`}
                                      onClick={() => toggleContact(contact.id)}
                                    >
                                      <Avatar className="h-8 w-8 mr-2">
                                        <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                                        <AvatarFallback>
                                          {contact.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{contact.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                                      </div>
                                      {selectedContacts.includes(contact.id) && (
                                        <Check className="h-4 w-4 text-blue-600" />
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="py-6 text-center text-muted-foreground">No contacts found</div>
                                )}
                              </div>
                            </ScrollArea>
                          </TabsContent>

                          <TabsContent value="groups" className="m-0">
                            <div className="relative mb-3">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search groups..."
                                className="pl-8"
                                value={groupSearchTerm}
                                onChange={(e) => setGroupSearchTerm(e.target.value)}
                              />
                            </div>

                            {groupSearchTerm === "" && recentAssignees.groups.length > 0 && (
                              <div className="mb-3">
                                <h4 className="text-sm font-medium mb-2">Recent Groups</h4>
                                <div className="space-y-1">
                                  {recentAssignees.groups.map((group) => (
                                    <div
                                      key={group.id}
                                      className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                                        selectedGroups.includes(group.id.toString()) ? "bg-green-100" : "hover:bg-muted"
                                      }`}
                                      onClick={() => toggleGroup(group.id.toString())}
                                    >
                                      <div className="h-8 w-8 mr-2 flex items-center justify-center bg-green-100 rounded-md text-lg">
                                        {group.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{group.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {group.type} • {group.memberCount} members
                                        </p>
                                      </div>
                                      {selectedGroups.includes(group.id.toString()) && (
                                        <Check className="h-4 w-4 text-green-600" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <ScrollArea className="h-[200px] pr-3">
                              <div className="space-y-1">
                                {filteredGroups.length > 0 ? (
                                  filteredGroups.map((group) => (
                                    <div
                                      key={group.id}
                                      className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                                        selectedGroups.includes(group.id.toString()) ? "bg-green-100" : "hover:bg-muted"
                                      }`}
                                      onClick={() => toggleGroup(group.id.toString())}
                                    >
                                      <div className="h-8 w-8 mr-2 flex items-center justify-center bg-green-100 rounded-md text-lg">
                                        {group.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{group.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {group.type} • {group.memberCount} members
                                        </p>
                                      </div>
                                      {selectedGroups.includes(group.id.toString()) && (
                                        <Check className="h-4 w-4 text-green-600" />
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="py-6 text-center text-muted-foreground">No groups found</div>
                                )}
                              </div>
                            </ScrollArea>
                          </TabsContent>

                          <TabsContent value="teams" className="m-0">
                            <div className="relative mb-3">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search teams..."
                                className="pl-8"
                                value={teamSearchTerm}
                                onChange={(e) => setTeamSearchTerm(e.target.value)}
                              />
                            </div>

                            {/* Recent Teams Section */}
                            {teamSearchTerm === "" && recentAssignees.teams.length > 0 && (
                              <div className="mb-3">
                                <h4 className="text-sm font-medium mb-2">Recent Teams</h4>
                                <div className="space-y-1">
                                  {recentAssignees.teams.map((team) => (
                                    <div
                                      key={team.id}
                                      className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                                        selectedTeams.includes(team.id.toString()) ? "bg-purple-100" : "hover:bg-muted"
                                      }`}
                                      onClick={() => toggleTeam(team.id.toString())}
                                    >
                                      <div className="h-8 w-8 mr-2 flex items-center justify-center bg-purple-100 rounded-md text-lg">
                                        {team.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{team.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {team.type} • {team.memberCount} members
                                        </p>
                                      </div>
                                      {selectedTeams.includes(team.id.toString()) && (
                                        <Check className="h-4 w-4 text-purple-600" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Teams List */}
                            <ScrollArea className="h-[200px] pr-3">
                              <div className="space-y-1">
                                {filteredTeams.length > 0 ? (
                                  filteredTeams.map((team) => (
                                    <div
                                      key={team.id}
                                      className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                                        selectedTeams.includes(team.id.toString()) ? "bg-purple-100" : "hover:bg-muted"
                                      }`}
                                      onClick={() => toggleTeam(team.id.toString())}
                                    >
                                      <div className="h-8 w-8 mr-2 flex items-center justify-center bg-purple-100 rounded-md text-lg">
                                        {team.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{team.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {team.type} • {team.memberCount} members
                                        </p>
                                      </div>
                                      {selectedTeams.includes(team.id.toString()) && (
                                        <Check className="h-4 w-4 text-purple-600" />
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="py-6 text-center text-muted-foreground">No teams found</div>
                                )}
                              </div>
                            </ScrollArea>
                          </TabsContent>
                        </div>

                        <div className="flex items-center justify-between p-3 border-t">
                          <div className="text-sm text-muted-foreground">{totalAssigneeCount} selected</div>
                          <Button size="sm" variant="primary" onClick={() => setAssigneeDropdownOpen(false)}>
                            Done
                          </Button>
                        </div>
                      </Tabs>
                    </PopoverContent>
                  </Popover>

                  {/* Selected Assignees Preview */}
                  {totalAssigneeCount > 0 && (
                    <div className="mt-2 max-w-full overflow-hidden">
                      {selectedContacts.length > 0 && (
                        <div className="mb-2">
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Contacts</h4>
                          <div className="flex flex-wrap gap-1 max-w-full">
                            {selectedContacts.map((id) => {
                              const contact = contacts.find((c) => c.id === id)
                              return (
                                <Badge key={id} variant="secondary" className="flex items-center gap-1 bg-blue-50">
                                  {contact?.name || id}
                                  <button
                                    onClick={() => setSelectedContacts((prev) => prev.filter((item) => item !== id))}
                                    className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {selectedGroups.length > 0 && (
                        <div className="mb-2">
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Groups</h4>
                          <div className="flex flex-wrap gap-1 max-w-full">
                            {selectedGroups.map((id) => {
                              const group = groups.find((g) => g.id.toString() === id)
                              return (
                                <Badge key={id} variant="secondary" className="flex items-center gap-1 bg-green-50">
                                  {group?.name || id}
                                  <button
                                    onClick={() => setSelectedGroups((prev) => prev.filter((item) => item !== id))}
                                    className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {selectedTeams.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Teams</h4>
                          <div className="flex flex-wrap gap-1 max-w-full">
                            {selectedTeams.map((id) => {
                              const team = teams.find((t) => t.id.toString() === id)
                              return (
                                <Badge key={id} variant="secondary" className="flex items-center gap-1 bg-purple-50">
                                  {team?.name || id}
                                  <button
                                    onClick={() => setSelectedTeams((prev) => prev.filter((item) => item !== id))}
                                    className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {errors.assignees && <p className="text-sm text-red-500 mt-1">{errors.assignees}</p>}
                </div>
              </div>

              {/* Due Date */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <Label htmlFor="dueDate">Due Date</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`flex-1 justify-start text-left font-normal ${!dueDate ? "text-muted-foreground" : ""}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                    </PopoverContent>
                  </Popover>

                  <Input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-[120px]"
                    aria-label="Due time"
                  />
                </div>
                {errors.dueDate && <p className="col-start-2 text-sm text-red-500">{errors.dueDate}</p>}
              </div>
            </TabsContent>

            <TabsContent value="communications" className="m-0 space-y-4">
              {/* Occurrence */}
              <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                <Label htmlFor="occurrence">Occurrence</Label>
                <Select value={occurrence} onValueChange={setOccurrence}>
                  <SelectTrigger id="occurrence">
                    <SelectValue placeholder="Select occurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    {OCCURRENCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* First Communication */}
              <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                <Label className="leading-tight">First Communication</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="first-communication"
                    checked={firstCommunicationIsApp}
                    onCheckedChange={(checked) => setFirstCommunicationIsApp(checked as boolean)}
                  />
                  <Label htmlFor="first-communication" className="font-normal">
                    First communication is app
                  </Label>
                </div>
              </div>

              {/* Communication Priority */}
              <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                <Label className="leading-tight pt-1">Communication Priority</Label>
                <div className="space-y-3">
                  <RadioGroup
                    value={communicationType}
                    onValueChange={(value) => setCommunicationType(value as "manual" | "ai")}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual" className="font-normal">
                        Manual priority (drag to reorder)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ai" id="ai" />
                      <Label htmlFor="ai" className="font-normal">
                        AI-determined priority
                      </Label>
                    </div>
                  </RadioGroup>

                  {communicationType === "manual" && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground mb-2">Drag to reorder communication methods:</p>
                      <div className="space-y-2 bg-muted p-3 rounded-md">
                        {communicationOrder.map((methodId, index) => {
                          const method = COMMUNICATION_METHODS.find((m) => m.id === methodId)
                          return (
                            <div
                              key={methodId}
                              className="flex items-center justify-between p-2 bg-background rounded-md"
                            >
                              <div className="flex items-center">
                                <span className="mr-2 font-medium">{index + 1}.</span>
                                <span>{method?.label}</span>
                              </div>
                              <div className="flex">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => moveMethod(index, "up")}
                                  disabled={index === 0}
                                  className="h-8 w-8"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => moveMethod(index, "down")}
                                  disabled={index === communicationOrder.length - 1}
                                  className="h-8 w-8"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="followups" className="m-0 space-y-4">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Follow-up Schedule</h3>
                  <p className="text-xs text-blue-700 mb-3">
                    Configure when to send follow-up communications if the recipient doesn't respond.
                  </p>

                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                      <Label className="text-xs text-blue-800">First follow-up</Label>
                      <Select defaultValue="3">
                        <SelectTrigger className="h-8 bg-white">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">After 1 day</SelectItem>
                          <SelectItem value="2">After 2 days</SelectItem>
                          <SelectItem value="3">After 3 days</SelectItem>
                          <SelectItem value="5">After 5 days</SelectItem>
                          <SelectItem value="7">After 7 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                      <Label className="text-xs text-blue-800">Second follow-up</Label>
                      <Select defaultValue="7">
                        <SelectTrigger className="h-8 bg-white">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">After 3 days</SelectItem>
                          <SelectItem value="5">After 5 days</SelectItem>
                          <SelectItem value="7">After 7 days</SelectItem>
                          <SelectItem value="10">After 10 days</SelectItem>
                          <SelectItem value="14">After 14 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                      <Label className="text-xs text-blue-800">Final follow-up</Label>
                      <Select defaultValue="14">
                        <SelectTrigger className="h-8 bg-white">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">After 7 days</SelectItem>
                          <SelectItem value="10">After 10 days</SelectItem>
                          <SelectItem value="14">After 14 days</SelectItem>
                          <SelectItem value="21">After 21 days</SelectItem>
                          <SelectItem value="30">After 30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Intelligent Timing</Label>
                  <Switch defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground -mt-2">
                  Automatically adjust follow-up timing based on recipient behavior and preferences
                </p>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Escalate Priority</Label>
                  <Switch defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground -mt-2">
                  Increase priority level for each subsequent follow-up
                </p>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Change Communication Channel</Label>
                  <Switch defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground -mt-2">
                  Try different communication channels for follow-ups
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {task ? "Update Task" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Export the component as default
export default TaskDialog
