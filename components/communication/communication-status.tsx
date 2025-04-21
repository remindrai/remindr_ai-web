"use client"

import { useState } from "react"
import { Check, Clock, AlertCircle, RefreshCw, Eye, MessageSquare, Mail, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// Status types and their visual representations
const STATUS_TYPES = {
  sent: { icon: Clock, color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Sent" },
  delivered: { icon: Check, color: "bg-blue-100 text-blue-800 border-blue-200", label: "Delivered" },
  read: { icon: Eye, color: "bg-green-100 text-green-800 border-green-200", label: "Read" },
  responded: { icon: MessageSquare, color: "bg-purple-100 text-purple-800 border-purple-200", label: "Responded" },
  failed: { icon: AlertCircle, color: "bg-red-100 text-red-800 border-red-200", label: "Failed" },
  pending: { icon: RefreshCw, color: "bg-gray-100 text-gray-800 border-gray-200", label: "Pending" },
}

// Communication channels
const CHANNELS = {
  email: { icon: Mail, label: "Email" },
  message: { icon: MessageSquare, label: "Message" },
  call: { icon: Phone, label: "Call" },
}

// Sample data for communication status
const SAMPLE_TASK_COMMUNICATIONS = {
  taskId: "task-1",
  taskName: "Website Redesign",
  overallStatus: "in-progress",
  lastUpdated: "2 hours ago",
  channels: [
    {
      channel: "email",
      status: "read",
      timestamp: "Yesterday at 2:30 PM",
      recipient: "John Doe",
      subject: "Website Redesign Task",
      openRate: 100,
      responseRate: 75,
    },
    {
      channel: "message",
      status: "delivered",
      timestamp: "Today at 9:15 AM",
      recipient: "Design Team",
      subject: "Design Feedback",
      openRate: 80,
      responseRate: 40,
    },
    {
      channel: "call",
      status: "pending",
      timestamp: "Scheduled for tomorrow",
      recipient: "Project Manager",
      subject: "Progress Review",
      openRate: 0,
      responseRate: 0,
    },
  ],
  acknowledgmentStatus: {
    acknowledged: 3,
    total: 5,
    lastAcknowledged: "1 hour ago",
  },
  responseMetrics: {
    averageResponseTime: "4.2 hours",
    responseRate: 80,
    pendingResponses: 1,
  },
}

interface CommunicationStatusProps {
  taskId?: string
  className?: string
}

export function CommunicationStatus({ taskId, className = "" }: CommunicationStatusProps) {
  const [activeTab, setActiveTab] = useState<string>("overview")

  // In a real app, you would fetch this data based on the taskId
  const communicationData = SAMPLE_TASK_COMMUNICATIONS

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>Communication Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Overall Status */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Overall Status</h3>
                <p className="text-xs text-muted-foreground">Last updated {communicationData.lastUpdated}</p>
              </div>
              <Badge variant="outline" className={`${getStatusColor(communicationData.channels[0].status)} px-3 py-1`}>
                {getStatusIcon(communicationData.channels[0].status)}
                <span className="ml-1">{getStatusLabel(communicationData.channels[0].status)}</span>
              </Badge>
            </div>

            {/* Acknowledgment Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Acknowledgment Status</h3>
                <span className="text-sm">
                  {communicationData.acknowledgmentStatus.acknowledged}/{communicationData.acknowledgmentStatus.total}
                </span>
              </div>
              <Progress
                value={
                  (communicationData.acknowledgmentStatus.acknowledged / communicationData.acknowledgmentStatus.total) *
                  100
                }
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                Last acknowledged {communicationData.acknowledgmentStatus.lastAcknowledged}
              </p>
            </div>

            {/* Recent Channel Status */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Recent Channel Status</h3>
              <div className="space-y-2">
                {communicationData.channels.map((channel, index) => {
                  const ChannelIcon = CHANNELS[channel.channel]?.icon || MessageSquare

                  return (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md border">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${getChannelBgColor(channel.channel)}`}>
                          <ChannelIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{CHANNELS[channel.channel]?.label || channel.channel}</p>
                          <p className="text-xs text-muted-foreground">{channel.timestamp}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(channel.status)}>
                        {getStatusIcon(channel.status)}
                        <span className="ml-1">{getStatusLabel(channel.status)}</span>
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="channels" className="space-y-4">
            {communicationData.channels.map((channel, index) => {
              const ChannelIcon = CHANNELS[channel.channel]?.icon || MessageSquare

              return (
                <div key={index} className="p-3 rounded-md border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${getChannelBgColor(channel.channel)}`}>
                        <ChannelIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{CHANNELS[channel.channel]?.label || channel.channel}</p>
                        <p className="text-xs text-muted-foreground">{channel.timestamp}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(channel.status)}>
                      {getStatusIcon(channel.status)}
                      <span className="ml-1">{getStatusLabel(channel.status)}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Recipient</p>
                      <p>{channel.recipient}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Subject</p>
                      <p>{channel.subject}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Open Rate</span>
                        <span>{channel.openRate}%</span>
                      </div>
                      <Progress value={channel.openRate} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Response Rate</span>
                        <span>{channel.responseRate}%</span>
                      </div>
                      <Progress value={channel.responseRate} className="h-1.5" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              )
            })}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-md border text-center">
                <p className="text-xs text-muted-foreground mb-1">Avg. Response Time</p>
                <p className="text-lg font-semibold">{communicationData.responseMetrics.averageResponseTime}</p>
              </div>
              <div className="p-3 rounded-md border text-center">
                <p className="text-xs text-muted-foreground mb-1">Response Rate</p>
                <p className="text-lg font-semibold">{communicationData.responseMetrics.responseRate}%</p>
              </div>
              <div className="p-3 rounded-md border text-center">
                <p className="text-xs text-muted-foreground mb-1">Pending Responses</p>
                <p className="text-lg font-semibold">{communicationData.responseMetrics.pendingResponses}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Communication Effectiveness</h3>
              <div className="p-3 rounded-md border space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Overall Effectiveness</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Most Effective Channel</p>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>Email (92%)</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Least Effective Channel</p>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>Message (45%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Suggested Improvements</h3>
              <div className="p-3 rounded-md border bg-blue-50 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded-full bg-blue-100">
                    <AlertCircle className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Try different timing</p>
                    <p className="text-xs text-blue-700">Sending messages in the morning may improve response rates.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded-full bg-blue-100">
                    <AlertCircle className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Use more direct subject lines</p>
                    <p className="text-xs text-blue-700">Clear, action-oriented subject lines increase open rates.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Helper functions
function getStatusColor(status: string): string {
  return STATUS_TYPES[status]?.color || "bg-gray-100 text-gray-800 border-gray-200"
}

function getStatusLabel(status: string): string {
  return STATUS_TYPES[status]?.label || status
}

function getStatusIcon(status: string) {
  const StatusIcon = STATUS_TYPES[status]?.icon || Clock
  return <StatusIcon className="h-3 w-3" />
}

function getChannelBgColor(channel: string): string {
  const colors = {
    email: "bg-blue-100",
    message: "bg-green-100",
    call: "bg-purple-100",
  }
  return colors[channel] || "bg-gray-100"
}
