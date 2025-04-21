"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableActionCell } from "@/components/ui/table"
import { PromptDialog } from "./prompt-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for prompts
const initialPrompts = [
  {
    id: "1",
    title: "Task Summary",
    content: "Summarize the following task in bullet points:",
    category: "Tasks",
    tags: ["summary", "bullet-points"],
    createdAt: "2023-09-15T10:30:00Z",
    createdBy: "John Doe",
    status: "active",
  },
  {
    id: "2",
    title: "Meeting Notes",
    content: "Create detailed meeting notes from the following transcript:",
    category: "Meetings",
    tags: ["notes", "transcript"],
    createdAt: "2023-09-16T14:45:00Z",
    createdBy: "Jane Smith",
    status: "active",
  },
  {
    id: "3",
    title: "Email Draft",
    content: "Draft a professional email to respond to the following inquiry:",
    category: "Communication",
    tags: ["email", "professional"],
    createdAt: "2023-09-17T09:15:00Z",
    createdBy: "Mike Johnson",
    status: "active",
  },
  {
    id: "4",
    title: "Code Explanation",
    content: "Explain the following code in simple terms:",
    category: "Development",
    tags: ["code", "explanation"],
    createdAt: "2023-09-18T16:20:00Z",
    createdBy: "Sarah Williams",
    status: "inactive",
  },
  {
    id: "5",
    title: "Bug Report",
    content: "Create a detailed bug report based on the following observations:",
    category: "Development",
    tags: ["bug", "report"],
    createdAt: "2023-09-19T11:10:00Z",
    createdBy: "David Brown",
    status: "active",
  },
]

// Mock data for categories with colors
const categories = [
  { id: "1", name: "Tasks", color: "#3b82f6" },
  { id: "2", name: "Meetings", color: "#10b981" },
  { id: "3", name: "Communication", color: "#f59e0b" },
  { id: "4", name: "Development", color: "#8b5cf6" },
  { id: "5", name: "Marketing", color: "#ec4899" },
]

export function PromptsPage() {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<any>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  const filteredPrompts = prompts
    .filter(
      (prompt) =>
        (searchQuery === "" ||
          prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
        (categoryFilter === "all" || prompt.category === categoryFilter) &&
        (statusFilter === "all" || prompt.status === statusFilter),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "alphabetical":
          return a.title.localeCompare(b.title)
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

  const handleAddPrompt = () => {
    setCurrentPrompt(null)
    setIsDialogOpen(true)
  }

  const handleEditPrompt = (prompt: any) => {
    setCurrentPrompt(prompt)
    setIsDialogOpen(true)
  }

  const handleDeletePrompt = (id: string) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      setPrompts(prompts.filter((prompt) => prompt.id !== id))
    }
  }

  const handleSavePrompt = (promptData: any) => {
    if (promptData.id) {
      // Update existing prompt
      setPrompts(prompts.map((prompt) => (prompt.id === promptData.id ? { ...prompt, ...promptData } : prompt)))
    } else {
      // Add new prompt
      const newPrompt = {
        ...promptData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        createdBy: "John Doe", // Current user
        status: "active",
      }
      setPrompts([...prompts, newPrompt])
    }
    setIsDialogOpen(false)
  }

  const handleDuplicatePrompt = (prompt: any) => {
    const duplicatedPrompt = {
      ...prompt,
      id: Date.now().toString(),
      title: `${prompt.title} (Copy)`,
      createdAt: new Date().toISOString(),
      createdBy: "John Doe", // Current user
    }
    setPrompts([...prompts, duplicatedPrompt])
  }

  const handleExportPrompts = () => {
    const dataStr = JSON.stringify(prompts, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "prompts.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName)
    return category ? category.color : "#64748b" // Default color
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Prompts</h2>
          <p className="text-muted-foreground">Manage your AI chat prompts and templates.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddPrompt} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Add Prompt
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <div className="relative w-full sm:max-w-xs">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search prompts..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Newest First" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Tags</TableHead>
              <TableHead className="font-semibold">Created By</TableHead>
              <TableHead className="font-semibold">Created At</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrompts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No prompts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPrompts.map((prompt) => (
                <TableRow key={prompt.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{prompt.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: getCategoryColor(prompt.category) }}
                      ></div>
                      {prompt.category}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{prompt.createdBy}</TableCell>
                  <TableCell>{new Date(prompt.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        prompt.status === "active" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {prompt.status}
                    </Badge>
                  </TableCell>
                  <TableActionCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditPrompt(prompt)} title="Edit">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicatePrompt(prompt)}
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Duplicate</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePrompt(prompt.id)}
                        title="Delete"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableActionCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PromptDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        prompt={currentPrompt}
        onSave={handleSavePrompt}
        categories={categories}
      />
    </div>
  )
}
