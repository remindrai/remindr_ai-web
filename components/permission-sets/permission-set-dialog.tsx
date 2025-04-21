"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Plus, PenLine, Trash2, CheckCircle, Download, Upload, UserPlus, Settings } from "lucide-react"
import { Label } from "@/components/ui/label"

// Define all system features
const SYSTEM_FEATURES = [
  "Users",
  "Profiles",
  "Tasks",
  "Calendar",
  "Contacts",
  "Categories",
  "Priorities",
  "Groups",
  "Teams",
  "Roles",
  "Departments",
  "Levels",
  "Permission Sets",
  "Permission Set Groups",
]

// Define all permission actions
const PERMISSION_ACTIONS = [
  { id: "view", label: "View", icon: Eye, description: "Can view items" },
  { id: "create", label: "Create", icon: Plus, description: "Can create new items" },
  { id: "edit", label: "Edit", icon: PenLine, description: "Can modify existing items" },
  { id: "delete", label: "Delete", icon: Trash2, description: "Can delete items" },
  { id: "approve", label: "Approve", icon: CheckCircle, description: "Can approve items" },
  { id: "export", label: "Export", icon: Download, description: "Can export items" },
  { id: "import", label: "Import", icon: Upload, description: "Can import items" },
  { id: "assign", label: "Assign", icon: UserPlus, description: "Can assign items to others" },
  { id: "configure", label: "Configure", icon: Settings, description: "Can configure system settings" },
]

interface Permission {
  feature: string
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
  approve: boolean
  export: boolean
  import: boolean
  assign: boolean
  configure: boolean
}

interface PermissionSet {
  id: string
  name: string
  description: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

interface PermissionSetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permissionSet: PermissionSet | null
  onSave: (permissionSet: Omit<PermissionSet, "id" | "createdAt" | "updatedAt">) => void
}

export function PermissionSetDialog({ open, onOpenChange, permissionSet, onSave }: PermissionSetDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [activeTab, setActiveTab] = useState("general")
  const [permissionView, setPermissionView] = useState("feature")
  const [selectedFeature, setSelectedFeature] = useState(SYSTEM_FEATURES[0])

  // Initialize form data when dialog opens or permissionSet changes
  useEffect(() => {
    if (permissionSet) {
      setName(permissionSet.name)
      setDescription(permissionSet.description)
      setPermissions(permissionSet.permissions)
    } else {
      setName("")
      setDescription("")
      // Initialize permissions for all features
      const initialPermissions = SYSTEM_FEATURES.map((feature) => ({
        feature,
        view: false,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        export: false,
        import: false,
        assign: false,
        configure: false,
      }))
      setPermissions(initialPermissions)
    }
  }, [permissionSet, open])

  const handleSave = () => {
    onSave({
      name,
      description,
      permissions,
    })
  }

  const handlePermissionChange = (feature: string, action: string, checked: boolean) => {
    setPermissions((prevPermissions) => {
      return prevPermissions.map((permission) => {
        if (permission.feature === feature) {
          // If unchecking view, uncheck all other actions
          if (action === "view" && !checked) {
            return {
              ...permission,
              view: false,
              create: false,
              edit: false,
              delete: false,
              approve: false,
              export: false,
              import: false,
              assign: false,
              configure: false,
            }
          }
          // If checking any action other than view, also check view
          if (action !== "view" && checked) {
            return {
              ...permission,
              [action]: checked,
              view: true,
            }
          }
          // Normal case
          return {
            ...permission,
            [action]: checked,
          }
        }
        return permission
      })
    })
  }

  const handleAllActionChange = (action: string, checked: boolean) => {
    setPermissions((prevPermissions) => {
      return prevPermissions.map((permission) => {
        // If unchecking view, uncheck all other actions
        if (action === "view" && !checked) {
          return {
            ...permission,
            view: false,
            create: false,
            edit: false,
            delete: false,
            approve: false,
            export: false,
            import: false,
            assign: false,
            configure: false,
          }
        }
        // If checking any action other than view, also check view
        if (action !== "view" && checked) {
          return {
            ...permission,
            [action]: checked,
            view: true,
          }
        }
        // Normal case
        return {
          ...permission,
          [action]: checked,
        }
      })
    })
  }

  const getPermissionForFeature = (feature: string) => {
    return (
      permissions.find((p) => p.feature === feature) || {
        feature,
        view: false,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        export: false,
        import: false,
        assign: false,
        configure: false,
      }
    )
  }

  const isAllActionChecked = (action: string) => {
    return permissions.every((permission) => permission[action as keyof Permission] === true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{permissionSet ? "Edit Permission Set" : "Add Permission Set"}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Permission Set Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter permission set name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter permission set description"
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="flex-1 overflow-hidden flex flex-col">
            <Tabs
              value={permissionView}
              onValueChange={setPermissionView}
              className="flex-1 overflow-hidden flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="action">
                  <div className="flex items-center">
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
                      className="mr-2"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Action View
                  </div>
                </TabsTrigger>
                <TabsTrigger value="feature">
                  <div className="flex items-center">
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
                      className="mr-2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    Feature View
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="action" className="flex-1 overflow-hidden flex">
                <div className="flex flex-1 overflow-hidden">
                  <div className="w-48 border-r overflow-hidden flex flex-col">
                    <div className="p-2 font-semibold border-b">Features</div>
                    <ScrollArea className="flex-1">
                      <div className="p-1">
                        {SYSTEM_FEATURES.map((feature) => (
                          <div
                            key={feature}
                            className={`p-2 cursor-pointer rounded hover:bg-gray-100 ${
                              selectedFeature === feature ? "bg-blue-500 text-white hover:bg-blue-600" : ""
                            }`}
                            onClick={() => setSelectedFeature(feature)}
                          >
                            {feature}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="flex-1 overflow-auto p-4">
                    <h3 className="text-sm font-medium mb-4">
                      Select the actions that this permission set allows for {selectedFeature}
                    </h3>

                    <div className="space-y-3">
                      {PERMISSION_ACTIONS.map((action) => {
                        const permission = getPermissionForFeature(selectedFeature)
                        const isChecked = permission[action.id as keyof Permission] as boolean
                        const Icon = action.icon

                        return (
                          <div key={action.id} className="flex items-start space-x-2 border rounded-md p-3 bg-gray-50">
                            <Checkbox
                              id={`${selectedFeature}-${action.id}`}
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(selectedFeature, action.id, checked === true)
                              }
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={`${selectedFeature}-${action.id}`}
                                className="font-medium cursor-pointer flex items-center"
                              >
                                {action.label}
                              </label>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="feature" className="flex-1 overflow-auto">
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-4">Feature Permissions</h3>

                  <div className="border rounded-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left p-2 border-b">Feature</th>
                            {PERMISSION_ACTIONS.map((action) => {
                              const Icon = action.icon
                              return (
                                <th key={action.id} className="p-2 border-b text-center">
                                  <div className="flex flex-col items-center justify-center">
                                    <Checkbox
                                      id={`all-${action.id}`}
                                      checked={isAllActionChecked(action.id)}
                                      onCheckedChange={(checked) => handleAllActionChange(action.id, checked === true)}
                                      className="mb-1"
                                    />
                                    <label
                                      htmlFor={`all-${action.id}`}
                                      className="flex items-center cursor-pointer text-xs"
                                    >
                                      <Icon className="h-4 w-4 mr-1" />
                                      {action.label}
                                    </label>
                                  </div>
                                </th>
                              )
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {SYSTEM_FEATURES.map((feature, index) => {
                            const permission = getPermissionForFeature(feature)
                            return (
                              <tr key={feature} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                                <td className="p-2 border-b font-medium text-primary">{feature}</td>
                                {PERMISSION_ACTIONS.map((action) => {
                                  const isChecked = permission[action.id as keyof Permission] as boolean
                                  return (
                                    <td key={`${feature}-${action.id}`} className="p-2 border-b text-center">
                                      <Checkbox
                                        id={`table-${feature}-${action.id}`}
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                          handlePermissionChange(feature, action.id, checked === true)
                                        }
                                      />
                                    </td>
                                  )
                                })}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
