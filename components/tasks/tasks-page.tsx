"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ChevronDown } from "lucide-react"

import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TaskDialog from "@/components/tasks/task-dialog"

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
    order: string[]
  }
  dueDate: string
  dueDateTime?: string
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
}

interface Group {
  id: number
  name: string
  description: string
  memberCount: number
  type: string
  members: number[]
}

interface Team {
  id: number
  name: string
  description: string
  memberCount: number
  type: string
  members: number[]
}

export function TasksPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [priorities, setPriorities] = useState<Priority[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [sortColumn, setSortColumn] = useState<string | null>("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load priorities
    const savedPriorities = localStorage.getItem("priorities")
    if (savedPriorities) {
      setPriorities(JSON.parse(savedPriorities))
    } else {
      const samplePriorities = [
        { id: "1", name: "High", color: "red" },
        { id: "2", name: "Medium", color: "yellow" },
        { id: "3", name: "Low", color: "green" },
      ]
      setPriorities(samplePriorities)
      localStorage.setItem("priorities", JSON.stringify(samplePriorities))
    }

    // Load categories
    const savedCategories = localStorage.getItem("categories")
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      const sampleCategories = [
        { id: "1", name: "Development", description: "Software development tasks" },
        { id: "2", name: "Design", description: "UI/UX design tasks" },
        { id: "3", name: "Marketing", description: "Marketing and promotion tasks" },
        { id: "4", name: "Finance", description: "Financial and accounting tasks" },
        { id: "5", name: "Work", description: "General work tasks" },
      ]
      setCategories(sampleCategories)
      localStorage.setItem("categories", JSON.stringify(sampleCategories))
    }

    // Load contacts
    const savedContacts = localStorage.getItem("contacts")
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts))
    } else {
      const sampleContacts = [
        { id: "1", name: "John Doe", email: "john@example.com", phone: "123-456-7890", role: "Developer" },
        { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "123-456-7891", role: "Designer" },
        { id: "3", name: "Bob Johnson", email: "bob@example.com", phone: "123-456-7892", role: "Manager" },
        { id: "4", name: "Alice Brown", email: "alice@example.com", phone: "123-456-7893", role: "Analyst" },
        { id: "5", name: "Charlie Wilson", email: "charlie@example.com", phone: "123-456-7894", role: "Director" },
      ]
      setContacts(sampleContacts)
      localStorage.setItem("contacts", JSON.stringify(sampleContacts))
    }

    // Load groups
    const savedGroups = localStorage.getItem("groups")
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups))
    } else {
      const sampleGroups = [
        {
          id: 1,
          name: "Marketing Team",
          description: "Marketing department team members",
          memberCount: 8,
          type: "Department",
          members: [1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
          id: 2,
          name: "Development Team",
          description: "Software development team",
          memberCount: 12,
          type: "Department",
          members: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        {
          id: 3,
          name: "Design Team",
          description: "UI/UX design team",
          memberCount: 6,
          type: "Department",
          members: [3, 4, 5, 6, 7, 8],
        },
        {
          id: 4,
          name: "Project Alpha",
          description: "Website redesign project team",
          memberCount: 5,
          type: "Project",
          members: [1, 3, 5, 7, 9],
        },
        {
          id: 5,
          name: "Project Beta",
          description: "Mobile app development team",
          memberCount: 7,
          type: "Project",
          members: [2, 4, 6, 8, 10, 12, 14],
        },
      ]
      setGroups(sampleGroups)
      localStorage.setItem("groups", JSON.stringify(sampleGroups))
    }

    // Load teams
    const savedTeams = localStorage.getItem("teams")
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams))
    } else {
      const sampleTeams = [
        {
          id: 1,
          name: "Frontend Team",
          description: "Responsible for UI/UX implementation",
          memberCount: 6,
          type: "Development",
          members: [1, 3, 5, 9, 12, 14],
        },
        {
          id: 2,
          name: "Backend Team",
          description: "API and database development",
          memberCount: 5,
          type: "Development",
          members: [2, 4, 10, 11, 13],
        },
        {
          id: 3,
          name: "QA Team",
          description: "Quality assurance and testing",
          memberCount: 4,
          type: "Quality",
          members: [6, 7, 8, 15],
        },
        {
          id: 4,
          name: "Leadership Team",
          description: "Project management and leadership",
          memberCount: 3,
          type: "Management",
          members: [1, 2, 15],
        },
        {
          id: 5,
          name: "DevOps Team",
          description: "Infrastructure and deployment",
          memberCount: 2,
          type: "Operations",
          members: [13, 14],
        },
      ]
      setTeams(sampleTeams)
      localStorage.setItem("teams", JSON.stringify(sampleTeams))
    }

    // Load tasks
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks)
      setTasks(parsedTasks)
      setFilteredTasks(parsedTasks)
      updateTotalPages(parsedTasks.length, rowsPerPage)
    } else {
      // Sample Tasks Data
      const sampleTasks = [
        {
          id: "1",
          title: "Client meeting preparation",
          description: "Prepare presentation and materials for client meeting",
          status: "Not Started",
          priority: "2", // Medium
          category: "1", // Development
          assignees: {
            contacts: ["5"], // Charlie Wilson
            groups: [],
            teams: [],
          },
          occurrence: "once",
          firstCommunicationIsApp: true,
          communicationPriority: {
            type: "manual",
            order: ["email", "whatsapp", "voice"],
          },
          dueDate: "2025-04-27",
          dueDateTime: "09:00", // Add time
          createdAt: "2025-04-20",
          updatedAt: "2025-04-20",
        },
        {
          id: "2",
          title: "Complete project proposal",
          description: "Draft and finalize the project proposal for client review",
          status: "In Progress",
          priority: "2", // Medium
          category: "1", // Development
          assignees: {
            contacts: ["1"], // John Doe
            groups: [],
            teams: [],
          },
          occurrence: "once",
          firstCommunicationIsApp: true,
          communicationPriority: {
            type: "manual",
            order: ["email", "whatsapp", "voice"],
          },
          dueDate: "2025-04-24",
          dueDateTime: "14:30", // Add time
          createdAt: "2025-04-18",
          updatedAt: "2025-04-19",
        },
        {
          id: "3",
          title: "Prepare quarterly report",
          description: "Compile data and prepare the quarterly financial report",
          status: "In Progress",
          priority: "1", // High
          category: "4", // Finance
          assignees: {
            contacts: ["4"], // Alice Brown
            groups: [],
            teams: [],
          },
          occurrence: "quarterly",
          firstCommunicationIsApp: true,
          communicationPriority: {
            type: "manual",
            order: ["email", "whatsapp", "voice"],
          },
          dueDate: "2025-05-04",
          dueDateTime: "16:00", // Add time
          createdAt: "2025-04-15",
          updatedAt: "2025-04-18",
        },
        {
          id: "4",
          title: "Review marketing materials",
          description: "Review and approve the new marketing materials",
          status: "Not Started",
          priority: "1", // High
          category: "3", // Marketing
          assignees: {
            contacts: ["2"], // Jane Smith
            groups: [],
            teams: [],
          },
          occurrence: "once",
          firstCommunicationIsApp: false,
          communicationPriority: {
            type: "ai",
            order: ["whatsapp", "email", "voice"],
          },
          dueDate: "2025-04-29",
          dueDateTime: "11:15", // Add time
          createdAt: "2025-04-22",
          updatedAt: "2025-04-22",
        },
        {
          id: "5",
          title: "Update website content",
          description: "Update the website with new product information",
          status: "Completed",
          priority: "3", // Low
          category: "3", // Marketing
          assignees: {
            contacts: ["3"], // Bob Johnson
            groups: [],
            teams: [],
          },
          occurrence: "once",
          firstCommunicationIsApp: true,
          communicationPriority: {
            type: "manual",
            order: ["email", "whatsapp", "voice"],
          },
          dueDate: "2025-04-19",
          dueDateTime: "10:00", // Add time
          createdAt: "2025-04-10",
          updatedAt: "2025-04-19",
        },
        {
          id: "6",
          title: "check data",
          description: "check demo",
          status: "Not Started",
          priority: "1", // High
          category: "2", // Design
          assignees: {
            contacts: ["2", "1", "3", "4"], // Multiple contacts
            groups: [],
            teams: ["1", "2"], // Frontend Team, Backend Team
          },
          occurrence: "once",
          firstCommunicationIsApp: true,
          communicationPriority: {
            type: "manual",
            order: ["email", "whatsapp", "voice"],
          },
          dueDate: "2025-04-29",
          dueDateTime: "15:45", // Add time
          createdAt: "2025-04-22",
          updatedAt: "2025-04-22",
        },
      ]
      setTasks(sampleTasks)
      setFilteredTasks(sampleTasks)
      updateTotalPages(sampleTasks.length, rowsPerPage)

      // Save to localStorage
      localStorage.setItem("tasks", JSON.stringify(sampleTasks))
    }
  }, [router, rowsPerPage])

  useEffect(() => {
    if (searchTerm) {
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredTasks(filtered)
      setCurrentPage(1)
      updateTotalPages(filtered.length, rowsPerPage)
    } else {
      setFilteredTasks(tasks)
      updateTotalPages(tasks.length, rowsPerPage)
    }
  }, [searchTerm, tasks, rowsPerPage])

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
    updateTotalPages(filteredTasks.length, newRowsPerPage)
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleDeleteTask = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updatedTasks = tasks.filter((task) => task.id !== id)
      setTasks(updatedTasks)
      localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    }
  }

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map((t) => (t.id === editingTask.id ? { ...task, id: editingTask.id } : t))
      setTasks(updatedTasks)
      localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    } else {
      // Add new task
      const newId = (Math.max(...tasks.map((t) => Number.parseInt(t.id))) + 1).toString()
      const newTask = { ...task, id: newId, createdAt: new Date().toISOString().split("T")[0] }
      const updatedTasks = [...tasks, newTask]
      setTasks(updatedTasks)
      localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    }
    setDialogOpen(false)
  }

  // Get priority name and color
  const getPriorityInfo = (id: string) => {
    const priority = priorities.find((p) => p.id === id)
    return priority || { name: "Unknown", color: "gray" }
  }

  // Get category name
  const getCategoryName = (id: string) => {
    const category = categories.find((c) => c.id === id)
    return category?.name || "Unknown"
  }

  // Get assignee names
  const getAssigneeNames = (task: Task) => {
    const assigneeNames: string[] = []

    // Add contact names
    task.assignees.contacts.forEach((id) => {
      const contact = contacts.find((c) => c.id === id)
      if (contact) assigneeNames.push(contact.name)
    })

    // Add group names
    task.assignees.groups.forEach((id) => {
      const group = groups.find((g) => g.id.toString() === id)
      if (group) assigneeNames.push(group.name)
    })

    // Add team names
    task.assignees.teams.forEach((id) => {
      const team = teams.find((t) => t.id.toString() === id)
      if (team) assigneeNames.push(team.name)
    })

    return assigneeNames.length > 0 ? assigneeNames.join(", ") : "None"
  }

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortColumn) return 0

    let valueA, valueB

    switch (sortColumn) {
      case "title":
        valueA = a.title
        valueB = b.title
        break
      case "status":
        valueA = a.status
        valueB = b.status
        break
      case "priority":
        valueA = getPriorityInfo(a.priority).name
        valueB = getPriorityInfo(b.priority).name
        break
      case "category":
        valueA = getCategoryName(a.category)
        valueB = getCategoryName(b.category)
        break
      case "dueDate":
        valueA = a.dueDate
        valueB = b.dueDate
        break
      default:
        return 0
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedTasks = sortedTasks.slice(startIndex, endIndex)

  // Get status badge style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Not Started":
        return "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium"
      case "Completed":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium"
    }
  }

  // Get priority badge style
  const getPriorityStyle = (priorityId: string) => {
    const priority = getPriorityInfo(priorityId)
    switch (priority.color) {
      case "red":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium"
      case "yellow":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium"
      case "green":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium"
    }
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <Button onClick={handleAddTask} className="bg-blue-600 hover:bg-blue-700">
            <span className="mr-1">+</span> Add Task
          </Button>
        </div>

        <div className="mb-6 relative">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 border-gray-300"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      Title
                      {sortColumn === "title" && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortColumn === "status" && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort("priority")}
                  >
                    <div className="flex items-center">
                      Priority
                      {sortColumn === "priority" && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      {sortColumn === "category" && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Assignee</th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort("dueDate")}
                  >
                    <div className="flex items-center">
                      Due Date
                      {sortColumn === "dueDate" && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedTasks.length > 0 ? (
                  displayedTasks.map((task) => (
                    <tr key={task.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{task.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {task.description.length > 30 ? `${task.description.substring(0, 30)}...` : task.description}
                      </td>
                      <td className="px-4 py-3">
                        <span className={getStatusStyle(task.status)}>{task.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={getPriorityStyle(task.priority)}>{getPriorityInfo(task.priority).name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{getCategoryName(task.category)}</td>
                      <td className="px-4 py-3 text-sm">{getAssigneeNames(task)}</td>
                      <td className="px-4 py-3 text-sm">
                        {task.dueDate ? (
                          <span>
                            {format(new Date(task.dueDate), "MMM d, yyyy")}
                            {task.dueDateTime && ` at ${task.dueDateTime}`}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="text-blue-600 hover:text-blue-800"
                            aria-label="Edit task"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-blue-600 hover:text-blue-800"
                            aria-label="Delete task"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 flex-wrap mt-4">
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
              <option value={50}>50</option>
            </select>
          </div>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
            >
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

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
        priorities={priorities}
        categories={categories}
        contacts={contacts}
        groups={groups}
        teams={teams}
      />
    </AppLayout>
  )
}
