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

interface Department {
  id: number
  name: string
  description: string
  headOfDepartment: string
  location: string
  budget: string
  memberCount: number
  color: string
}

interface DepartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  department: Department | null
  onSave: (department: Omit<Department, "id" | "memberCount">) => void
}

export function DepartmentDialog({ open, onOpenChange, department, onSave }: DepartmentDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [headOfDepartment, setHeadOfDepartment] = useState("")
  const [location, setLocation] = useState("")
  const [budget, setBudget] = useState("")
  const [color, setColor] = useState("bg-blue-100 text-blue-800")

  useEffect(() => {
    if (department) {
      setName(department.name)
      setDescription(department.description || "")
      setHeadOfDepartment(department.headOfDepartment || "")
      setLocation(department.location || "")
      setBudget(department.budget || "")
      setColor(department.color)
    } else {
      setName("")
      setDescription("")
      setHeadOfDepartment("")
      setLocation("")
      setBudget("")
      setColor("bg-blue-100 text-blue-800")
    }
  }, [department, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      description,
      headOfDepartment,
      location,
      budget,
      color,
    })
  }

  const colorOptions = [
    { value: "bg-blue-100 text-blue-800", label: "Blue" },
    { value: "bg-purple-100 text-purple-800", label: "Purple" },
    { value: "bg-green-100 text-green-800", label: "Green" },
    { value: "bg-red-100 text-red-800", label: "Red" },
    { value: "bg-yellow-100 text-yellow-800", label: "Yellow" },
    { value: "bg-orange-100 text-orange-800", label: "Orange" },
    { value: "bg-indigo-100 text-indigo-800", label: "Indigo" },
    { value: "bg-pink-100 text-pink-800", label: "Pink" },
    { value: "bg-gray-100 text-gray-800", label: "Gray" },
  ]

  // Format budget input to currency
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except decimal point
    let value = e.target.value.replace(/[^0-9.]/g, "")

    // Ensure only one decimal point
    const parts = value.split(".")
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("")
    }

    setBudget(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{department ? "Edit Department" : "Add New Department"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter department name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter department description"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="headOfDepartment">Head of Department</Label>
                <Input
                  id="headOfDepartment"
                  value={headOfDepartment}
                  onChange={(e) => setHeadOfDepartment(e.target.value)}
                  placeholder="Enter department head"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter department location"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget">Budget</Label>
              <Input id="budget" value={budget} onChange={handleBudgetChange} placeholder="Enter department budget" />
              <p className="text-xs text-muted-foreground">Enter numeric value (e.g., 1000000 for $1,000,000)</p>
            </div>

            <div className="grid gap-2">
              <Label>Department Color</Label>
              <div className="flex items-center gap-2 mb-2">
                <span>Preview:</span>
                <Badge className={color}>{name || "Department"}</Badge>
              </div>
              <RadioGroup value={color} onValueChange={setColor} className="grid grid-cols-3 gap-2">
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
            <Button type="submit">{department ? "Save Changes" : "Add Department"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
