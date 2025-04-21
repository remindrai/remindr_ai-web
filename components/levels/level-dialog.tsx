"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Level {
  id: number
  name: string
  description: string
  departmentIds: number[]
  parentLevelId: number | null
}

interface Department {
  id: number
  name: string
}

interface LevelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  level: Level | null
  onSave: (level: Level) => void
  levels: Level[]
  departments: Department[]
}

export function LevelDialog({ open, onOpenChange, level, onSave, levels, departments }: LevelDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [parentLevelId, setParentLevelId] = useState<number | null>(null)
  const [departmentIds, setDepartmentIds] = useState<number[]>([])
  const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false)

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (level) {
        setName(level.name)
        setDescription(level.description || "")
        setParentLevelId(level.parentLevelId)
        setDepartmentIds(level.departmentIds || [])
      } else {
        setName("")
        setDescription("")
        setParentLevelId(null)
        setDepartmentIds([])
      }
    }
  }, [open, level])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: level?.id || 0,
      name,
      description,
      parentLevelId,
      departmentIds,
    })
  }

  // Filter out current level and its descendants from parent options to prevent circular references
  const getAvailableParentLevels = () => {
    if (!level) return levels

    // Function to get all descendant IDs of a level
    const getDescendantIds = (levelId: number): number[] => {
      const directDescendants = levels.filter((l) => l.parentLevelId === levelId).map((l) => l.id)
      const allDescendants = [...directDescendants]

      directDescendants.forEach((id) => {
        allDescendants.push(...getDescendantIds(id))
      })

      return allDescendants
    }

    const excludeIds = [level.id, ...getDescendantIds(level.id)]
    return levels.filter((l) => !excludeIds.includes(l.id))
  }

  const toggleDepartment = (departmentId: number) => {
    setDepartmentIds((current) =>
      current.includes(departmentId) ? current.filter((id) => id !== departmentId) : [...current, departmentId],
    )
  }

  const getSelectedDepartmentsText = () => {
    if (departmentIds.length === 0) return "Select departments"
    if (departmentIds.length === 1) {
      const dept = departments.find((d) => d.id === departmentIds[0])
      return dept ? dept.name : "1 department"
    }
    return `${departmentIds.length} departments selected`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{level ? "Edit Level" : "Add Level"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parentLevel" className="text-right">
                Parent Level
              </Label>
              <Select
                value={parentLevelId?.toString() || ""}
                onValueChange={(value) => setParentLevelId(value ? Number.parseInt(value) : null)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select parent level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {getAvailableParentLevels().map((level) => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Departments</Label>
              <Popover open={departmentPopoverOpen} onOpenChange={setDepartmentPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={departmentPopoverOpen}
                    className="col-span-3 justify-between"
                  >
                    {getSelectedDepartmentsText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search departments..." />
                    <CommandList>
                      <CommandEmpty>No departments found.</CommandEmpty>
                      <CommandGroup>
                        {departments.map((department) => (
                          <CommandItem
                            key={department.id}
                            value={department.name}
                            onSelect={() => toggleDepartment(department.id)}
                          >
                            <div className="mr-2 h-4 w-4 flex items-center justify-center border rounded">
                              {departmentIds.includes(department.id) && <Check className="h-3 w-3" />}
                            </div>
                            {department.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {departmentIds.length > 0 && (
              <div className="grid grid-cols-4 items-start gap-4">
                <div></div>
                <div className="col-span-3">
                  <ScrollArea className="h-[80px]">
                    <div className="flex flex-wrap gap-2 p-1">
                      {departmentIds.map((id) => {
                        const dept = departments.find((d) => d.id === id)
                        return dept ? (
                          <Badge key={id} variant="secondary" className="px-2 py-1">
                            {dept.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">{level ? "Save Changes" : "Add Level"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
