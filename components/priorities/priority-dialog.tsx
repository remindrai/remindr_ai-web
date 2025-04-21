"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"

interface Priority {
  id: number
  name: string
  description: string
  color: string
}

interface PriorityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  priority: Priority | null
  onSave: (priority: Omit<Priority, "id">) => void
}

export function PriorityDialog({ open, onOpenChange, priority, onSave }: PriorityDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("bg-red-100 text-red-800")

  useEffect(() => {
    if (priority) {
      setName(priority.name)
      setDescription(priority.description || "")
      setColor(priority.color)
    } else {
      setName("")
      setDescription("")
      setColor("bg-red-100 text-red-800")
    }
  }, [priority, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      description,
      color,
    })
  }

  const colorOptions = [
    { value: "bg-red-100 text-red-800", label: "Red" },
    { value: "bg-yellow-100 text-yellow-800", label: "Yellow" },
    { value: "bg-green-100 text-green-800", label: "Green" },
    { value: "bg-blue-100 text-blue-800", label: "Blue" },
    { value: "bg-purple-100 text-purple-800", label: "Purple" },
    { value: "bg-pink-100 text-pink-800", label: "Pink" },
    { value: "bg-gray-100 text-gray-800", label: "Gray" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{priority ? "Edit Priority" : "Add New Priority"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter priority name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter priority description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex items-center gap-2 mb-2">
                <span>Preview:</span>
                <Badge className={color}>{name || "Priority"}</Badge>
              </div>
              <RadioGroup value={color} onValueChange={setColor} className="grid grid-cols-2 gap-2">
                {colorOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer">
                      <Badge className={option.value}>{option.label}</Badge>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{priority ? "Save Changes" : "Add Priority"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
