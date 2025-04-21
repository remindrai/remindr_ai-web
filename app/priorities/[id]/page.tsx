"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, ArrowLeft } from "lucide-react"

interface Priority {
  id: number
  name: string
  description: string
}

// Sample Priorities Data (in a real app, this would come from an API)
const samplePriorities = [
  { id: 1, name: "High", color: "red", description: "Urgent tasks that need immediate attention" },
  { id: 2, name: "Medium", color: "yellow", description: "Important tasks but not urgent" },
  { id: 3, name: "Low", color: "green", description: "Tasks that can be done when time permits" },
  { id: 4, name: "Critical", color: "purple", description: "Emergency tasks that require immediate action" },
  { id: 5, name: "Normal", color: "blue", description: "Regular tasks with standard priority" }
]

// This function tells Next.js which dynamic paths to pre-render
export function generateStaticParams() {
  return samplePriorities.map((priority) => ({
    id: priority.id.toString(),
  }))
}

export default function PriorityDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [priority, setPriority] = useState<Priority | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // In a real app, you would fetch the priority from an API
    // For this demo, we'll use the ID from the URL and mock data
    const priorityId = Number.parseInt(params.id)

    const foundPriority = samplePriorities.find((p) => p.id === priorityId)
    setPriority(foundPriority || null)
    setLoading(false)
  }, [params.id, router])

  const handleBack = () => {
    router.back()
  }

  const handleEdit = () => {
    // In a real app, you would navigate to an edit page or open a modal
    alert(`Edit priority: ${priority?.name}`)
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the priority "${priority?.name}"?`)) {
      // In a real app, you would call an API to delete the priority
      alert(`Priority "${priority?.name}" deleted`)
      router.push("/priorities")
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

  if (!priority) {
    return (
      <AppLayout>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Priority Not Found</h1>
          </div>
          <p>The priority you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/priorities")} className="mt-4">
            Back to Priorities
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
            <h1 className="text-3xl font-bold">{priority.name} Priority</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Priority
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Priority Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Name</h3>
                <p>{priority.name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Description</h3>
                <p>{priority.description || "No description provided."}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tasks with this Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Tasks with the "{priority.name}" priority level will be displayed here.
            </p>

            {/* In a real app, you would fetch and display tasks for this priority */}
            <div className="text-center py-8 text-muted-foreground">No tasks found with this priority.</div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
