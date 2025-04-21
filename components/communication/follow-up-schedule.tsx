"use client"

import { useState } from "react"
import { Clock, Plus, Trash2, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

// Communication channels
const COMMUNICATION_CHANNELS = [
  { id: "app", label: "App Notification", icon: "💬" },
  { id: "email", label: "Email", icon: "📧" },
  { id: "sms", label: "SMS", icon: "📱" },
  { id: "whatsapp", label: "WhatsApp", icon: "📲" },
  { id: "call", label: "Phone Call", icon: "📞" },
]

// Predefined follow-up schedules
const PREDEFINED_SCHEDULES = [
  {
    id: "gentle",
    name: "Gentle Reminder",
    description: "Spaced out reminders with friendly tone",
    schedule: [
      { days: 3, channel: "app", message: "Friendly reminder about your task" },
      { days: 7, channel: "email", message: "Following up on your task" },
      { days: 14, channel: "whatsapp", message: "Checking in on your progress" },
    ],
  },
  {
    id: "standard",
    name: "Standard Follow-up",
    description: "Balanced approach for most tasks",
    schedule: [
      { days: 2, channel: "app", message: "Reminder about your assigned task" },
      { days: 4, channel: "email", message: "Following up on task progress" },
      { days: 7, channel: "sms", message: "Please update task status" },
    ],
  },
  {
    id: "urgent",
    name: "Urgent Priority",
    description: "Frequent reminders for time-sensitive tasks",
    schedule: [
      { days: 1, channel: "app", message: "Urgent reminder: task requires attention" },
      { days: 2, channel: "email", message: "Important follow-up on urgent task" },
      { days: 3, channel: "call", message: "Critical task requires immediate action" },
    ],
  },
  {
    id: "custom",
    name: "Custom Schedule",
    description: "Create your own follow-up schedule",
    schedule: [],
  },
]

interface FollowUpScheduleProps {
  taskId?: string
  className?: string
  onSave?: (schedule: any) => void
}

export function FollowUpSchedule({ taskId, className = "", onSave }: FollowUpScheduleProps) {
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("standard")
  const [enableAiOptimization, setEnableAiOptimization] = useState<boolean>(true)
  const [customSchedule, setCustomSchedule] = useState<any[]>([
    { days: 2, channel: "app", message: "Reminder about your task" },
    { days: 5, channel: "email", message: "Following up on your task" },
    { days: 10, channel: "whatsapp", message: "Please update your task status" },
  ])

  // Get the current schedule based on selection
  const currentSchedule =
    selectedScheduleId === "custom"
      ? customSchedule
      : PREDEFINED_SCHEDULES.find((s) => s.id === selectedScheduleId)?.schedule || []

  // Add a new follow-up step to custom schedule
  const addFollowUpStep = () => {
    const lastStep = customSchedule[customSchedule.length - 1]
    const newDays = lastStep ? lastStep.days + 3 : 2

    setCustomSchedule([
      ...customSchedule,
      {
        days: newDays,
        channel: "app",
        message: "Follow-up reminder",
      },
    ])
  }

  // Remove a follow-up step from custom schedule
  const removeFollowUpStep = (index: number) => {
    setCustomSchedule(customSchedule.filter((_, i) => i !== index))
  }

  // Update a custom follow-up step
  const updateFollowUpStep = (index: number, field: string, value: any) => {
    const updatedSchedule = [...customSchedule]
    updatedSchedule[index] = { ...updatedSchedule[index], [field]: value }
    setCustomSchedule(updatedSchedule)
  }

  // Handle saving the schedule
  const handleSave = () => {
    if (onSave) {
      onSave({
        scheduleId: selectedScheduleId,
        enableAiOptimization,
        schedule: selectedScheduleId === "custom" ? customSchedule : currentSchedule,
      })
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Follow-up Schedule</CardTitle>
            <CardDescription className="mt-1">
              Configure when and how to follow up if no response is received
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                <p>Follow-ups are triggered only if the recipient doesn't respond to the initial communication.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Schedule Template Selection */}
          <div className="space-y-2">
            <Label>Schedule Template</Label>
            <Select value={selectedScheduleId} onValueChange={setSelectedScheduleId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a follow-up schedule" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_SCHEDULES.map((schedule) => (
                  <SelectItem key={schedule.id} value={schedule.id}>
                    <div className="flex flex-col">
                      <span>{schedule.name}</span>
                      <span className="text-xs text-muted-foreground">{schedule.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* AI Optimization Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ai-optimization">AI-optimized timing</Label>
              <p className="text-xs text-muted-foreground">
                Automatically adjust follow-up timing based on recipient behavior
              </p>
            </div>
            <Switch id="ai-optimization" checked={enableAiOptimization} onCheckedChange={setEnableAiOptimization} />
          </div>

          {/* Follow-up Schedule Display */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Follow-up Steps</Label>
              {selectedScheduleId === "custom" && (
                <Button variant="outline" size="sm" onClick={addFollowUpStep}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Step
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {currentSchedule.map((step, index) => {
                const channel = COMMUNICATION_CHANNELS.find((c) => c.id === step.channel)

                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-md border bg-muted/40">
                    <div className="flex-shrink-0 flex flex-col items-center justify-center">
                      <div className="text-2xl mb-1">{channel?.icon || "📩"}</div>
                      <Badge variant="outline" className="text-xs">
                        Day {step.days}
                      </Badge>
                    </div>

                    <div className="flex-1 min-w-0">
                      {selectedScheduleId === "custom" ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Select
                              value={step.channel}
                              onValueChange={(value) => updateFollowUpStep(index, "channel", value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Channel" />
                              </SelectTrigger>
                              <SelectContent>
                                {COMMUNICATION_CHANNELS.map((channel) => (
                                  <SelectItem key={channel.id} value={channel.id}>
                                    <span>
                                      {channel.icon} {channel.label}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <div className="flex items-center gap-1">
                              <Label className="text-xs whitespace-nowrap">Day:</Label>
                              <Input
                                type="number"
                                min="1"
                                max="30"
                                value={step.days}
                                onChange={(e) =>
                                  updateFollowUpStep(index, "days", Number.parseInt(e.target.value) || 1)
                                }
                                className="h-8 w-16"
                              />
                            </div>
                          </div>

                          <Input
                            value={step.message}
                            onChange={(e) => updateFollowUpStep(index, "message", e.target.value)}
                            placeholder="Follow-up message"
                            className="h-8"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium">{channel?.label || step.channel}</div>
                          <div className="text-sm text-muted-foreground mt-1">{step.message}</div>
                        </div>
                      )}
                    </div>

                    {selectedScheduleId === "custom" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFollowUpStep(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              })}

              {currentSchedule.length === 0 && (
                <div className="py-8 text-center text-muted-foreground border rounded-md">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No follow-up steps configured</p>
                  {selectedScheduleId === "custom" && (
                    <Button variant="link" onClick={addFollowUpStep} className="mt-2">
                      Add your first follow-up step
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Intelligent Timing Section */}
          {enableAiOptimization && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Intelligent Timing Active</h4>
                  <p className="text-xs text-blue-700 mt-0.5">
                    The system will automatically adjust follow-up timing based on:
                  </p>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1 list-disc pl-4">
                    <li>Recipient's past response patterns</li>
                    <li>Time zone differences</li>
                    <li>Working hours preferences</li>
                    <li>Task priority and urgency</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <Button onClick={handleSave} className="w-full">
            Save Follow-up Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
