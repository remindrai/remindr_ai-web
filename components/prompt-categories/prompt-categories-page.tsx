"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, FolderTree, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PromptCategoryDialog } from "./prompt-category-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for categories
const initialCategories = [
  {
    id: "1",
    name: "Tasks",
    description: "Prompts for task management and organization",
    color: "#3b82f6",
    promptCount: 12,
    createdAt: "2023-09-10T10:30:00Z",
    createdBy: "John Doe",
    status: "active",
  },
  {
    id: "2",
    name: "Meetings",
    description: "Prompts for meeting preparation and follow-ups",
    color: "#10b981",
    promptCount: 8,
    createdAt: "2023-09-11T14:45:00Z",
    createdBy: "Jane Smith",
    status: "active",
  },
  {
    id: "3",
    name: "Communication",
    description: "Prompts for emails and other communications",
    color: "#f59e0b",
    promptCount: 15,
    createdAt: "2023-09-12T09:15:00Z",
    createdBy: "Mike Johnson",
    status: "active",
  },
  {
    id: "4",
    name: "Development",
    description: "Prompts for coding and development tasks",
    color: "#8b5cf6",
    promptCount: 10,
    createdAt: "2023-09-13T16:20:00Z",
    createdBy: "Sarah Williams",
    status: "inactive",
  },
  {
    id: "5",
    name: "Marketing",
    description: "Prompts for marketing content and campaigns",
    color: "#ec4899",
    promptCount: 7,
    createdAt: "2023-09-14T11:10:00Z",
    createdBy: "David Brown",
    status: "active",
  },
]

export function PromptCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  const filteredCategories = categories
    .filter(
      (category) =>
        (searchQuery === "" ||
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === "all" || category.status === statusFilter),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "alphabetical":
          return a.name.localeCompare(b.name)
        case "promptCount":
          return b.promptCount - a.promptCount
        default:
          return 0
      }
    })

  const handleAddCategory = () => {
    setCurrentCategory(null)
    setIsDialogOpen(true)
  }

  const handleEditCategory = (category: any) => {
    setCurrentCategory(category)
    setIsDialogOpen(true)
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((category) => category.id !== id))
    }
  }

  const handleSaveCategory = (categoryData: any) => {
    if (categoryData.id) {
      // Update existing category
      setCategories(
        categories.map((category) => (category.id === categoryData.id ? { ...category, ...categoryData } : category)),
      )
    } else {
      // Add new category
      const newCategory = {
        ...categoryData,
        id: Date.now().toString(),
        promptCount: 0,
        createdAt: new Date().toISOString(),
        createdBy: "John Doe", // Current user
        status: "active",
      }
      setCategories([...categories, newCategory])
    }
    setIsDialogOpen(false)
  }

  const handleDuplicateCategory = (category: any) => {
    const duplicatedCategory = {
      ...category,
      id: Date.now().toString(),
      name: `${category.name} (Copy)`,
      promptCount: 0,
      createdAt: new Date().toISOString(),
      createdBy: "John Doe", // Current user
    }
    setCategories([...categories, duplicatedCategory])
  }

  const handleExportCategories = () => {
    const dataStr = JSON.stringify(categories, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "prompt-categories.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prompt Categories</h2>
          <p className="text-muted-foreground">Organize your prompts with categories for easier management.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleAddCategory}>
            <Plus className="mr-2 h-4 w-4" /> Add Prompt Category
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search categories..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="promptCount">Prompt Count</SelectItem>
            </SelectContent>
          </Select>

          <div className="border rounded-md p-1">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className="px-2.5"
              onClick={() => setViewMode("table")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
              </svg>
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="px-2.5"
              onClick={() => setViewMode("grid")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Prompts</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                    <TableCell>{category.promptCount}</TableCell>
                    <TableCell>{category.createdBy}</TableCell>
                    <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={category.status === "active" ? "default" : "secondary"} className="text-xs">
                        {category.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCategory(category)}
                          className="h-8 w-8"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicateCategory(category)}
                          className="h-8 w-8"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Duplicate</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FolderTree className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No categories found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "No categories match your search criteria."
                  : "You haven't created any categories yet."}
              </p>
              <Button onClick={handleAddCategory}>
                <Plus className="mr-2 h-4 w-4" /> Add your first category
              </Button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                      </div>
                    </div>
                    <Badge variant={category.status === "active" ? "default" : "secondary"} className="mb-2 text-xs">
                      {category.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{category.description}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{category.promptCount} prompts</span>
                      <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="border-t flex divide-x">
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-10"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-10 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <PromptCategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={currentCategory}
        onSave={handleSaveCategory}
      />
    </div>
  )
}
