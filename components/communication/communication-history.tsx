"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Mail, MessageSquare, Phone, Check, Clock, AlertCircle, RefreshCw, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Communication types and their icons
const COMMUNICATION_TYPES = {
  email: { icon: Mail, color: "bg-blue-100 text-blue-800" },
  message: { icon: MessageSquare, color: "bg-green-100 text-green-800" },
  call: { icon: Phone, color: "bg-purple-100 text-purple-800" },
}

// Communication statuses and their icons
const COMMUNICATION_STATUSES = {
  sent: { icon: Clock, color: "bg-yellow-100 text-yellow-800", label: "Sent" },
  delivered: { icon: Check, color: "bg-blue-100 text-blue-800", label: "Delivered" },
  read: { icon: Check, color: "bg-green-100 text-green-800", label: "Read" },
  failed: { icon: AlertCircle, color: "bg-red-100 text-red-800", label: "Failed" },
  pending: { icon: RefreshCw, color: "bg-gray-100 text-gray-800", label: "Pending" },
}

// Sample communication history data
const SAMPLE_COMMUNICATIONS = [
  {
    id: "comm-1",
    taskId: "task-1",
    type: "email",
    subject: "Task Assignment: Website Redesign",
    content:
      "Hello John, I've assigned you to the website redesign task. Please review the requirements and let me know if you have any questions.",
    sender: {
      id: "user-1",
      name: "Sarah Williams",
      avatar: "/abstract-southwest.png",
    },
    recipient: {
      id: "user-2",
      name: "John Doe",
      avatar: "/green-tractor-field.png",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    status: "read",
    metadata: {
      openedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5), // 1.5 days ago
      responseTime: "4 hours",
    },
  },
  {
    id: "comm-2",
    taskId: "task-1",
    type: "message",
    content: "I've reviewed the requirements and will start working on it today.",
    sender: {
      id: "user-2",
      name: "John Doe",
      avatar: "/green-tractor-field.png",
    },
    recipient: {
      id: "user-1",
      name: "Sarah Williams",
      avatar: "/abstract-southwest.png",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5), // 1.5 days ago
    status: "delivered",
    metadata: {},
  },
  {
    id: "comm-3",
    taskId: "task-1",
    type: "call",
    content: "Discussed design approach and timeline",
    duration: "15 minutes",
    sender: {
      id: "user-1",
      name: "Sarah Williams",
      avatar: "/abstract-southwest.png",
    },
    recipient: {
      id: "user-2",
      name: "John Doe",
      avatar: "/green-tractor-field.png",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: "delivered",
    metadata: {
      notes: "Agreed on using Figma for design collaboration",
    },
  },
  {
    id: "comm-4",
    taskId: "task-1",
    type: "email",
    subject: "Design Progress Update",
    content:
      "Hi Sarah, I've completed the initial wireframes. You can review them in the shared Figma file. Let me know your thoughts.",
    sender: {
      id: "user-2",
      name: "John Doe",
      avatar: "/green-tractor-field.png",
    },
    recipient: {
      id: "user-1",
      name: "Sarah Williams",
      avatar: "/abstract-southwest.png",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    status: "delivered",
    metadata: {},
  },
  {
    id: "comm-5",
    taskId: "task-1",
    type: "message",
    content: "The wireframes look great! Let's discuss the color scheme tomorrow.",
    sender: {
      id: "user-1",
      name: "Sarah Williams",
      avatar: "/abstract-southwest.png",
    },
    recipient: {
      id: "user-2",
      name: "John Doe",
      avatar: "/green-tractor-field.png",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    status: "sent",
    metadata: {},
  },
]

interface CommunicationHistoryProps {
  taskId?: string
  className?: string
}

export function CommunicationHistory({ taskId, className = "" }: CommunicationHistoryProps) {
  const [filter, setFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  // Filter communications by task ID if provided
  const filteredCommunications = SAMPLE_COMMUNICATIONS.filter((comm) => !taskId || comm.taskId === taskId)
    .filter((comm) => filter === "all" || comm.type === filter)
    .sort((a, b) => {
      return sortOrder === "newest"
        ? b.timestamp.getTime() - a.timestamp.getTime()
        : a.timestamp.getTime() - b.timestamp.getTime()
    })

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Communication History</CardTitle>
          <div className="flex space-x-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[130px] h-8">
                <Filter className="h-3.5 w-3.5 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="message">Message</SelectItem>
                <SelectItem value="call">Call</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}>
              <SelectTrigger className="w-[130px] h-8">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredCommunications.length > 0 ? (
              filteredCommunications.map((comm) => {
                const TypeIcon = COMMUNICATION_TYPES[comm.type]?.icon || MessageSquare
                const StatusIcon = COMMUNICATION_STATUSES[comm.status]?.icon || Clock
                const typeColor = COMMUNICATION_TYPES[comm.type]?.color || "bg-gray-100 text-gray-800"
                const statusColor = COMMUNICATION_STATUSES[comm.status]?.color || "bg-gray-100 text-gray-800"

                return (
                  <div key={comm.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0 mt-1">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={comm.sender.avatar || "/placeholder.svg"} alt={comm.sender.name} />
                        <AvatarFallback>
                          {comm.sender.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium">{comm.sender.name}</span>
                        <span className="text-muted-foreground">to</span>
                        <span className="font-medium">{comm.recipient.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(comm.timestamp, { addSuffix: true })}
                        </span>
                        <Badge variant="outline" className={`flex items-center gap-1 ${typeColor} ml-auto`}>
                          <TypeIcon className="h-3 w-3" />
                          <span className="capitalize">{comm.type}</span>
                        </Badge>
                      </div>

                      {comm.subject && <div className="font-medium mb-1">{comm.subject}</div>}

                      <div className="text-sm text-gray-700 mb-2">{comm.content}</div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`flex items-center gap-1 ${statusColor}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{COMMUNICATION_STATUSES[comm.status]?.label || comm.status}</span>
                        </Badge>

                        {comm.type === "call" && comm.duration && (
                          <span className="text-xs text-muted-foreground">Duration: {comm.duration}</span>
                        )}

                        {comm.metadata?.responseTime && (
                          <span className="text-xs text-muted-foreground">
                            Response time: {comm.metadata.responseTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No communication history found</p>
                {filter !== "all" && (
                  <Button variant="link" onClick={() => setFilter("all")} className="mt-2">
                    Clear filter
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
