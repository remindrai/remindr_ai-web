"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MessageCircle, Send, X, Minimize2, Maximize2, User, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hi there! I'm Remindr AI Assistant. How can I help you today?",
    role: "assistant",
    timestamp: new Date(),
  },
]

const suggestedQuestions = [
  "How do I create a new task?",
  "Can I set recurring reminders?",
  "How do I share tasks with my team?",
  "What's the difference between categories and priorities?",
]

export function AIChatSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      // Generate AI response based on user input
      let response = ""
      const lowercaseInput = inputValue.toLowerCase()

      if (lowercaseInput.includes("create task") || lowercaseInput.includes("new task")) {
        response =
          "To create a new task, click on the 'Tasks' section in the sidebar, then click the '+ New Task' button in the top right corner. You can then fill in the task details and save it."
      } else if (lowercaseInput.includes("recurring") || lowercaseInput.includes("repeat")) {
        response =
          "Yes, you can set recurring reminders! When creating or editing a task, look for the 'Recurrence' dropdown. You can set tasks to repeat daily, weekly, monthly, or on custom schedules."
      } else if (lowercaseInput.includes("share") || lowercaseInput.includes("team")) {
        response =
          "To share tasks with your team, open the task and click on the 'Share' button. You can then select team members or enter email addresses of people you want to share with."
      } else if (lowercaseInput.includes("categories") && lowercaseInput.includes("priorities")) {
        response =
          "Categories help you organize tasks by type (e.g., Work, Personal), while Priorities indicate urgency (e.g., High, Medium, Low). You can use both to keep your tasks well-organized."
      } else {
        response =
          "I'm here to help with any questions about using Remindr AI. You can ask about creating tasks, setting reminders, organizing your work, or any other feature you'd like to learn more about."
      }

      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  // Voice to text functionality
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser. Try Chrome or Edge.")
      return
    }

    setIsListening(true)

    // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputValue((prev) => prev + " " + transcript)
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-300 shadow-xl rounded-lg overflow-hidden bg-white border border-gray-200",
        isMinimized ? "bottom-4 right-4 w-72 h-14" : "bottom-4 right-4 w-80 sm:w-96 h-[500px] max-h-[80vh]",
      )}
    >
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 rounded-full p-1">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Remindr AI Support</h3>
            {!isMinimized && (
              <div className="flex items-center">
                <Badge variant="success" className="h-2 w-2 rounded-full p-0 mr-1.5 bg-green-400" />
                <span className="text-xs opacity-90">Online</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-blue-700"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-blue-700"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="p-3 overflow-y-auto h-[calc(100%-120px)]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("mb-3 flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div className="flex items-start max-w-[80%]">
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 mr-2 bg-blue-500 text-white">
                      <MessageCircle className="h-4 w-4" />
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg p-3 text-sm",
                      message.role === "user"
                        ? "bg-gray-200 text-gray-800 rounded-tr-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-none",
                    )}
                  >
                    {message.content}
                    <div
                      className={cn("text-xs mt-1 text-gray-500", message.role === "user" ? "text-right" : "text-left")}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 ml-2 bg-gray-500 text-white">
                      <User className="h-4 w-4" />
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="flex items-start max-w-[80%]">
                  <Avatar className="h-8 w-8 mr-2 bg-blue-500 text-white">
                    <MessageCircle className="h-4 w-4" />
                  </Avatar>
                  <div className="bg-white border border-gray-200 text-gray-800 rounded-lg rounded-tl-none p-3">
                    <div className="flex space-x-1">
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions (only show if there are 2 or fewer messages) */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2">
              <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    className="text-xs py-1 h-auto"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex items-end gap-2 relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="min-h-[40px] max-h-[120px] resize-none pr-16"
                rows={1}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={startListening}
                  className={`h-8 w-8 rounded-full ${isListening ? "text-red-500" : "text-gray-400 hover:text-gray-600"}`}
                  aria-label="Voice input"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
