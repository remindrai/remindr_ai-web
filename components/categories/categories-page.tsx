"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CategoryDialog } from "@/components/categories/category-dialog"
import { Pencil, Trash2 } from "lucide-react"

interface Category {
  id: number
  name: string
  description: string
}

export function CategoriesPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load categories from localStorage or use sample data
    const savedCategories = localStorage.getItem("categories")
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories)
      setCategories(parsedCategories)
      setFilteredCategories(parsedCategories)
      updateTotalPages(parsedCategories.length, rowsPerPage)
    } else {
      // Sample Categories Data
      const sampleCategories = [
        { id: 1, name: "Work", description: "Work-related tasks and projects" },
        { id: 2, name: "Personal", description: "Personal tasks and errands" },
        { id: 3, name: "School", description: "All school configuration starts from here" },
        { id: 4, name: "Health", description: "Health and fitness related tasks" },
        { id: 5, name: "Finance", description: "Financial tasks and goals" },
      ]
      setCategories(sampleCategories)
      setFilteredCategories(sampleCategories)
      updateTotalPages(sampleCategories.length, rowsPerPage)

      // Save to localStorage
      localStorage.setItem("categories", JSON.stringify(sampleCategories))
    }
  }, [router, rowsPerPage])

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredCategories(filtered)
      setCurrentPage(1)
      updateTotalPages(filtered.length, rowsPerPage)
    } else {
      setFilteredCategories(categories)
      updateTotalPages(categories.length, rowsPerPage)
    }
  }, [searchTerm, categories, rowsPerPage])

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
    updateTotalPages(filteredCategories.length, newRowsPerPage)
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

  const handleAddCategory = () => {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setDialogOpen(true)
  }

  const handleDeleteCategory = (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const updatedCategories = categories.filter((category) => category.id !== id)
      setCategories(updatedCategories)
      localStorage.setItem("categories", JSON.stringify(updatedCategories))
    }
  }

  const handleSaveCategory = (category: Category) => {
    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map((c) =>
        c.id === editingCategory.id ? { ...category, id: editingCategory.id } : c,
      )
      setCategories(updatedCategories)
      localStorage.setItem("categories", JSON.stringify(updatedCategories))
    } else {
      // Add new category
      const newId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1
      const newCategory = { ...category, id: newId }
      const updatedCategories = [...categories, newCategory]
      setCategories(updatedCategories)
      localStorage.setItem("categories", JSON.stringify(updatedCategories))
    }
    setDialogOpen(false)
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedCategories = filteredCategories.slice(startIndex, endIndex)

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Categories</h1>
          <Button onClick={handleAddCategory}>Add Category</Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Category Management</h2>
          <p className="text-muted-foreground mb-6">Create, edit, and delete task categories.</p>

          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2">Categories</h3>
            <p className="text-muted-foreground mb-4">Manage task categories.</p>

            <div className="my-4">
              <Input placeholder="Search categories..." value={searchTerm} onChange={handleSearch} />
            </div>

            <div className="border rounded-md overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedCategories.length > 0 ? (
                    displayedCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditCategory(category)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCategory(category.id)}
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
                      <TableCell colSpan={3} className="text-center py-8">
                        No categories found
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

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </AppLayout>
  )
}
