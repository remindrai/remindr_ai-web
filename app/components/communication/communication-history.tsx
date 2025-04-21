"use client"

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Communication {
  id: number
  sender: {
    id: number
    name: string
    avatar?: string
  }
  message: string
  timestamp: string
  attachments?: string[]
}

interface CommunicationHistoryProps {
  taskId: string | number
}

const sampleCommunications: Communication[] = [
  {
    id: 1,
    sender: {
      id: 1,
      name: "John Doe",
      avatar: "/avatars/john.png"
    },
    message: "I've started working on the initial draft. Will share updates by EOD.",
    timestamp: "2024-03-28T10:30:00Z"
  },
  {
    id: 2,
    sender: {
      id: 2,
      name: "Jane Smith",
      avatar: "/avatars/jane.png"
    },
    message: "Thanks for the update. Please make sure to include the budget breakdown as discussed.",
    timestamp: "2024-03-28T11:15:00Z"
  },
  {
    id: 3,
    sender: {
      id: 1,
      name: "John Doe",
      avatar: "/avatars/john.png"
    },
    message: "Will do. I've already prepared the resource allocation section.",
    timestamp: "2024-03-28T14:20:00Z"
  }
]

export function CommunicationHistory({ taskId }: CommunicationHistoryProps) {
  const [newMessage, setNewMessage] = useState("")
  const [communications, setCommunications] = useState<Communication[]>(sampleCommunications)

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newCommunication: Communication = {
      id: communications.length + 1,
      sender: {
        id: 1, // Current user ID (hardcoded for demo)
        name: "John Doe",
        avatar: "/avatars/john.png"
      },
      message: newMessage,
      timestamp: new Date().toISOString()
    }

    setCommunications([...communications, newCommunication])
    setNewMessage("")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Communication History</CardTitle>
        <CardDescription>Task-related messages and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {communications.map((comm) => (
              <div key={comm.id} className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={comm.sender.avatar} />
                  <AvatarFallback>{comm.sender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{comm.sender.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comm.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700">{comm.message}</p>
                  {comm.attachments && comm.attachments.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {comm.attachments.map((attachment, index) => (
                        <Button key={index} variant="outline" size="sm">
                          {attachment}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-4 space-y-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button onClick={handleSendMessage}>
              Send Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 