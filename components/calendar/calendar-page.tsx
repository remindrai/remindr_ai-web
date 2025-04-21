"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, X, MapPin, Users, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"

// Sample task data with more detailed information and multiple tasks per day
const initialTasks = [
  {
    id: 1,
    title: "Team meeting",
    date: "2025-04-15",
    startTime: "09:00",
    endTime: "10:00",
    priority: "high",
    category: "Work",
    description: "Weekly team sync to discuss project progress and blockers",
    assignee: "John Doe",
    location: "Conference Room A",
    status: "scheduled",
    completed: false,
  },
  {
    id: 2,
    title: "Code review",
    date: "2025-04-15",
    startTime: "11:00",
    endTime: "12:00",
    priority: "high",
    category: "Work",
    description: "Review pull requests for the new feature implementation",
    assignee: "Dev Team",
    location: "Online",
    status: "scheduled",
    completed: false,
  },
  {
    id: 3,
    title: "Doctor appointment",
    date: "2025-04-15",
    startTime: "14:30",
    endTime: "15:30",
    priority: "medium",
    category: "Personal",
    description: "Annual checkup with Dr. Smith",
    assignee: "Me",
    location: "Downtown Medical Center",
    status: "confirmed",
    completed: false,
  },
  {
    id: 4,
    title: "Client call",
    date: "2025-04-15",
    startTime: "16:00",
    endTime: "17:00",
    priority: "medium",
    category: "Work",
    description: "Discussion about new requirements and timeline adjustments",
    assignee: "Jane Smith",
    location: "Zoom Meeting",
    status: "scheduled",
    completed: false,
  },
  {
    id: 5,
    title: "Grocery shopping",
    date: "2025-04-19",
    startTime: "16:00",
    endTime: "17:00",
    priority: "low",
    category: "Personal",
    description: "Pick up items for the week and dinner ingredients",
    assignee: "Me",
    location: "Whole Foods Market",
    status: "pending",
    completed: false,
  },
  {
    id: 6,
    title: "Gym session",
    date: "2025-04-21",
    startTime: "06:30",
    endTime: "07:30",
    priority: "low",
    category: "Personal",
    description: "Morning workout - cardio and strength training",
    assignee: "Me",
    location: "Fitness Center",
    status: "recurring",
    completed: false,
  },
  {
    id: 7,
    title: "Birthday party",
    date: "2025-04-25",
    startTime: "19:00",
    endTime: "22:00",
    priority: "medium",
    category: "Personal",
    description: "Sarah's birthday celebration at Riverfront Restaurant",
    assignee: "Me",
    location: "Riverfront Restaurant",
    status: "confirmed",
    completed: false,
  },
  {
    id: 8,
    title: "Project deadline",
    date: "2025-04-22",
    startTime: "17:00",
    endTime: "17:00",
    priority: "high",
    category: "Work",
    description: "Final submission deadline for Q2 project deliverables",
    assignee: "Entire Team",
    location: "N/A",
    status: "pending",
    completed: false,
  },
  {
    id: 9,
    title: "Quarterly planning",
    date: "2025-04-28",
    startTime: "09:00",
    endTime: "16:00",
    priority: "high",
    category: "Work",
    description: "Full-day session to plan Q3 objectives and key results",
    assignee: "Leadership Team",
    location: "Main Conference Room",
    status: "scheduled",
    completed: false,
  },
  {
    id: 10,
    title: "Dentist appointment",
    date: "2025-04-30",
    startTime: "10:30",
    endTime: "11:30",
    priority: "medium",
    category: "Personal",
    description: "Regular dental checkup and cleaning",
    assignee: "Me",
    location: "Bright Smile Dental",
    status: "confirmed",
    completed: false,
  },
]

// AI suggestions
const aiSuggestions = [
  {
    id: 1,
    task: "Team meeting",
    suggestion: "Reschedule to April 22nd to avoid conflict with project deadline",
    confidence: 85,
    reasoning: "Based on team availability and project timeline",
  },
  {
    id: 2,
    task: "Project deadline",
    suggestion: "Increase priority to critical",
    confidence: 92,
    reasoning: "This is a key milestone for Q2 objectives",
  },
  {
    id: 3,
    task: "Code review",
    suggestion: "Group with quarterly planning on April 28th",
    confidence: 78,
    reasoning: "Both tasks involve similar stakeholders",
  },
]

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("calendar")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showDayDetails, setShowDayDetails] = useState(false)
  const [tasks, setTasks] = useState(initialTasks)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [showEditTask, setShowEditTask] = useState(false)

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get first day of the month and total days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Navigation functions
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Get month name
  const monthName = currentDate.toLocaleString("default", { month: "long" })

  // Generate calendar days
  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null) // Empty cells for days before the 1st of the month
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Get tasks for a specific day
  const getTasksForDay = (day: number | null) => {
    if (!day) return []
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return tasks.filter((task) => task.date === dateStr)
  }

  // Get tasks for selected date and sort by start time
  const selectedDateTasks = selectedDate
    ? tasks
        .filter((task) => task.date === selectedDate)
        .sort((a, b) => {
          // Convert time strings to comparable values (assuming 24-hour format)
          return a.startTime.localeCompare(b.startTime)
        })
    : []

  // Handle day click
  const handleDayClick = (day: number | null) => {
    if (!day) return
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(dateStr)
    setShowDayDetails(true)
  }

  // Format selected date for display
  const formatSelectedDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "EEEE, MMMM d, yyyy")
  }

  // Format time for display (convert 24h to 12h format)
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const hour12 = hours % 12 || 12
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 border-red-500 text-red-800"
      case "medium":
        return "bg-amber-100 border-amber-500 text-amber-800"
      case "low":
        return "bg-green-100 border-green-500 text-green-800"
      default:
        return "bg-gray-100 border-gray-500 text-gray-800"
    }
  }

  // Get priority background color
  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50"
      case "medium":
        return "bg-amber-50"
      case "low":
        return "bg-green-50"
      default:
        return "bg-gray-50"
    }
  }

  // Get priority text color
  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-700 border-red-300"
      case "medium":
        return "text-amber-700 border-amber-300"
      case "low":
        return "text-green-700 border-green-300"
      default:
        return "text-gray-700 border-gray-300"
    }
  }

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>
      case "scheduled":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Scheduled</Badge>
      case "pending":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>
      case "recurring":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Recurring</Badge>
      case "completed":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Completed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  // Handle edit task
  const handleEditTask = (taskId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setSelectedTask(task)
      setShowEditTask(true)
    }
  }

  // Handle view task details
  const handleViewTaskDetails = (taskId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setSelectedTask(task)
      setShowTaskDetails(true)
    }
  }

  // Handle reschedule task
  const handleRescheduleTask = (taskId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    toast({
      title: "Task Rescheduled",
      description: "The task has been rescheduled for tomorrow.",
    })

    // In a real app, you would open a date picker and update the task date
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const formattedDate = format(tomorrow, "yyyy-MM-dd")
        return { ...task, date: formattedDate }
      }
      return task
    })

    setTasks(updatedTasks)
  }

  // Handle delegate task
  const handleDelegateTask = (taskId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    toast({
      title: "Task Delegated",
      description: "The task has been delegated to the team.",
    })

    // In a real app, you would open a user picker and update the task assignee
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, assignee: "Team" }
      }
      return task
    })

    setTasks(updatedTasks)
  }

  // Handle mark task as completed
  const handleMarkAsCompleted = (taskId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    toast({
      title: "Task Completed",
      description: "The task has been marked as completed.",
    })

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, status: "completed", completed: true }
      }
      return task
    })

    setTasks(updatedTasks)
  }

  // Check if a task is overdue
  const isTaskOverdue = (task: any) => {
    const today = new Date()
    const taskDate = new Date(task.date)
    return taskDate < today && task.status !== "completed"
  }

  // Get AI suggestions for handling overdue or upcoming tasks
  const getAiSuggestion = (task: any) => {
    if (isTaskOverdue(task)) {
      return {
        suggestion: "This task is overdue. Consider rescheduling or delegating.",
        actions: ["Reschedule", "Delegate", "Mark as completed"],
      }
    } else if (task.priority === "high") {
      return {
        suggestion: "This is a high priority task. Consider starting early to ensure completion.",
        actions: ["Start now", "Set reminder", "Break into subtasks"],
      }
    }
    return null
  }

  // Handle AI suggestion action
  const handleAiAction = (action: string, taskId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    switch (action) {
      case "Reschedule":
        handleRescheduleTask(taskId)
        break
      case "Delegate":
        handleDelegateTask(taskId)
        break
      case "Mark as completed":
        handleMarkAsCompleted(taskId)
        break
      case "Start now":
        toast({
          title: "Task Started",
          description: "You've started working on this task.",
        })
        break
      case "Set reminder":
        toast({
          title: "Reminder Set",
          description: "A reminder has been set for this task.",
        })
        break
      case "Break into subtasks":
        toast({
          title: "Task Breakdown",
          description: "The task has been broken down into subtasks.",
        })
        break
      default:
        break
    }
  }

  // Get category badge
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Work":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            Work
          </Badge>
        )
      case "Personal":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700">
            Personal
          </Badge>
        )
      default:
        return <Badge variant="outline">Other</Badge>
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {monthName} {currentYear}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const tasksForDay = day ? getTasksForDay(day) : []
                  const isToday =
                    day === new Date().getDate() &&
                    currentMonth === new Date().getMonth() &&
                    currentYear === new Date().getFullYear()

                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] border rounded-md p-1 ${
                        day ? "bg-white cursor-pointer hover:bg-gray-50" : "bg-gray-50"
                      } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                      onClick={() => day && handleDayClick(day)}
                    >
                      {day && (
                        <>
                          <div className="text-right text-sm font-medium mb-1">{day}</div>
                          <div className="space-y-1">
                            {tasksForDay.slice(0, 3).map((task) => (
                              <div
                                key={task.id}
                                className={`text-xs p-1 rounded truncate flex items-center ${getPriorityBgColor(
                                  task.priority,
                                )} border`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full mr-1 ${
                                    task.priority === "high"
                                      ? "bg-red-500"
                                      : task.priority === "medium"
                                        ? "bg-amber-500"
                                        : "bg-green-500"
                                  }}`}
                                ></div>
                                {task.title}
                              </div>
                            ))}
                            {tasksForDay.length > 3 && (
                              <div className="text-xs text-gray-500 pl-1">+{tasksForDay.length - 3} more</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                  <h3 className="font-medium text-blue-800 mb-2">Task Management Assistant</h3>
                  <p className="text-sm text-blue-700">
                    AI analysis of your tasks has identified opportunities to optimize your schedule and improve
                    productivity.
                  </p>
                </div>

                {aiSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{suggestion.task}</h3>
                        <p className="text-sm text-gray-700 mt-1">{suggestion.suggestion}</p>
                        <p className="text-xs text-gray-500 mt-2">Reasoning: {suggestion.reasoning}</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {suggestion.confidence}% confidence
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => {
                          toast({
                            title: "Suggestion Applied",
                            description: `Applied: ${suggestion.suggestion}`,
                          })
                        }}
                      >
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Suggestion Modified",
                            description: "You can now customize this suggestion.",
                          })
                        }}
                      >
                        Modify
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          toast({
                            title: "Suggestion Dismissed",
                            description: "This suggestion has been dismissed.",
                          })
                        }}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="mt-6 border-t pt-6">
                  <h3 className="font-medium mb-3">Incomplete Tasks</h3>
                  <div className="space-y-3">
                    {tasks
                      .filter((task) => task.status !== "completed" && isTaskOverdue(task))
                      .slice(0, 3)
                      .map((task) => (
                        <div key={task.id} className="border rounded-lg p-3 bg-red-50 border-red-100">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-red-800">{task.title}</h4>
                            <Badge variant="outline" className="text-red-700 border-red-300">
                              Overdue
                            </Badge>
                          </div>
                          <p className="text-sm text-red-700 mt-1">Due: {format(new Date(task.date), "MMM d, yyyy")}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white"
                              onClick={() => handleRescheduleTask(task.id)}
                            >
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white"
                              onClick={() => handleDelegateTask(task.id)}
                            >
                              Delegate
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white"
                              onClick={() => handleMarkAsCompleted(task.id)}
                            >
                              Mark Complete
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Day Details Dialog */}
      <Dialog open={showDayDetails} onOpenChange={setShowDayDetails}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>{selectedDate && formatSelectedDate(selectedDate)}</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowDayDetails(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-4">
            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No tasks scheduled for this day</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    toast({
                      title: "Add Task",
                      description: "Opening task creation form",
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Task
                </Button>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 ml-6"></div>

                {/* Tasks */}
                <div className="space-y-6 ml-2">
                  {selectedDateTasks.map((task) => (
                    <div key={task.id} className="relative">
                      {/* Time indicator */}
                      <div className="absolute left-0 -ml-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                                ? "bg-amber-500"
                                : "bg-green-500"
                          }`}
                        ></div>
                      </div>

                      {/* Time label */}
                      <div className="ml-8 -mt-1 mb-2">
                        <span className="text-sm font-medium">
                          {formatTime(task.startTime)} - {formatTime(task.endTime)}
                        </span>
                      </div>

                      {/* Task card */}
                      <div className="ml-8">
                        <Card
                          className={`border-l-4 ${
                            task.priority === "high"
                              ? "border-l-red-500"
                              : task.priority === "medium"
                                ? "border-l-amber-500"
                                : "border-l-green-500"
                          }`}
                        >
                          <CardContent className={`p-4 ${getPriorityBgColor(task.priority)}`}>
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-lg">{task.title}</h3>
                              {getStatusBadge(task.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div className="flex items-start">
                                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                                <span className="text-sm">{task.location}</span>
                              </div>

                              <div className="flex items-start">
                                <Users className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                                <span className="text-sm">{task.assignee}</span>
                              </div>
                            </div>

                            <div className="flex gap-2 mt-3">
                              {getCategoryBadge(task.category)}
                              <Badge
                                variant="outline"
                                className={
                                  task.priority === "high"
                                    ? "text-red-700 border-red-300"
                                    : task.priority === "medium"
                                      ? "text-amber-700 border-amber-300"
                                      : "text-green-700 border-green-300"
                                }
                              >
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                              </Badge>
                            </div>

                            {task.description && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm text-gray-700">{task.description}</p>
                              </div>
                            )}

                            {/* AI Suggestions for task management */}
                            {getAiSuggestion(task) && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                                <div className="flex items-start">
                                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                                    <Info className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-blue-800">AI Suggestion</p>
                                    <p className="text-xs text-blue-700 mt-1">{getAiSuggestion(task)?.suggestion}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {getAiSuggestion(task)?.actions.map((action, i) => (
                                        <Button
                                          key={i}
                                          size="sm"
                                          variant="outline"
                                          className="bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                                          onClick={(e) => handleAiAction(action, task.id, e)}
                                        >
                                          {action}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end gap-2 mt-4">
                              <Button size="sm" variant="outline" onClick={(e) => handleEditTask(task.id, e)}>
                                Edit
                              </Button>
                              <Button size="sm" onClick={(e) => handleViewTaskDetails(task.id, e)}>
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setShowDayDetails(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Add Task",
                  description: "Opening task creation form",
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Details Dialog */}
      <Dialog open={showTaskDetails} onOpenChange={setShowTaskDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">{selectedTask.title}</h2>
                {getStatusBadge(selectedTask.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{format(new Date(selectedTask.date), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p>
                    {formatTime(selectedTask.startTime)} - {formatTime(selectedTask.endTime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p>{selectedTask.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Assignee</p>
                  <p>{selectedTask.assignee}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p>{selectedTask.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <p
                    className={
                      selectedTask.priority === "high"
                        ? "text-red-600"
                        : selectedTask.priority === "medium"
                          ? "text-amber-600"
                          : "text-green-600"
                    }
                  >
                    {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1">{selectedTask.description}</p>
              </div>

              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowTaskDetails(false)}>
                  Close
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowTaskDetails(false)
                      handleEditTask(selectedTask.id)
                    }}
                  >
                    Edit
                  </Button>
                  {!selectedTask.completed && (
                    <Button
                      onClick={() => {
                        handleMarkAsCompleted(selectedTask.id)
                        setShowTaskDetails(false)
                      }}
                    >
                      Mark as Completed
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={showEditTask} onOpenChange={setShowEditTask}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Title</p>
                  <input type="text" className="w-full p-2 border rounded-md" defaultValue={selectedTask.title} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Date</p>
                    <input type="date" className="w-full p-2 border rounded-md" defaultValue={selectedTask.date} />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Status</p>
                    <select className="w-full p-2 border rounded-md" defaultValue={selectedTask.status}>
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="recurring">Recurring</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Start Time</p>
                    <input type="time" className="w-full p-2 border rounded-md" defaultValue={selectedTask.startTime} />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">End Time</p>
                    <input type="time" className="w-full p-2 border rounded-md" defaultValue={selectedTask.endTime} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Location</p>
                    <input type="text" className="w-full p-2 border rounded-md" defaultValue={selectedTask.location} />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Assignee</p>
                    <input type="text" className="w-full p-2 border rounded-md" defaultValue={selectedTask.assignee} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Category</p>
                    <select className="w-full p-2 border rounded-md" defaultValue={selectedTask.category}>
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Priority</p>
                    <select className="w-full p-2 border rounded-md" defaultValue={selectedTask.priority}>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <textarea
                    className="w-full p-2 border rounded-md min-h-[100px]"
                    defaultValue={selectedTask.description}
                  />
                </div>
              </div>

              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowEditTask(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Task Updated",
                      description: "Your changes have been saved.",
                    })
                    setShowEditTask(false)
                  }}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
