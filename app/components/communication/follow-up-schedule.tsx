"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Plus } from "lucide-react"

interface FollowUp {
  id: number
  date: string
  time: string
  description: string
  status: "pending" | "completed" | "missed"
}

interface FollowUpScheduleProps {
  taskId: string | number
}

export function FollowUpSchedule({ taskId }: FollowUpScheduleProps) {
  // In a real app, these would be fetched from an API
  const followUps: FollowUp[] = [
    {
      id: 1,
      date: "2024-04-01",
      time: "10:00 AM",
      description: "Check progress on initial draft",
      status: "pending"
    },
    {
      id: 2,
      date: "2024-04-05",
      time: "2:00 PM",
      description: "Review budget breakdown",
      status: "pending"
    }
  ]

  const getStatusColor = (status: FollowUp["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "missed":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Follow-up Schedule</CardTitle>
            <CardDescription>Upcoming follow-ups and reminders</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Follow-up
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {followUps.map((followUp) => (
            <div
              key={followUp.id}
              className="flex items-start space-x-4 p-4 rounded-lg border"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{followUp.date}</span>
                  <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                  <span className="text-sm">{followUp.time}</span>
                </div>
                <p className="mt-2">{followUp.description}</p>
                <div className="mt-2">
                  <span
                    className={`text-sm font-medium capitalize ${getStatusColor(
                      followUp.status
                    )}`}
                  >
                    {followUp.status}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Mark Complete
              </Button>
            </div>
          ))}

          {followUps.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No follow-ups scheduled
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 