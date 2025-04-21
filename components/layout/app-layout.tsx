"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  X,
  Filter,
  Calendar,
  User,
  Tag,
  SortAsc,
  SortDesc,
  Save,
  Clock,
  CheckCircle,
  Trash2,
  Settings,
} from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Footer } from "@/components/layout/footer"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Bell, HelpCircle, LogOut } from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
}

// Sample data for search results
const sampleData = {
  categories: [
    {
      id: 1,
      name: "Work",
      description: "Work-related tasks and projects",
      status: "active",
      createdAt: "2023-01-15",
      owner: "John Doe",
      tags: ["important", "business"],
    },
    {
      id: 2,
      name: "Personal",
      description: "Personal tasks and errands",
      status: "active",
      createdAt: "2023-02-20",
      owner: "Jane Smith",
      tags: ["personal", "home"],
    },
    {
      id: 3,
      name: "School",
      description: "All school configuration starts from here",
      status: "inactive",
      createdAt: "2023-03-10",
      owner: "Mike Johnson",
      tags: ["education", "important"],
    },
    {
      id: 4,
      name: "Health",
      description: "Health and fitness related tasks",
      status: "active",
      createdAt: "2023-04-05",
      owner: "Sarah Williams",
      tags: ["health", "fitness"],
    },
    {
      id: 5,
      name: "Finance",
      description: "Financial tasks and goals",
      status: "archived",
      createdAt: "2023-05-12",
      owner: "David Brown",
      tags: ["finance", "important"],
    },
  ],
  priorities: [
    {
      id: 1,
      name: "High",
      description: "Urgent tasks that need immediate attention",
      status: "active",
      createdAt: "2023-01-10",
      owner: "System",
      tags: ["system", "default"],
    },
    {
      id: 2,
      name: "Medium",
      description: "Important tasks with flexible deadlines",
      status: "active",
      createdAt: "2023-01-10",
      owner: "System",
      tags: ["system", "default"],
    },
    {
      id: 3,
      name: "Low",
      description: "Tasks that can be completed when time permits",
      status: "active",
      createdAt: "2023-01-10",
      owner: "System",
      tags: ["system", "default"],
    },
  ],
  contacts: [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Project Manager",
      status: "active",
      createdAt: "2023-02-15",
      owner: "Jane Smith",
      tags: ["management", "external"],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "UI/UX Designer",
      status: "active",
      createdAt: "2023-03-20",
      owner: "John Doe",
      tags: ["design", "internal"],
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      role: "Senior Developer",
      status: "inactive",
      createdAt: "2023-04-10",
      owner: "David Brown",
      tags: ["development", "internal"],
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      role: "Content Writer",
      status: "active",
      createdAt: "2023-05-05",
      owner: "Mike Johnson",
      tags: ["content", "external"],
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@example.com",
      role: "QA Engineer",
      status: "archived",
      createdAt: "2023-06-12",
      owner: "John Doe",
      tags: ["qa", "internal"],
    },
  ],
  groups: [
    {
      id: 1,
      name: "Marketing Team",
      description: "Marketing department team members",
      status: "active",
      createdAt: "2023-02-15",
      owner: "Jane Smith",
      tags: ["marketing", "team"],
    },
    {
      id: 2,
      name: "Development Team",
      description: "Software development team",
      status: "active",
      createdAt: "2023-03-20",
      owner: "Mike Johnson",
      tags: ["development", "team"],
    },
    {
      id: 3,
      name: "Design Team",
      description: "UI/UX design team",
      status: "inactive",
      createdAt: "2023-04-10",
      owner: "Jane Smith",
      tags: ["design", "team"],
    },
    {
      id: 4,
      name: "Sales Team",
      description: "Sales and business development",
      status: "active",
      createdAt: "2023-05-05",
      owner: "David Brown",
      tags: ["sales", "team"],
    },
  ],
  teams: [
    {
      id: 1,
      name: "Alpha Team",
      description: "Frontend development team",
      status: "active",
      createdAt: "2023-02-15",
      owner: "Mike Johnson",
      tags: ["frontend", "development"],
    },
    {
      id: 2,
      name: "Beta Team",
      description: "Backend development team",
      status: "active",
      createdAt: "2023-03-20",
      owner: "John Doe",
      tags: ["backend", "development"],
    },
    {
      id: 3,
      name: "Gamma Team",
      description: "QA and testing team",
      status: "inactive",
      createdAt: "2023-04-10",
      owner: "David Brown",
      tags: ["qa", "testing"],
    },
    {
      id: 4,
      name: "Delta Team",
      description: "DevOps and infrastructure team",
      status: "active",
      createdAt: "2023-05-05",
      owner: "Sarah Williams",
      tags: ["devops", "infrastructure"],
    },
  ],
  tasks: [
    {
      id: 1,
      name: "Redesign homepage",
      description: "Create a new design for the homepage",
      status: "in-progress",
      createdAt: "2023-03-15",
      owner: "Jane Smith",
      tags: ["design", "website"],
      priority: "High",
      dueDate: "2023-04-15",
    },
    {
      id: 2,
      name: "Fix payment bug",
      description: "Investigate and fix payment processing issue",
      status: "pending",
      createdAt: "2023-03-20",
      owner: "Mike Johnson",
      tags: ["bug", "critical"],
      priority: "High",
      dueDate: "2023-03-25",
    },
    {
      id: 3,
      name: "Write documentation",
      description: "Create user documentation for new features",
      status: "completed",
      createdAt: "2023-04-10",
      owner: "Sarah Williams",
      tags: ["documentation", "user"],
      priority: "Medium",
      dueDate: "2023-04-20",
    },
    {
      id: 4,
      name: "Implement authentication",
      description: "Add user authentication system",
      status: "in-progress",
      createdAt: "2023-04-15",
      owner: "Mike Johnson",
      tags: ["security", "user"],
      priority: "High",
      dueDate: "2023-04-30",
    },
    {
      id: 5,
      name: "Optimize database",
      description: "Improve database query performance",
      status: "pending",
      createdAt: "2023-04-20",
      owner: "David Brown",
      tags: ["database", "performance"],
      priority: "Medium",
      dueDate: "2023-05-10",
    },
    {
      id: 6,
      name: "Weekly team meeting",
      description: "Regular team sync-up",
      status: "recurring",
      createdAt: "2023-01-01",
      owner: "John Doe",
      tags: ["meeting", "team"],
      priority: "Low",
      dueDate: "recurring",
    },
    {
      id: 7,
      name: "Client presentation",
      description: "Prepare slides for client meeting",
      status: "completed",
      createdAt: "2023-04-25",
      owner: "Jane Smith",
      tags: ["client", "presentation"],
      priority: "High",
      dueDate: "2023-05-05",
    },
  ],
  profiles: [
    {
      id: 1,
      name: "Administrator",
      description: "Full system access",
      status: "active",
      createdAt: "2023-01-10",
      owner: "System",
      tags: ["system", "admin"],
    },
    {
      id: 2,
      name: "Manager",
      description: "Department management access",
      status: "active",
      createdAt: "2023-01-10",
      owner: "System",
      tags: ["system", "management"],
    },
    {
      id: 3,
      name: "User",
      description: "Basic system access",
      status: "active",
      createdAt: "2023-01-10",
      owner: "System",
      tags: ["system", "basic"],
    },
  ],
  "permission-sets": [
    {
      id: 1,
      name: "Task Management",
      description: "Permissions for managing tasks",
      status: "active",
      createdAt: "2023-01-15",
      owner: "System",
      tags: ["tasks", "permissions"],
    },
    {
      id: 2,
      name: "User Management",
      description: "Permissions for managing users",
      status: "active",
      createdAt: "2023-01-15",
      owner: "System",
      tags: ["users", "permissions"],
    },
    {
      id: 3,
      name: "System Configuration",
      description: "Permissions for system settings",
      status: "active",
      createdAt: "2023-01-15",
      owner: "System",
      tags: ["system", "permissions"],
    },
  ],
  "permission-set-groups": [
    {
      id: 1,
      name: "Admin Group",
      description: "Permission sets for administrators",
      status: "active",
      createdAt: "2023-01-20",
      owner: "System",
      tags: ["admin", "permissions"],
    },
    {
      id: 2,
      name: "Manager Group",
      description: "Permission sets for managers",
      status: "active",
      createdAt: "2023-01-20",
      owner: "System",
      tags: ["manager", "permissions"],
    },
    {
      id: 3,
      name: "User Group",
      description: "Permission sets for regular users",
      status: "active",
      createdAt: "2023-01-20",
      owner: "System",
      tags: ["user", "permissions"],
    },
  ],
  users: [
    {
      id: 1,
      name: "User 1",
      description: "Description for User 1",
      status: "active",
      createdAt: "2023-01-20",
      owner: "System",
      tags: ["user"],
    },
    {
      id: 2,
      name: "User 2",
      description: "Description for User 2",
      status: "active",
      createdAt: "2023-01-20",
      owner: "System",
      tags: ["user"],
    },
  ],
}

// Get all unique owners from sample data
const getAllOwners = () => {
  const owners = new Set<string>()

  Object.values(sampleData).forEach((items) => {
    items.forEach((item: any) => {
      if (item.owner) owners.add(item.owner)
    })
  })

  return Array.from(owners)
}

// Get all unique tags from sample data
const getAllTags = () => {
  const tags = new Set<string>()

  Object.values(sampleData).forEach((items) => {
    items.forEach((item: any) => {
      if (item.tags) item.tags.forEach((tag: string) => tags.add(tag))
    })
  })

  return Array.from(tags)
}

// Get all unique statuses from sample data
const getAllStatuses = () => {
  const statuses = new Set<string>()

  Object.values(sampleData).forEach((items) => {
    items.forEach((item: any) => {
      if (item.status) statuses.add(item.status)
    })
  })

  return Array.from(statuses)
}

type SearchResultType =
  | "categories"
  | "priorities"
  | "contacts"
  | "groups"
  | "teams"
  | "tasks"
  | "profiles"
  | "permission-sets"
  | "permission-set-groups"
  | "users"

interface SearchResult {
  id: number
  name: string
  description: string
  type: SearchResultType
  status?: string
  createdAt?: string
  owner?: string
  tags?: string[]
  priority?: string
  dueDate?: string
}

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface AdvancedFilters {
  dateRange: DateRange
  owners: string[]
  tags: string[]
  statuses: string[]
  textMatch: "contains" | "exact" | "startsWith" | "endsWith"
  showArchived: boolean
  sortBy: "relevance" | "name" | "date" | "status"
  sortOrder: "asc" | "desc"
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isClient, setIsClient] = useState(false)
  const [sidebarState, setSidebarState] = useState<"expanded" | "collapsed">("expanded")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedFilters, setSelectedFilters] = useState<SearchResultType[]>([
    "categories",
    "priorities",
    "contacts",
    "groups",
    "teams",
    "tasks",
    "profiles",
    "permission-sets",
    "permission-set-groups",
  ])
  const [showResults, setShowResults] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    dateRange: { from: undefined, to: undefined },
    owners: [],
    tags: [],
    statuses: [],
    textMatch: "contains",
    showArchived: false,
    sortBy: "relevance",
    sortOrder: "desc",
  })
  const [activeFilterCount, setActiveFilterCount] = useState(0)
  const [savedSearches, setSavedSearches] = useState<{ name: string; query: string; filters: any }[]>([
    {
      name: "High Priority Tasks",
      query: "",
      filters: { selectedFilters: ["tasks"], advancedFilters: { tags: ["critical"] } },
    },
    {
      name: "Recent Documents",
      query: "",
      filters: {
        selectedFilters: ["tasks"],
        advancedFilters: { dateRange: { from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), to: new Date() } },
      },
    },
    {
      name: "My Assigned Tasks",
      query: "",
      filters: { selectedFilters: ["tasks"], advancedFilters: { owners: ["John Doe"] } },
    },
  ])

  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Calculate active filter count
  useEffect(() => {
    let count = 0
    if (advancedFilters.dateRange.from || advancedFilters.dateRange.to) count++
    if (advancedFilters.owners.length > 0) count++
    if (advancedFilters.tags.length > 0) count++
    if (advancedFilters.statuses.length > 0) count++
    if (advancedFilters.textMatch !== "contains") count++
    if (advancedFilters.showArchived) count++
    if (advancedFilters.sortBy !== "relevance") count++

    setActiveFilterCount(count)
  }, [advancedFilters])

  // Handle clicks outside the search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setIsClient(true)

    // Listen for sidebar toggle events from the Sidebar component
    const handleToggleSidebar = () => {
      setSidebarState((prev) => (prev === "expanded" ? "collapsed" : "expanded"))
    }

    document.addEventListener("toggle-sidebar", handleToggleSidebar)

    return () => {
      document.removeEventListener("toggle-sidebar", handleToggleSidebar)
    }
  }, [])

  // Search function with advanced filters
  useEffect(() => {
    if (searchQuery.trim() === "" && activeFilterCount === 0) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    // Helper function to check if an item matches text search based on the textMatch setting
    const matchesText = (text: string, query: string) => {
      switch (advancedFilters.textMatch) {
        case "exact":
          return text.toLowerCase() === query
        case "startsWith":
          return text.toLowerCase().startsWith(query)
        case "endsWith":
          return text.toLowerCase().endsWith(query)
        case "contains":
        default:
          return text.toLowerCase().includes(query)
      }
    }

    // Helper function to check if an item matches date range
    const matchesDateRange = (dateStr: string | undefined) => {
      if (!dateStr) return true
      if (!advancedFilters.dateRange.from && !advancedFilters.dateRange.to) return true

      const itemDate = new Date(dateStr)
      const fromMatch = !advancedFilters.dateRange.from || itemDate >= advancedFilters.dateRange.from
      const toMatch = !advancedFilters.dateRange.to || itemDate <= advancedFilters.dateRange.to

      return fromMatch && toMatch
    }

    // Helper function to check if an item matches owners filter
    const matchesOwners = (owner: string | undefined) => {
      if (!owner) return true
      if (advancedFilters.owners.length === 0) return true
      return advancedFilters.owners.includes(owner)
    }

    // Helper function to check if an item matches tags filter
    const matchesTags = (itemTags: string[] | undefined) => {
      if (!itemTags || itemTags.length === 0) return true
      if (advancedFilters.tags.length === 0) return true
      return advancedFilters.tags.some((tag) => itemTags.includes(tag))
    }

    // Helper function to check if an item matches status filter
    const matchesStatus = (status: string | undefined) => {
      if (!status) return true
      if (advancedFilters.statuses.length === 0) return true
      return advancedFilters.statuses.includes(status)
    }

    // Helper function to check if an item should be included based on archived status
    const matchesArchived = (status: string | undefined) => {
      if (!status) return true
      if (advancedFilters.showArchived) return true
      return status !== "archived"
    }

    // Search in each data type if it's in the selected filters
    Object.entries(sampleData).forEach(([type, items]) => {
      const resultType = type as SearchResultType
      if (selectedFilters.includes(resultType)) {
        const typeResults = items
          .filter((item: any) => {
            // Text search
            const textMatch =
              searchQuery.trim() === "" ||
              matchesText(item.name, query) ||
              matchesText(item.description, query) ||
              (item.email && matchesText(item.email, query)) ||
              (item.role && matchesText(item.role, query))

            // Advanced filters
            const dateMatch = matchesDateRange(item.createdAt)
            const ownerMatch = matchesOwners(item.owner)
            const tagMatch = matchesTags(item.tags)
            const statusMatch = matchesStatus(item.status)
            const archivedMatch = matchesArchived(item.status)

            return textMatch && dateMatch && ownerMatch && tagMatch && statusMatch && archivedMatch
          })
          .map((item: any) => {
            if (resultType === "contacts") {
              return {
                id: item.id,
                name: item.name,
                description: item.email,
                type: resultType,
                status: item.status,
                createdAt: item.createdAt,
                owner: item.owner,
                tags: item.tags,
              }
            }
            return { ...item, type: resultType }
          })

        results.push(...typeResults)
      }
    })

    // Sort results
    if (advancedFilters.sortBy !== "relevance") {
      results.sort((a, b) => {
        let comparison = 0

        switch (advancedFilters.sortBy) {
          case "name":
            comparison = a.name.localeCompare(b.name)
            break
          case "date":
            comparison = (a.createdAt || "").localeCompare(b.createdAt || "")
            break
          case "status":
            comparison = (a.status || "").localeCompare(b.status || "")
            break
        }

        return advancedFilters.sortOrder === "asc" ? comparison : -comparison
      })
    }

    setSearchResults(results)
  }, [searchQuery, selectedFilters, advancedFilters, activeFilterCount])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowResults(value.trim() !== "" || activeFilterCount > 0)
  }

  const handleFilterToggle = (type: SearchResultType) => {
    setSelectedFilters((prev) => (prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]))
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowResults(false)
    setAdvancedFilters({
      dateRange: { from: undefined, to: undefined },
      owners: [],
      tags: [],
      statuses: [],
      textMatch: "contains",
      showArchived: false,
      sortBy: "relevance",
      sortOrder: "desc",
    })
  }

  const handleResultClick = (result: SearchResult) => {
    // Navigate to the appropriate page based on the result type
    router.push(`/${result.type}/${result.id}`)
    setShowResults(false)
  }

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters)
  }

  const handleDateRangeChange = (range: DateRange) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      dateRange: range,
    }))
  }

  const handleOwnerToggle = (owner: string) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      owners: prev.owners.includes(owner) ? prev.owners.filter((o) => o !== owner) : [...prev.owners, owner],
    }))
  }

  const handleTagToggle = (tag: string) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const handleStatusToggle = (status: string) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status) ? prev.statuses.filter((s) => s !== status) : [...prev.statuses, status],
    }))
  }

  const handleTextMatchChange = (value: "contains" | "exact" | "startsWith" | "endsWith") => {
    setAdvancedFilters((prev) => ({
      ...prev,
      textMatch: value,
    }))
  }

  const handleShowArchivedChange = (checked: boolean) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      showArchived: checked,
    }))
  }

  const handleSortByChange = (value: "relevance" | "name" | "date" | "status") => {
    setAdvancedFilters((prev) => ({
      ...prev,
      sortBy: value,
    }))
  }

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setAdvancedFilters((prev) => ({
      ...prev,
      sortOrder: value,
    }))
  }

  const saveCurrentSearch = () => {
    const searchName = prompt("Enter a name for this search:")
    if (searchName) {
      setSavedSearches((prev) => [
        ...prev,
        {
          name: searchName,
          query: searchQuery,
          filters: {
            selectedFilters,
            advancedFilters,
          },
        },
      ])
    }
  }

  const applySavedSearch = (search: { name: string; query: string; filters: any }) => {
    setSearchQuery(search.query)
    setSelectedFilters(search.filters.selectedFilters || [])
    setAdvancedFilters(
      search.filters.advancedFilters || {
        dateRange: { from: undefined, to: undefined },
        owners: [],
        tags: [],
        statuses: [],
        textMatch: "contains",
        showArchived: false,
        sortBy: "relevance",
        sortOrder: "desc",
      },
    )
    setShowResults(true)
  }

  const deleteSavedSearch = (index: number) => {
    setSavedSearches((prev) => prev.filter((_, i) => i !== index))
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 border-b border-blue-700 flex items-center justify-between px-6 z-50 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-70 transition duration-300 group-hover:duration-200"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-full shadow-lg flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)]"></div>
              <div className="relative z-10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <div className="text-white font-semibold text-xl tracking-tight">
            Remindr AI
            <span className="text-xs ml-2 bg-blue-500 px-2 py-0.5 rounded-full text-blue-50">Enterprise</span>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <a
            href="#"
            className="text-blue-100 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            <span className="hidden md:inline">Pricing</span>
          </a>
          <a
            href="#"
            className="text-blue-100 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            <span className="hidden md:inline">Features</span>
          </a>
          <a
            href="#"
            className="text-blue-100 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            <span className="hidden md:inline">About</span>
          </a>
          <a
            href="#"
            className="text-blue-100 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            <span className="hidden md:inline">Contact</span>
          </a>
          <Popover>
            <PopoverTrigger asChild>
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition-colors">
                <span className="text-sm font-medium">JD</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
              <div className="p-2 border-b">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <span className="text-sm font-medium">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-xs text-gray-500">john.doe@example.com</p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-left">
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-left">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-left">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-left">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help & Support</span>
                </button>
              </div>
              <div className="py-1 border-t">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 bottom-0 ${
          sidebarState === "collapsed" ? "w-16" : "w-60"
        } bg-white border-r border-gray-200 z-40 overflow-y-auto transition-all duration-300`}
      >
        <Sidebar sidebarState={sidebarState} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 pt-16 ${
          sidebarState === "collapsed" ? "pl-16" : "pl-60"
        } overflow-auto transition-all duration-300 flex flex-col`}
      >
        {/* Search Bar */}
        <div className="p-4 bg-white border-b border-gray-200" ref={searchRef}>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search across all projects..."
              className="pl-10 pr-10 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(searchQuery.trim() !== "" || activeFilterCount > 0)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
              {(searchQuery || activeFilterCount > 0) && (
                <button
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  onClick={clearSearch}
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={`p-1 rounded-md hover:bg-gray-100 ${
                      activeFilterCount > 0 ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                    title="Saved searches"
                  >
                    <Save className="h-4 w-4" />
                    {savedSearches.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {savedSearches.length}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="end">
                  <div className="p-2 border-b">
                    <h3 className="font-medium">Saved Searches</h3>
                  </div>
                  <ScrollArea className="h-64">
                    {savedSearches.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No saved searches</div>
                    ) : (
                      <div className="p-2">
                        {savedSearches.map((search, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md"
                          >
                            <button className="flex-1 text-left" onClick={() => applySavedSearch(search)}>
                              <div className="font-medium">{search.name}</div>
                              <div className="text-xs text-gray-500 truncate">
                                {search.query || "(No query)"} •{" "}
                                {Object.values(search.filters.advancedFilters).flat().filter(Boolean).length} filters
                              </div>
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-red-500"
                              onClick={() => deleteSavedSearch(index)}
                              title="Delete saved search"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  <div className="p-2 border-t">
                    <button
                      className="w-full py-1.5 px-3 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center justify-center gap-1"
                      onClick={saveCurrentSearch}
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Current Search</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
              <button
                className={`p-1 rounded-md hover:bg-gray-100 ${
                  activeFilterCount > 0 ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={toggleAdvancedFilters}
                title="Advanced filters"
              >
                <Filter className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Advanced Filters</h3>
                  <button className="text-gray-400 hover:text-gray-600" onClick={toggleAdvancedFilters}>
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <Tabs defaultValue="date">
                  <TabsList className="mb-2">
                    <TabsTrigger value="date" className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Date</span>
                    </TabsTrigger>
                    <TabsTrigger value="people" className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>People</span>
                    </TabsTrigger>
                    <TabsTrigger value="tags" className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <span>Tags</span>
                    </TabsTrigger>
                    <TabsTrigger value="status" className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Status</span>
                    </TabsTrigger>
                    <TabsTrigger value="options" className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      <span>Options</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="date" className="mt-0">
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-1 block">Date Range</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-gray-500">From</Label>
                            <CalendarComponent
                              mode="single"
                              selected={advancedFilters.dateRange.from}
                              onSelect={(date) => handleDateRangeChange({ ...advancedFilters.dateRange, from: date })}
                              className="border rounded-md p-2"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">To</Label>
                            <CalendarComponent
                              mode="single"
                              selected={advancedFilters.dateRange.to}
                              onSelect={(date) => handleDateRangeChange({ ...advancedFilters.dateRange, to: date })}
                              className="border rounded-md p-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDateRangeChange({
                              from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                              to: new Date(),
                            })
                          }
                        >
                          Last 7 days
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDateRangeChange({
                              from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                              to: new Date(),
                            })
                          }
                        >
                          Last 30 days
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDateRangeChange({
                              from: undefined,
                              to: undefined,
                            })
                          }
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="people" className="mt-0">
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-1 block">Owners/Creators</Label>
                        <ScrollArea className="h-48 border rounded-md p-2">
                          {getAllOwners().map((owner) => (
                            <div key={owner} className="flex items-center space-x-2 py-1">
                              <Checkbox
                                id={`owner-${owner}`}
                                checked={advancedFilters.owners.includes(owner)}
                                onCheckedChange={() => handleOwnerToggle(owner)}
                              />
                              <Label htmlFor={`owner-${owner}`} className="cursor-pointer">
                                {owner}
                              </Label>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdvancedFilters((prev) => ({ ...prev, owners: getAllOwners() }))}
                        >
                          Select All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdvancedFilters((prev) => ({ ...prev, owners: [] }))}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tags" className="mt-0">
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-1 block">Tags/Labels</Label>
                        <div className="flex flex-wrap gap-1 border rounded-md p-2 min-h-[100px] max-h-[200px] overflow-y-auto">
                          {getAllTags().map((tag) => (
                            <Badge
                              key={tag}
                              variant={advancedFilters.tags.includes(tag) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handleTagToggle(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdvancedFilters((prev) => ({ ...prev, tags: getAllTags() }))}
                        >
                          Select All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdvancedFilters((prev) => ({ ...prev, tags: [] }))}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="status" className="mt-0">
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-1 block">Status</Label>
                        <ScrollArea className="h-48 border rounded-md p-2">
                          {getAllStatuses().map((status) => (
                            <div key={status} className="flex items-center space-x-2 py-1">
                              <Checkbox
                                id={`status-${status}`}
                                checked={advancedFilters.statuses.includes(status)}
                                onCheckedChange={() => handleStatusToggle(status)}
                              />
                              <Label htmlFor={`status-${status}`} className="cursor-pointer capitalize">
                                {status}
                              </Label>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="show-archived"
                          checked={advancedFilters.showArchived}
                          onCheckedChange={(checked) => handleShowArchivedChange(checked as boolean)}
                        />
                        <Label htmlFor="show-archived" className="cursor-pointer">
                          Include archived items
                        </Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="options" className="mt-0">
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-1 block">Text Match</Label>
                        <Select
                          value={advancedFilters.textMatch}
                          onValueChange={(value) => handleTextMatchChange(value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select match type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="exact">Exact match</SelectItem>
                            <SelectItem value="startsWith">Starts with</SelectItem>
                            <SelectItem value="endsWith">Ends with</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="mb-1 block">Sort By</Label>
                        <div className="flex gap-2">
                          <Select
                            value={advancedFilters.sortBy}
                            onValueChange={(value) => handleSortByChange(value as any)}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="relevance">Relevance</SelectItem>
                              <SelectItem value="name">Name</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="status">Status</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleSortOrderChange(advancedFilters.sortOrder === "asc" ? "desc" : "asc")}
                            title={advancedFilters.sortOrder === "asc" ? "Ascending" : "Descending"}
                          >
                            {advancedFilters.sortOrder === "asc" ? (
                              <SortAsc className="h-4 w-4" />
                            ) : (
                              <SortDesc className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between mt-4 pt-2 border-t">
                  <Button variant="outline" size="sm" onClick={clearSearch}>
                    Reset All
                  </Button>
                  <Button size="sm" onClick={toggleAdvancedFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto border border-gray-200">
                <div className="p-2">
                  {searchResults.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-start"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-1">
                          <span className="font-medium">{result.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(result.type)}`}>
                            {getTypeLabel(result.type)}
                          </span>
                          {result.status && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(result.status)}`}>
                              {result.status}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5 truncate">{result.description}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500 gap-2">
                          {result.createdAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {result.createdAt}
                            </span>
                          )}
                          {result.owner && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {result.owner}
                            </span>
                          )}
                          {result.tags && result.tags.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {result.tags.slice(0, 2).join(", ")}
                              {result.tags.length > 2 && `+${result.tags.length - 2}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {showResults && searchQuery && searchResults.length === 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                <div className="p-4 text-center text-gray-500">No results found for "{searchQuery}"</div>
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto mt-2">
            <span className="text-sm text-gray-500 mr-2">Search in:</span>
            <div className="inline-flex flex-wrap gap-1 mt-1">
              {[
                { type: "categories" as const, label: "Categories" },
                { type: "contacts" as const, label: "Contacts" },
                { type: "groups" as const, label: "Groups" },
                { type: "permission-set-groups" as const, label: "Permission Set Groups" },
                { type: "permission-sets" as const, label: "Permission Sets" },
                { type: "priorities" as const, label: "Priorities" },
                { type: "profiles" as const, label: "Profiles" },
                { type: "tasks" as const, label: "Tasks" },
                { type: "teams" as const, label: "Teams" },
                { type: "users" as const, label: "Users" },
              ]
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((filter) => (
                  <span
                    key={filter.type}
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                      selectedFilters.includes(filter.type)
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => handleFilterToggle(filter.type)}
                  >
                    {filter.label}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 flex-1">{children}</div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

// Helper functions
function getTypeLabel(type: SearchResultType): string {
  const labels: Record<SearchResultType, string> = {
    categories: "Category",
    priorities: "Priority",
    contacts: "Contact",
    groups: "Group",
    teams: "Team",
    tasks: "Task",
    profiles: "Profile",
    "permission-sets": "Permission Set",
    "permission-set-groups": "Permission Set Group",
    users: "User",
  }
  return labels[type]
}

function getTypeColor(type: SearchResultType): string {
  const colors: Record<SearchResultType, string> = {
    categories: "bg-purple-100 text-purple-800",
    priorities: "bg-red-100 text-red-800",
    contacts: "bg-green-100 text-green-800",
    groups: "bg-yellow-100 text-yellow-800",
    teams: "bg-blue-100 text-blue-800",
    tasks: "bg-indigo-100 text-indigo-800",
    profiles: "bg-teal-100 text-teal-800",
    "permission-sets": "bg-pink-100 text-pink-800",
    "permission-set-groups": "bg-orange-100 text-orange-800",
    users: "bg-cyan-100 text-cyan-800",
  }
  return colors[type]
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    archived: "bg-red-100 text-red-800",
    "in-progress": "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    recurring: "bg-purple-100 text-purple-800",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}
