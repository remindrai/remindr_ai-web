"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, CheckCircle2 } from "lucide-react"

interface CommunicationStatusProps {
  taskId: string | number
}

export function CommunicationStatus({ taskId }: CommunicationStatusProps) {
  // In a real app, these would be fetched from an API
  const stats = {
    totalMessages: 3,
    lastActivity: "2024-03-28T14:20:00Z",
    responseRate: "100%",
    averageResponseTime: "45 minutes",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication Status</CardTitle>
        <CardDescription>Overview of communication activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Messages</span>
            </div>
            <Badge variant="secondary">{stats.totalMessages}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last Activity</span>
            </div>
            <span className="text-sm">
              {new Date(stats.lastActivity).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Response Rate</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {stats.responseRate}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Avg. Response Time</span>
            </div>
            <span className="text-sm">{stats.averageResponseTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 