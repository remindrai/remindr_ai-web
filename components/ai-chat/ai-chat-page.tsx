"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, Wand2, X, Table, BarChart, FileText, CreditCard, Calendar, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ai-chat/data-table"
import { BarChartComponent } from "@/components/ai-chat/bar-chart"
import { InfoCard } from "@/components/ai-chat/info-card"

// Prompt templates with dynamic variables
const promptTemplates = [
  {
    id: "table-tasks",
    category: "table",
    icon: <Table className="h-4 w-4" />,
    title: "Show tasks table",
    prompt: "Show me a table of all my tasks due in the next {timeframe}",
    description: "Displays a table of your upcoming tasks",
    variables: [{ name: "timeframe", default: "week", options: ["day", "week", "month"] }],
  },
  {
    id: "table-priorities",
    category: "table",
    icon: <Table className="h-4 w-4" />,
    title: "Priority tasks",
    prompt: "Show me a table of my {priority} priority tasks",
    description: "Lists tasks filtered by priority level",
    variables: [{ name: "priority", default: "high", options: ["high", "medium", "low"] }],
  },
  {
    id: "graph-completion",
    category: "graph",
    icon: <BarChart className="h-4 w-4" />,
    title: "Task completion chart",
    prompt: "Show me a chart of task completion over the past {period}",
    description: "Visualizes your task completion rate",
    variables: [{ name: "period", default: "6 months", options: ["month", "3 months", "6 months", "year"] }],
  },
  {
    id: "graph-distribution",
    category: "graph",
    icon: <BarChart className="h-4 w-4" />,
    title: "Task distribution",
    prompt: "Show me a chart of my tasks distributed by {category}",
    description: "Visualizes how your tasks are distributed",
    variables: [{ name: "category", default: "priority", options: ["priority", "status", "category", "assignee"] }],
  },
  {
    id: "card-summary",
    category: "card",
    icon: <CreditCard className="h-4 w-4" />,
    title: "Task summary card",
    prompt: "Give me a summary card of my tasks for {project}",
    description: "Shows a summary of tasks for a specific project",
    variables: [
      { name: "project", default: "current project", options: ["current project", "all projects", "team projects"] },
    ],
  },
  {
    id: "card-status",
    category: "card",
    icon: <CreditCard className="h-4 w-4" />,
    title: "Project status",
    prompt: "Show me a status card for the {projectName} project",
    description: "Displays the current status of a project",
    variables: [
      {
        name: "projectName",
        default: "Marketing Campaign",
        options: ["Marketing Campaign", "Website Redesign", "Product Launch"],
      },
    ],
  },
  {
    id: "report-weekly",
    category: "report",
    icon: <FileText className="h-4 w-4" />,
    title: "Weekly report",
    prompt: "Generate a weekly report for {department} ending {date}",
    description: "Creates a comprehensive weekly report",
    variables: [
      { name: "department", default: "Marketing", options: ["Marketing", "Sales", "Development", "Design"] },
      { name: "date", default: "today", options: ["today", "yesterday", "last Friday"] },
    ],
  },
  {
    id: "report-performance",
    category: "report",
    icon: <FileText className="h-4 w-4" />,
    title: "Performance report",
    prompt: "Create a performance report for {team} team during {quarter}",
    description: "Analyzes team performance for a specific period",
    variables: [
      { name: "team", default: "Marketing", options: ["Marketing", "Sales", "Development", "Design"] },
      { name: "quarter", default: "Q2 2023", options: ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023"] },
    ],
  },
  {
    id: "calendar-events",
    category: "table",
    icon: <Calendar className="h-4 w-4" />,
    title: "Calendar events",
    prompt: "Show me all calendar events for {timeRange}",
    description: "Lists upcoming calendar events",
    variables: [{ name: "timeRange", default: "next week", options: ["today", "tomorrow", "next week", "this month"] }],
  },
  {
    id: "team-availability",
    category: "table",
    icon: <Users className="h-4 w-4" />,
    title: "Team availability",
    prompt: "Show me the availability of {teamName} team for {day}",
    description: "Displays team member availability",
    variables: [
      { name: "teamName", default: "Design", options: ["Design", "Development", "Marketing", "Sales"] },
      { name: "day", default: "today", options: ["today", "tomorrow", "this week"] },
    ],
  },
  {
    id: "time-tracking",
    category: "graph",
    icon: <Clock className="h-4 w-4" />,
    title: "Time tracking",
    prompt: "Show me a chart of time spent on {projectType} projects in {month}",
    description: "Visualizes time spent on different projects",
    variables: [
      { name: "projectType", default: "all", options: ["all", "client", "internal", "development"] },
      { name: "month", default: "this month", options: ["this month", "last month", "Q2", "Q3"] },
    ],
  },
]

// Mock data for demonstration
const MOCK_TASKS = [
  { id: 1, title: "Complete project proposal", status: "In Progress", dueDate: "2023-05-15", priority: "High" },
  { id: 2, title: "Review marketing materials", status: "Completed", dueDate: "2023-05-10", priority: "Medium" },
  { id: 3, title: "Prepare presentation", status: "Not Started", dueDate: "2023-05-20", priority: "High" },
  { id: 4, title: "Client meeting", status: "In Progress", dueDate: "2023-05-12", priority: "Medium" },
  { id: 5, title: "Update documentation", status: "Not Started", dueDate: "2023-05-25", priority: "Low" },
  { id: 6, title: "Team review", status: "Completed", dueDate: "2023-05-08", priority: "Medium" },
  { id: 7, title: "Budget planning", status: "In Progress", dueDate: "2023-05-18", priority: "High" },
  { id: 8, title: "Vendor negotiation", status: "Not Started", dueDate: "2023-05-30", priority: "Medium" },
  { id: 9, title: "Quality assurance", status: "Completed", dueDate: "2023-05-05", priority: "High" },
  { id: 10, title: "Resource allocation", status: "In Progress", dueDate: "2023-05-22", priority: "Medium" },
]

const CHART_DATA = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 280 },
  { name: "May", value: 590 },
  { name: "Jun", value: 320 },
]

// Types for messages
type MessageType = "text" | "table" | "chart" | "card"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type: MessageType
  data?: any
}

export function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI assistant. How can I help you with your tasks today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showPrompts, setShowPrompts] = useState(false)
  const [filteredPrompts, setFilteredPrompts] = useState(promptTemplates)
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0)
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "tables" | "charts" | "cards" | "reports" | "saved">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [savedTemplates, setSavedTemplates] = useState<typeof promptTemplates>([
    {
      id: "saved-weekly-report",
      category: "saved",
      icon: <FileText className="h-4 w-4" />,
      title: "My Weekly Report",
      prompt: "Generate a weekly report for Marketing ending today",
      description: "My custom weekly report template",
      variables: [
        { name: "department", default: "Marketing", options: ["Marketing", "Sales", "Development", "Design"] },
        { name: "date", default: "today", options: ["today", "yesterday", "last Friday"] },
      ],
    },
    {
      id: "saved-high-priority",
      category: "saved",
      icon: <Table className="h-4 w-4" />,
      title: "High Priority Tasks",
      prompt: "Show me a table of my high priority tasks due this week",
      description: "Quick view of urgent tasks",
      variables: [{ name: "priority", default: "high", options: ["high", "medium", "low"] }],
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const promptsRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Handle clicks outside the prompts dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        promptsRef.current &&
        !promptsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowPrompts(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter prompts when input changes
  useEffect(() => {
    // We no longer need to check for "/" since we're using Ctrl+Space
    if (showPrompts) {
      const searchTerm = inputValue.toLowerCase()
      const filtered = promptTemplates.filter(
        (template) =>
          template.title.toLowerCase().includes(searchTerm) ||
          template.category.toLowerCase().includes(searchTerm) ||
          template.description.toLowerCase().includes(searchTerm),
      )
      setFilteredPrompts(filtered)
      setSelectedPromptIndex(0)
    }
  }, [inputValue, showPrompts])

  // Handle keyboard navigation for prompts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Show prompts when Ctrl+Space is pressed
    if (e.key === " " && e.ctrlKey) {
      e.preventDefault()
      setShowPrompts(true)
      setSearchTerm("")
      return
    }

    if (showPrompts) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedPromptIndex((prev) => (prev + 1) % filteredPrompts.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedPromptIndex((prev) => (prev - 1 + filteredPrompts.length) % filteredPrompts.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        insertPrompt(filteredPrompts[selectedPromptIndex])
      } else if (e.key === "Escape") {
        e.preventDefault()
        setShowPrompts(false)
      } else if (e.key === "Tab") {
        e.preventDefault()
        if (e.shiftKey) {
          // Shift+Tab: go to previous tab
          setActiveTab((prev) => {
            const tabs = ["all", "tables", "charts", "cards", "reports", "saved"] as const
            const currentIndex = tabs.indexOf(prev)
            return tabs[(currentIndex - 1 + tabs.length) % tabs.length]
          })
        } else {
          // Tab: go to next tab
          setActiveTab((prev) => {
            const tabs = ["all", "tables", "charts", "cards", "reports", "saved"] as const
            const currentIndex = tabs.indexOf(prev)
            return tabs[(currentIndex + 1) % tabs.length]
          })
        }
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      let responseMessage: Message

      // Check for specific commands to show different content types
      if (inputValue.toLowerCase().includes("task") || inputValue.toLowerCase().includes("list")) {
        responseMessage = {
          id: (Date.now() + 1).toString(),
          content: "Here are your current tasks:",
          sender: "ai",
          timestamp: new Date(),
          type: "table",
          data: {
            columns: [
              { accessorKey: "id", header: "ID" },
              { accessorKey: "title", header: "Task" },
              { accessorKey: "status", header: "Status" },
              { accessorKey: "dueDate", header: "Due Date" },
              { accessorKey: "priority", header: "Priority" },
            ],
            data: MOCK_TASKS,
          },
        }
      } else if (
        inputValue.toLowerCase().includes("chart") ||
        inputValue.toLowerCase().includes("graph") ||
        inputValue.toLowerCase().includes("progress")
      ) {
        responseMessage = {
          id: (Date.now() + 1).toString(),
          content: "Here's a chart of your task completion over time:",
          sender: "ai",
          timestamp: new Date(),
          type: "chart",
          data: CHART_DATA,
        }
      } else if (inputValue.toLowerCase().includes("summary") || inputValue.toLowerCase().includes("overview")) {
        responseMessage = {
          id: (Date.now() + 1).toString(),
          content: "Here's a summary of your current workload:",
          sender: "ai",
          timestamp: new Date(),
          type: "card",
          data: {
            title: "Task Summary",
            description: "Your current workload at a glance",
            stats: [
              { label: "Total Tasks", value: "24" },
              { label: "Completed", value: "8" },
              { label: "In Progress", value: "12" },
              { label: "Not Started", value: "4" },
            ],
          },
        }
      } else {
        responseMessage = {
          id: (Date.now() + 1).toString(),
          content:
            "I can help you with that! You can ask me to show tasks, display charts, or provide summaries. Just let me know what you need.",
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        }
      }

      setMessages((prev) => [...prev, responseMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser doesn't support speech recognition. Try Chrome.")
      return
    }

    setIsRecording(!isRecording)

    if (!isRecording) {
      const SpeechRecognition = window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsRecording(true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognition.start()
    }
  }

  // Insert a prompt template into the input field
  const insertPrompt = (template: (typeof promptTemplates)[0]) => {
    let promptText = template.prompt

    // Replace variables with their default values
    template.variables.forEach((variable) => {
      promptText = promptText.replace(`{${variable.name}}`, variable.default)
    })

    setInputValue(promptText)
    setShowPrompts(false)

    // Focus the input and place cursor at the end
    if (inputRef.current) {
      inputRef.current.focus()
      const length = promptText.length
      setTimeout(() => {
        inputRef.current?.setSelectionRange(length, length)
      }, 0)
    }
  }

  // Improve the current prompt using AI
  const improvePrompt = () => {
    if (!inputValue.trim()) return

    setIsImprovingPrompt(true)

    // Simulate AI improving the prompt
    setTimeout(() => {
      const currentPrompt = inputValue.trim()

      // Simple prompt improvements
      let improvedPrompt = currentPrompt

      // Add specificity
      if (currentPrompt.toLowerCase().includes("show") && !currentPrompt.toLowerCase().includes("show me")) {
        improvedPrompt = currentPrompt.replace(/show/i, "Show me")
      }

      // Add time frames if missing
      if (
        currentPrompt.toLowerCase().includes("tasks") &&
        !currentPrompt.toLowerCase().includes("week") &&
        !currentPrompt.toLowerCase().includes("month") &&
        !currentPrompt.toLowerCase().includes("today")
      ) {
        improvedPrompt += " for this week"
      }

      // Add sorting preference
      if (currentPrompt.toLowerCase().includes("table") && !currentPrompt.toLowerCase().includes("sort")) {
        improvedPrompt += " sorted by due date"
      }

      // Add visualization preference
      if (
        currentPrompt.toLowerCase().includes("chart") &&
        !currentPrompt.toLowerCase().includes("bar") &&
        !currentPrompt.toLowerCase().includes("pie")
      ) {
        improvedPrompt += " as a bar chart"
      }

      // Make language more precise
      improvedPrompt = improvedPrompt
        .replace(/(?:^|\s)(?:give|provide|display)(?:\s|$)/gi, " show me ")
        .replace(/(?:^|\s)(?:all|every)(?:\s|$)/gi, " all ")
        .replace(/(?:^|\s)(?:stats|statistics)(?:\s|$)/gi, " metrics ")

      // Capitalize first letter
      improvedPrompt = improvedPrompt.charAt(0).toUpperCase() + improvedPrompt.slice(1)

      // Add a period at the end if missing
      if (!improvedPrompt.endsWith(".") && !improvedPrompt.endsWith("?") && !improvedPrompt.endsWith("!")) {
        improvedPrompt += "."
      }

      setInputValue(improvedPrompt)
      setIsImprovingPrompt(false)
    }, 800)
  }

  // Function to render different message types
  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case "text":
        return <p className="whitespace-pre-wrap">{message.content}</p>
      case "table":
        return (
          <div className="mt-2">
            <p className="mb-2">{message.content}</p>
            <DataTable columns={message.data.columns} data={message.data.data} />
          </div>
        )
      case "chart":
        return (
          <div className="mt-2">
            <p className="mb-2">{message.content}</p>
            <div className="h-80 w-full">
              <BarChartComponent data={message.data} />
            </div>
          </div>
        )
      case "card":
        return (
          <div className="mt-2">
            <p className="mb-2">{message.content}</p>
            <InfoCard title={message.data.title} description={message.data.description} stats={message.data.stats} />
          </div>
        )
      default:
        return <p>{message.content}</p>
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your AI assistant. How can I help you with your tasks today?",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      },
    ])
  }

  const handlePrintMessage = (messageId: string) => {
    // Create a new window for printing just this message
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const message = messages.find((m) => m.id === messageId)
    if (!message) return

    // Get current date and time for the header
    const printDate = new Date().toLocaleString()

    // Create the print content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Remindr AI - Chat Message</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .print-header {
            text-align: center;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .message {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .message-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
            margin-bottom: 10px;
            font-size: 14px;
            color: #666;
          }
          .message-content {
            margin-top: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .print-footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>Remindr AI Chat</h1>
          <p>Printed on ${printDate}</p>
        </div>
        
        <div class="message">
          <div class="message-header">
            <span>${message.sender === "user" ? "You" : "AI Assistant"}</span>
            <span>${message.timestamp.toLocaleString()}</span>
          </div>
          <div class="message-content">
            ${message.content}
            ${message.type === "table" ? renderTableForPrint(message.data) : ""}
          </div>
        </div>
        
        <div class="print-footer">
          <p>Generated by Remindr AI</p>
        </div>
        
        <script>
          // Auto print and then close
          window.onload = function() {
            window.print();
            // Uncomment the line below if you want the print window to close automatically after printing
            // window.setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `)

    printWindow.document.close()
  }

  // Helper function to render tables for printing
  const renderTableForPrint = (data: any) => {
    if (!data || !data.columns || !data.data) return ""

    const headers = data.columns.map((col: any) => col.header || "").join("</th><th>")

    let rows = ""
    data.data.forEach((row: any) => {
      let cells = ""
      data.columns.forEach((col: any) => {
        const key = col.accessorKey as string
        cells += `<td>${row[key]}</td>`
      })
      rows += `<tr>${cells}</tr>`
    })

    return `
      <table>
        <thead>
          <tr><th>${headers}</th></tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `
  }

  return (
    <>
      <style jsx global>{`
        /* Custom print styles */
        @media print {
          /* Hide non-printable elements */
          .no-print {
            display: none !important;
          }
          
          /* Reset page margins */
          @page {
            margin: 0.5cm;
          }
          
          /* General styling for print */
          body {
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            background: white;
            color: black;
          }
          
          /* Make sure the chat container takes full width */
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            overflow: visible !important;
            height: auto !important;
          }
          
          /* Style message bubbles for print */
          .message-bubble {
            border: 1px solid #ddd !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            background: white !important;
            color: black !important;
            max-width: 100% !important;
          }
          
          /* Ensure tables print well */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          
          th, td {
            border: 1px solid #ddd !important;
            padding: 8px !important;
            text-align: left !important;
            color: black !important;
            background: white !important;
          }
          
          th {
            background-color: #f2f2f2 !important;
            font-weight: bold !important;
          }
          
          /* Add page breaks where needed */
          .page-break {
            page-break-after: always;
          }
          
          /* Ensure charts print properly */
          .chart-container {
            page-break-inside: avoid;
            max-width: 100% !important;
            height: auto !important;
          }
          
          /* Add header and footer to printed pages */
          .print-header, .print-footer {
            display: block !important;
            text-align: center;
            padding: 10px;
          }
          
          .print-header {
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
          }
          
          .print-footer {
            border-top: 1px solid #ddd;
            margin-top: 20px;
          }
        }
      `}</style>

      <div className="w-full max-w-full py-4">
        <div className="bg-blue-50 p-3 mb-4 rounded-md no-print">
          <h2 className="text-base font-medium text-blue-800">Ask me anything about your tasks, schedules, or data</h2>
        </div>

        {/* Hidden elements that only show when printing */}
        <div className="print-header hidden">
          <h1>Remindr AI Chat Conversation</h1>
          <p>Printed on {new Date().toLocaleString()}</p>
        </div>

        <div className="flex flex-col h-[calc(100vh-220px)]">
          <div
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto mb-4 px-2 scroll-smooth print-container"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.map((message) => (
              <div key={message.id} className={`mb-4 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block max-w-[85%] p-3 rounded-lg border border-gray-200 message-bubble ${
                    message.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 border-b pb-1">
                    <span
                      className={`text-xs font-medium ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}
                    >
                      {message.sender === "user" ? "You" : "AI Assistant"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePrintMessage(message.id)}
                        className={`text-xs hover:underline no-print ${
                          message.sender === "user" ? "text-blue-100" : "text-gray-500"
                        }`}
                        title="Print this message"
                      >
                        Print
                      </button>
                      <span className={`text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-400"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                  <div className="message-content">{renderMessageContent(message)}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-4 no-print">
                <div className="inline-block max-w-[85%] p-3 rounded-lg bg-gray-100">
                  <div className="flex space-x-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="sticky bottom-0 bg-white pt-2 no-print">
            <div className="flex items-center gap-2 mb-3 relative">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Press Ctrl+Space for prompts or ask a question..."
                  className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
                />

                {/* Magic wand button */}
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className={`absolute right-10 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full ${
                    isImprovingPrompt ? "text-purple-500" : "text-gray-400 hover:text-purple-500"
                  }`}
                  onClick={improvePrompt}
                  disabled={!inputValue.trim() || isImprovingPrompt}
                  title="Improve prompt with AI"
                >
                  <Wand2 className={`h-4 w-4 ${isImprovingPrompt ? "animate-pulse" : ""}`} />
                  <span className="sr-only">Improve prompt</span>
                </Button>

                {/* Voice input button */}
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full ${
                    isRecording ? "text-red-500" : "text-gray-400"
                  }`}
                  onClick={handleVoiceInput}
                  title="Voice input"
                >
                  <Mic className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
                  <span className="sr-only">Voice input</span>
                </Button>

                {/* Prompt suggestions dropdown */}
                {showPrompts && (
                  <div
                    ref={promptsRef}
                    className="absolute bottom-full left-0 mb-1 w-full bg-white rounded-md border border-gray-200 shadow-lg z-50 max-h-96 overflow-hidden flex flex-col"
                  >
                    {/* Tabs navigation */}
                    <div className="flex border-b border-gray-200 bg-gray-50 px-2 pt-2">
                      <button
                        className={`px-3 py-2 text-sm font-medium rounded-t-md ${
                          activeTab === "all"
                            ? "bg-white border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => {
                          setActiveTab("all")
                          setSearchTerm("")
                        }}
                      >
                        All
                      </button>
                      <button
                        className={`px-3 py-2 text-sm font-medium rounded-t-md ${
                          activeTab === "tables"
                            ? "bg-white border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => {
                          setActiveTab("tables")
                          setSearchTerm("")
                        }}
                      >
                        Tables
                      </button>
                      <button
                        className={`px-3 py-2 text-sm font-medium rounded-t-md ${
                          activeTab === "charts"
                            ? "bg-white border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => {
                          setActiveTab("charts")
                          setSearchTerm("")
                        }}
                      >
                        Charts
                      </button>
                      <button
                        className={`px-3 py-2 text-sm font-medium rounded-t-md ${
                          activeTab === "cards"
                            ? "bg-white border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => {
                          setActiveTab("cards")
                          setSearchTerm("")
                        }}
                      >
                        Cards
                      </button>
                      <button
                        className={`px-3 py-2 text-sm font-medium rounded-t-md ${
                          activeTab === "reports"
                            ? "bg-white border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => {
                          setActiveTab("reports")
                          setSearchTerm("")
                        }}
                      >
                        Reports
                      </button>
                      <button
                        className={`px-3 py-2 text-sm font-medium rounded-t-md ${
                          activeTab === "saved"
                            ? "bg-white border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => {
                          setActiveTab("saved")
                          setSearchTerm("")
                        }}
                      >
                        Saved
                      </button>
                    </div>

                    {/* Header with search and close button */}
                    <div className="p-2 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex-1 mr-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pl-8"
                            autoFocus
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                          {searchTerm && (
                            <button
                              onClick={() => setSearchTerm("")}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowPrompts(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Templates list */}
                    <div className="p-1 overflow-y-auto">
                      {(() => {
                        // Filter templates based on active tab and search term
                        let displayTemplates =
                          activeTab === "all"
                            ? [...promptTemplates, ...savedTemplates]
                            : activeTab === "saved"
                              ? savedTemplates
                              : promptTemplates.filter((t) => t.category === activeTab)

                        // Apply search filter from the search input
                        if (searchTerm) {
                          displayTemplates = displayTemplates.filter(
                            (template) =>
                              template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              template.prompt.toLowerCase().includes(searchTerm.toLowerCase()),
                          )
                        }

                        if (displayTemplates.length > 0) {
                          return displayTemplates.map((prompt, index) => (
                            <div
                              key={prompt.id}
                              className={`flex items-center gap-2 p-2 text-sm rounded-md cursor-pointer ${
                                selectedPromptIndex === index && activeTab === "all" ? "bg-blue-50" : "hover:bg-gray-50"
                              }`}
                              onClick={() => insertPrompt(prompt)}
                            >
                              <div className="text-gray-500">{prompt.icon}</div>
                              <div className="flex-1">
                                <div className="font-medium">{prompt.title}</div>
                                <div className="text-xs text-gray-500">{prompt.description}</div>
                              </div>
                              {activeTab === "saved" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Here you would add logic to edit the saved template
                                    // For now we'll just log it
                                    console.log("Edit template:", prompt.id)
                                  }}
                                >
                                  <span className="sr-only">Edit</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-pencil"
                                  >
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                  </svg>
                                </Button>
                              )}
                            </div>
                          ))
                        } else {
                          return (
                            <div className="p-4 text-sm text-center text-gray-500">
                              {searchTerm ? (
                                <>
                                  No templates found for "<span className="font-medium">{searchTerm}</span>"
                                  <p className="text-xs mt-1">Try a different search term or category</p>
                                </>
                              ) : (
                                "No templates available in this category"
                              )}
                            </div>
                          )
                        }
                      })()}
                    </div>

                    {/* Add template button (only in saved tab) */}
                    {activeTab === "saved" && (
                      <div className="p-2 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-sm"
                          onClick={() => {
                            // Here you would add logic to save the current prompt as a template
                            console.log("Save current prompt as template")
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-plus mr-1"
                          >
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                          </svg>
                          Save Current Prompt
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="rounded-full h-10 w-10 bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="h-5 w-5 text-white" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden footer that only shows when printing */}
        <div className="print-footer hidden">
          <p>Generated by Remindr AI - {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </>
  )
}
