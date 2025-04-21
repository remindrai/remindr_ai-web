"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, ArrowLeft } from "lucide-react"
import { sampleCategories } from "./data"

export function generateStaticParams() {
  return sampleCategories.map((category) => ({
    id: category.id.toString(),
  }))
}

export default function Page({ params }: { params: { id: string } }) {
  return <CategoryDetail params={params} />
}

interface Category {
  id: number
  name: string
  description: string
}

function CategoryDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isClient, setIsClient] = useState(false)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // In a real app, you would fetch the category from an API
    // For this demo, we'll use the ID from the URL and mock data
    const categoryId = Number.parseInt(params.id)
    const foundCategory = sampleCategories.find((c) => c.id === categoryId)
    setCategory(foundCategory || null)
    setLoading(false)
  }, [params.id, router])

  const handleBack = () => {
    router.back()
  }

  const handleEdit = () => {
    // In a real app, you would navigate to an edit page or open a modal
    alert(`Edit category: ${category?.name}`)
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the category "${category?.name}"?`)) {
      // In a real app, you would call an API to delete the category
      alert(`Category "${category?.name}" deleted`)
      router.push("/categories")
    }
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Loading...</h1>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!category) {
    return (
      <AppLayout>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Category Not Found</h1>
          </div>
          <p>The category you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/categories")} className="mt-4">
            Back to Categories
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">{category.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Category
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Name</h3>
                <p>{category.name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Description</h3>
                <p>{category.description || "No description provided."}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tasks in this Category</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Tasks that belong to the "{category.name}" category will be displayed here.
            </p>

            {/* In a real app, you would fetch and display tasks for this category */}
            <div className="text-center py-8 text-muted-foreground">No tasks found in this category.</div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
