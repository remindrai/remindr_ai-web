"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id?: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  role: string
  department: string
  status: string
  profileId: number
  lastLogin?: string
  verified?: boolean
}

interface Profile {
  id: number
  name: string
  description: string
  isDefault: boolean
}

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSave: (user: User) => void
}

export function UserDialog({ open, onOpenChange, user, onSave }: UserDialogProps) {
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    role: "User",
    department: "",
    status: "Active",
    profileId: 0,
  })

  const [profiles, setProfiles] = useState<Profile[]>([])
  const [defaultProfileId, setDefaultProfileId] = useState<number>(0)

  useEffect(() => {
    // Load profiles from localStorage
    const savedProfiles = localStorage.getItem("profiles")
    if (savedProfiles) {
      const parsedProfiles = JSON.parse(savedProfiles)
      setProfiles(parsedProfiles)

      // Find default profile
      const defaultProfile = parsedProfiles.find((p: Profile) => p.isDefault)
      if (defaultProfile) {
        setDefaultProfileId(defaultProfile.id)
      }
    }
  }, [])

  useEffect(() => {
    if (user) {
      setFormData(user)
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        role: "User",
        department: "",
        status: "Active",
        profileId: defaultProfileId,
      })
    }
  }, [user, open, defaultProfileId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileChange = (value: string) => {
    setFormData((prev) => ({ ...prev, profileId: Number.parseInt(value) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const roles = ["Administrator", "Manager", "Developer", "Designer", "Analyst", "Support", "User"]
  const departments = ["IT", "HR", "Engineering", "Marketing", "Finance", "Sales", "Operations", "Customer Service"]
  const statuses = ["Active", "Inactive"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile">Access Profile</Label>
              <Select value={formData.profileId.toString()} onValueChange={handleProfileChange}>
                <SelectTrigger id="profile">
                  <SelectValue placeholder="Select access profile" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id.toString()}>
                      {profile.name} {profile.isDefault && "(Default)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The profile determines what features this user can view, edit, and delete.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{user ? "Save Changes" : "Add User"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
