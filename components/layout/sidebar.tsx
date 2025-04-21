"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  Settings,
  UserCircle,
  Briefcase,
  Building,
  Tag,
  Flag,
  Menu,
  ChevronRight,
  Users,
  Shield,
  Lock,
  Layers,
  Search,
  X,
  MessageSquare,
  MessageCircle,
  FolderTree,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SidebarProps {
  sidebarState: "expanded" | "collapsed"
}

export function Sidebar({ sidebarState }: SidebarProps) {
  const pathname = usePathname()
  const [activeCategory, setActiveCategory] = useState<string | null>("tasks")
  const [searchQuery, setSearchQuery] = useState("")
  const isExpanded = sidebarState === "expanded"

  const toggleSidebar = () => {
    const event = new CustomEvent("toggle-sidebar")
    document.dispatchEvent(event)
  }

  const navigationSections = [
    {
      title: "Overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
          href: "/dashboard",
        },
        {
          id: "ai-chat",
          label: "AI Chat",
          icon: <MessageSquare className="h-5 w-5" />,
          href: "/dashboard?showAiChat=true",
        },
        {
          id: "prompts",
          label: "Prompts",
          icon: <MessageCircle className="h-5 w-5" />,
          href: "/prompts",
        },
        {
          id: "prompt-categories",
          label: "Prompt Categories",
          icon: <FolderTree className="h-5 w-5" />,
          href: "/prompt-categories",
        },
      ],
    },
    {
      title: "User Management",
      items: [
        {
          id: "users",
          label: "Users",
          icon: <Users className="h-5 w-5" />,
          href: "/users",
        },
        {
          id: "profiles",
          label: "Profiles",
          icon: <Shield className="h-5 w-5" />,
          href: "/profiles",
        },
        {
          id: "permission-sets",
          label: "Permission Sets",
          icon: <Lock className="h-5 w-5" />,
          href: "/permission-sets",
        },
        {
          id: "permission-set-groups",
          label: "Permission Set Groups",
          icon: <Layers className="h-5 w-5" />,
          href: "/permission-set-groups",
        },
      ],
    },
    {
      title: "Task Management",
      items: [
        {
          id: "tasks",
          label: "Tasks",
          icon: <ListTodo className="h-5 w-5" />,
          href: "/tasks",
        },
        {
          id: "calendar",
          label: "Calendar",
          icon: <Calendar className="h-5 w-5" />,
          href: "/calendar",
        },
        {
          id: "contacts",
          label: "Contacts",
          icon: <UserCircle className="h-5 w-5" />,
          href: "/contacts",
        },
        {
          id: "categories",
          label: "Categories",
          icon: <Tag className="h-5 w-5" />,
          href: "/categories",
        },
        {
          id: "priorities",
          label: "Priorities",
          icon: <Flag className="h-5 w-5" />,
          href: "/priorities",
        },
      ],
    },
    {
      title: "Organization",
      items: [
        {
          id: "groups",
          label: "Groups",
          icon: <Users className="h-5 w-5" />,
          href: "/groups",
        },
        {
          id: "teams",
          label: "Teams",
          icon: <Users className="h-5 w-5" />,
          href: "/teams",
        },
        {
          id: "roles",
          label: "Roles",
          icon: <Briefcase className="h-5 w-5" />,
          href: "/roles",
        },
        {
          id: "departments",
          label: "Departments",
          icon: <Building className="h-5 w-5" />,
          href: "/departments",
        },
        {
          id: "levels",
          label: "Levels",
          icon: <Settings className="h-5 w-5" />,
          href: "/levels",
        },
      ],
    },
  ]

  // Filter navigation items based on search query
  const filteredSections = navigationSections
    .map((section) => {
      const filteredItems = section.items.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
      return {
        ...section,
        items: filteredItems,
      }
    })
    .filter((section) => section.items.length > 0)

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 flex justify-between items-center">
        <div className="font-medium text-sm ml-2">{isExpanded ? "Super Admin" : "SA"}</div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      {/* Search input */}
      <div className="px-3 mb-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={isExpanded ? "Search..." : ""}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn("pl-8 h-9 text-sm", !isExpanded && "w-8 px-0 pl-8")}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSearchQuery("")
            }}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-6">
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <div key={section.title} className="px-3">
                {isExpanded && (
                  <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive =
                      item.id === "ai-chat"
                        ? pathname === "/dashboard" &&
                          typeof window !== "undefined" &&
                          window.location.search.includes("showAiChat=true")
                        : item.id === "dashboard"
                          ? pathname === "/dashboard" &&
                            (typeof window === "undefined" || !window.location.search.includes("showAiChat=true"))
                          : pathname === item.href
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "hover:bg-muted text-muted-foreground hover:text-foreground",
                            !isExpanded && "justify-center px-2",
                            "group",
                          )}
                          onClick={() => setActiveCategory(item.id)}
                        >
                          <span className="flex items-center justify-center w-5 h-5 text-current transition-transform duration-200 ease-in-out group-hover:scale-110">
                            {item.icon}
                          </span>
                          {isExpanded && (
                            <span>{searchQuery ? highlightMatch(item.label, searchQuery) : item.label}</span>
                          )}
                          {isExpanded && isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground text-center">No results found</div>
          )}
        </div>
      </nav>
    </div>
  )
}

// Helper function to highlight matching text
function highlightMatch(text: string, query: string) {
  if (!query) return text

  const parts = text.split(new RegExp(`(${query})`, "gi"))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 text-black rounded-sm px-0.5">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}
