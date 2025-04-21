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
import { Textarea } from "@/components/ui/textarea"

interface PromptCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: any
  onSave: (category: any) => void
}

export function PromptCategoryDialog({ open, onOpenChange, category, onSave }: PromptCategoryDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#3b82f6") // Default blue color
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({})

  useEffect(() => {
    if (category) {
      setName(category.name || "")
      setDescription(category.description || "")
      setColor(category.color || "#3b82f6")
    } else {
      setName("")
      setDescription("")
      setColor("#3b82f6")
    }
    setErrors({})
  }, [category, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: { name?: string; description?: string } = {}
    if (!name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!description.trim()) {
      newErrors.description = "Description is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave({
      id: category?.id,
      name,
      description,
      color,
    })
  }

  const predefinedColors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#ef4444", // red
    "#6366f1", // indigo
    "#14b8a6", // teal
    "#f97316", // orange
    "#64748b", // slate
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              {category
                ? "Update the details of this prompt category."
                : "Create a new category for organizing your prompts."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter category description"
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`w-8 h-8 rounded-full ${color === c ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color }}></div>
                <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
