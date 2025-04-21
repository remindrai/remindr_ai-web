"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Trash2, ArrowLeft, Calendar, Tag, MessageSquare } from "lucide-react"
import { CommunicationHistory } from "@/components/communication/communication-history"
import { FollowUpSchedule } from "@/components/communication/follow-up-schedule"
import { CommunicationStatus } from "@/components/communication/communication-status"
import { sampleTasks } from "./data"

interface Task {
  id: number
  name: string
  description: string
  status: string
  priority: string
  dueDate?: string
  assignee?: {
    id: number
    name: string
  }
  tags: string[]
}

export function TaskDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // In a real app, you would fetch the task from an API
    // For this demo, we'll use the ID from the URL and mock data
    const taskId = Number.parseInt(params.id)
    const foundTask = sampleTasks.find((t) => t.id === taskId)
    setTask(foundTask || null)
    setLoading(false)
  }, [params.id, router])

  const handleBack = () => {
    router.back()
  }

  const handleEdit = () => {
    // In a real app, you would navigate to an edit page or open a modal
    alert(`Edit task: ${task?.name}`)
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the task "${task?.name}"?`)) {
      // In a real app, you would call an API to delete the task
      alert(`Task "${task?.name}" deleted`)
      router.push("/tasks")
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      todo: { label: "To Do", className: "bg-gray-200 text-gray-800" },
      "in-progress": { label: "In Progress", className: "bg-blue-100 text-blue-800" },
      review: { label: "Review", className: "bg-yellow-100 text-yellow-800" },
      done: { label: "Done", className: "bg-green-100 text-green-800" },
    }

    const statusInfo = statusMap[status] || { label: status, className: "" }

    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { label: string; className: string }> = {
      high: { label: "High", className: "bg-red-100 text-red-800" },
      medium: { label: "Medium", className: "bg-yellow-100 text-yellow-800" },
      low: { label: "Low", className: "bg-blue-100 text-blue-800" },
    }

    const priorityInfo = priorityMap[priority] || { label: priority, className: "" }

    return <Badge className={priorityInfo.className}>{priorityInfo.label}</Badge>
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

  if (!task) {
    return (
      <AppLayout>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Task Not Found</h1>
          </div>
          <p>The task you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/tasks")} className="mt-4">
            Back to Tasks
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
            <h1 className="text-3xl font-bold">{task.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Task
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="follow-ups">Follow-ups</TabsTrigger>
          </TabsList>
        </Tabs>

        <TabsContent value="details" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Task Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p>{task.description || "No description provided."}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    No comments yet
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Status</h3>
                      <div>{getStatusBadge(task.status)}</div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Priority</h3>
                      <div>{getPriorityBadge(task.priority)}</div>
                    </div>

                    {task.assignee && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Assignee</h3>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                            {task.assignee.name.charAt(0)}
                          </div>
                          <span>{task.assignee.name}</span>
                        </div>
                      </div>
                    )}

                    {task.dueDate && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Due Date</h3>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="communications" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <CommunicationHistory taskId={params.id} />
            </div>
            <div>
              <CommunicationStatus taskId={params.id} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="follow-ups" className="mt-0">
          <FollowUpSchedule taskId={params.id} />
        </TabsContent>
      </div>
    </AppLayout>
  )
} 