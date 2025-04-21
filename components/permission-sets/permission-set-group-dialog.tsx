"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface PermissionSet {
  id: number
  name: string
  feature: string
  description: string
}

interface PermissionSetGroup {
  id: number
  name: string
  description: string
  permissionSets: {
    id: number
    name: string
    feature: string
  }[]
  createdAt: string
  updatedAt: string
}

interface PermissionSetGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group: PermissionSetGroup | null
  onSave: (group: PermissionSetGroup) => void
}

export function PermissionSetGroupDialog({ open, onOpenChange, group, onSave }: PermissionSetGroupDialogProps) {
  const [formData, setFormData] = useState<{
    id: number | null
    name: string
    description: string
    permissionSets: number[]
  }>({
    id: null,
    name: "",
    description: "",
    permissionSets: [],
  })

  const [permissionSets, setPermissionSets] = useState<PermissionSet[]>([])
  const [activeTab, setActiveTab] = useState("general")

  // Load permission sets from localStorage
  useEffect(() => {
    const storedSets = localStorage.getItem("permissionSets")
    if (storedSets) {
      setPermissionSets(JSON.parse(storedSets))
    } else {
      // Initialize with sample data if none exists
      const sampleSets: PermissionSet[] = [
        {
          id: 1,
          name: "Tasks View",
          feature: "Tasks",
          description: "Can view tasks",
        },
        {
          id: 2,
          name: "Tasks Create",
          feature: "Tasks",
          description: "Can create tasks",
        },
        {
          id: 3,
          name: "Tasks Edit",
          feature: "Tasks",
          description: "Can edit tasks",
        },
        {
          id: 4,
          name: "Tasks Delete",
          feature: "Tasks",
          description: "Can delete tasks",
        },
        {
          id: 5,
          name: "Calendar View",
          feature: "Calendar",
          description: "Can view calendar",
        },
        {
          id: 6,
          name: "Calendar Create",
          feature: "Calendar",
          description: "Can create calendar events",
        },
        {
          id: 7,
          name: "Users View",
          feature: "Users",
          description: "Can view users",
        },
        {
          id: 8,
          name: "Users Create",
          feature: "Users",
          description: "Can create users",
        },
        {
          id: 9,
          name: "Users Edit",
          feature: "Users",
          description: "Can edit users",
        },
        {
          id: 10,
          name: "Categories View",
          feature: "Categories",
          description: "Can view categories",
        },
        {
          id: 11,
          name: "Categories Create",
          feature: "Categories",
          description: "Can create categories",
        },
        {
          id: 12,
          name: "Profiles View",
          feature: "Profiles",
          description: "Can view profiles",
        },
      ]
      setPermissionSets(sampleSets)
      localStorage.setItem("permissionSets", JSON.stringify(sampleSets))
    }
  }, [])

  // Initialize form data when group changes
  useEffect(() => {
    if (open) {
      if (group) {
        setFormData({
          id: group.id,
          name: group.name,
          description: group.description,
          permissionSets: group.permissionSets.map((set) => set.id),
        })
      } else {
        setFormData({
          id: null,
          name: "",
          description: "",
          permissionSets: [],
        })
      }
      setActiveTab("general")
    }
  }, [group, open])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle permission set selection
  const handlePermissionSetChange = (setId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissionSets: checked ? [...prev.permissionSets, setId] : prev.permissionSets.filter((id) => id !== setId),
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name.trim()) {
      alert("Name is required")
      return
    }

    // Create permission set group object
    const savedGroup: PermissionSetGroup = {
      id: formData.id || 0, // Will be replaced with a new ID if it's a new group
      name: formData.name,
      description: formData.description,
      permissionSets: formData.permissionSets.map((id) => {
        const set = permissionSets.find((s) => s.id === id)
        return {
          id,
          name: set?.name || "",
          feature: set?.feature || "",
        }
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(savedGroup)
  }

  // Group permission sets by feature
  const permissionSetsByFeature = permissionSets.reduce<Record<string, PermissionSet[]>>((acc, set) => {
    if (!acc[set.feature]) {
      acc[set.feature] = []
    }
    acc[set.feature].push(set)
    return acc
  }, {})

  // Get unique features
  const features = Object.keys(permissionSetsByFeature).sort()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{formData.id ? "Edit" : "Add"} Permission Set Group</DialogTitle>
            <DialogDescription>
              Group related permission sets together for easier assignment to profiles.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-5">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General Information</TabsTrigger>
              <TabsTrigger value="permissionSets">Permission Sets</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter group name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter group description"
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="permissionSets" className="py-4">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Select the permission sets to include in this group.
                </div>

                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-6">
                    {features.map((feature) => (
                      <div key={feature} className="space-y-2">
                        <h3 className="font-medium text-primary">{feature}</h3>
                        <div className="space-y-2 ml-2">
                          {permissionSetsByFeature[feature].map((set) => (
                            <div key={set.id} className="flex items-start space-x-2">
                              <Checkbox
                                id={`set-${set.id}`}
                                checked={formData.permissionSets.includes(set.id)}
                                onCheckedChange={(checked) => handlePermissionSetChange(set.id, checked as boolean)}
                              />
                              <div className="space-y-1">
                                <label
                                  htmlFor={`set-${set.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {set.name}
                                </label>
                                <p className="text-xs text-muted-foreground">{set.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex items-center space-x-2 mt-4">
                  <div className="text-sm">
                    Selected: <Badge variant="outline">{formData.permissionSets.length} permission sets</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{formData.id ? "Update" : "Create"} Group</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
