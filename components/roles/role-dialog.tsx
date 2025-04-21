"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Role {
  id: number
  name: string
  description: string
  department: string
  level: string
  assignedCount: number
}

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  onSave: (role: Omit<Role, "id" | "assignedCount">) => void
}

export function RoleDialog({ open, onOpenChange, role, onSave }: RoleDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [department, setDepartment] = useState("Engineering")
  const [level, setLevel] = useState("Mid-level")

  useEffect(() => {
    if (role) {
      setName(role.name)
      setDescription(role.description || "")
      setDepartment(role.department)
      setLevel(role.level)
    } else {
      setName("")
      setDescription("")
      setDepartment("Engineering")
      setLevel("Mid-level")
    }
  }, [role, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      description,
      department,
      level,
    })
  }

  // Get badge color based on department
  const getDepartmentBadgeColor = (dept: string) => {
    switch (dept.toLowerCase()) {
      case "marketing":
        return "bg-purple-100 text-purple-800"
      case "engineering":
        return "bg-blue-100 text-blue-800"
      case "design":
        return "bg-pink-100 text-pink-800"
      case "operations":
        return "bg-yellow-100 text-yellow-800"
      case "finance":
        return "bg-green-100 text-green-800"
      case "hr":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get badge color based on level
  const getLevelBadgeColor = (lvl: string) => {
    switch (lvl.toLowerCase()) {
      case "junior":
        return "bg-green-100 text-green-800"
      case "mid-level":
        return "bg-blue-100 text-blue-800"
      case "senior":
        return "bg-purple-100 text-purple-800"
      case "lead":
        return "bg-yellow-100 text-yellow-800"
      case "director":
        return "bg-red-100 text-red-800"
      case "executive":
        return "bg-gray-800 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Add New Role"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter role name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Customer Support">Customer Support</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-1">
                  <Badge className={getDepartmentBadgeColor(department)}>{department}</Badge>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="level">Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-1">
                  <Badge className={getLevelBadgeColor(level)}>{level}</Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter role description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{role ? "Save Changes" : "Add Role"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
