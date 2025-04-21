"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Search, User, Users, UserPlus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  role: string
  avatar?: string
}

interface Group {
  id: number
  name: string
  description: string
  memberCount: number
  type: string
  members: number[]
  icon?: string
}

interface Team {
  id: number
  name: string
  description: string
  memberCount: number
  type: string
  members: number[]
  icon?: string
}

interface AssigneeSelectorProps {
  contacts: Contact[]
  groups: Group[]
  teams: Team[]
  selectedContacts: string[]
  selectedGroups: string[]
  selectedTeams: string[]
  onContactsChange: (contacts: string[]) => void
  onGroupsChange: (groups: string[]) => void
  onTeamsChange: (teams: string[]) => void
  onClose: () => void
}

export function AssigneeSelector({
  contacts,
  groups,
  teams,
  selectedContacts,
  selectedGroups,
  selectedTeams,
  onContactsChange,
  onGroupsChange,
  onTeamsChange,
  onClose,
}: AssigneeSelectorProps) {
  const [activeTab, setActiveTab] = useState("contacts")
  const [contactSearchTerm, setContactSearchTerm] = useState("")
  const [groupSearchTerm, setGroupSearchTerm] = useState("")
  const [teamSearchTerm, setTeamSearchTerm] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Focus search input when tab changes
  useEffect(() => {
    if (searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [activeTab])

  // Recent items - could be fetched from API or local storage
  const recentContacts = contacts.slice(0, 3)
  const recentGroups = groups.slice(0, 2)
  const recentTeams = teams.slice(0, 2)

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
      contact.role.toLowerCase().includes(contactSearchTerm.toLowerCase()),
  )

  // Filter groups based on search term
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(groupSearchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(groupSearchTerm.toLowerCase()) ||
      group.type.toLowerCase().includes(groupSearchTerm.toLowerCase()),
  )

  // Filter teams based on search term
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
      team.type.toLowerCase().includes(teamSearchTerm.toLowerCase()),
  )

  // Toggle selection of a contact
  const toggleContact = (id: string) => {
    if (selectedContacts.includes(id)) {
      onContactsChange(selectedContacts.filter((contactId) => contactId !== id))
    } else {
      onContactsChange([...selectedContacts, id])
    }
  }

  // Toggle selection of a group
  const toggleGroup = (id: string) => {
    if (selectedGroups.includes(id)) {
      onGroupsChange(selectedGroups.filter((groupId) => groupId !== id))
    } else {
      onGroupsChange([...selectedGroups, id])
    }
  }

  // Toggle selection of a team
  const toggleTeam = (id: string) => {
    if (selectedTeams.includes(id)) {
      onTeamsChange(selectedTeams.filter((teamId) => teamId !== id))
    } else {
      onTeamsChange([...selectedTeams, id])
    }
  }

  // Get total assignee count
  const totalAssigneeCount = selectedContacts.length + selectedGroups.length + selectedTeams.length

  return (
    <Tabs defaultValue="contacts" value={activeTab} onValueChange={setActiveTab}>
      <div className="border-b px-3">
        <TabsList className="h-12">
          <TabsTrigger value="contacts" className="flex items-center gap-1 data-[state=active]:bg-blue-50">
            <User className="h-4 w-4" />
            <span>Contacts</span>
            {selectedContacts.length > 0 && <Badge className="ml-1 h-5 bg-blue-500">{selectedContacts.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-1 data-[state=active]:bg-green-50">
            <Users className="h-4 w-4" />
            <span>Groups</span>
            {selectedGroups.length > 0 && <Badge className="ml-1 h-5 bg-green-500">{selectedGroups.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-1 data-[state=active]:bg-purple-50">
            <UserPlus className="h-4 w-4" />
            <span>Teams</span>
            {selectedTeams.length > 0 && <Badge className="ml-1 h-5 bg-purple-500">{selectedTeams.length}</Badge>}
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="p-3">
        <TabsContent value="contacts" className="m-0">
          <div className="relative mb-3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search contacts..."
              className="pl-8"
              value={contactSearchTerm}
              onChange={(e) => setContactSearchTerm(e.target.value)}
            />
          </div>

          {contactSearchTerm === "" && recentContacts.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-2">Recent Contacts</h4>
              <div className="space-y-1">
                {recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                      selectedContacts.includes(contact.id) ? "bg-blue-100" : "hover:bg-muted"
                    }`}
                    onClick={() => toggleContact(contact.id)}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                      <AvatarFallback>
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{contact.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{contact.role}</p>
                    </div>
                    {selectedContacts.includes(contact.id) && <Check className="h-4 w-4 text-blue-600" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          <ScrollArea className="h-[200px] pr-3">
            <div className="space-y-1">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                      selectedContacts.includes(contact.id) ? "bg-blue-100" : "hover:bg-muted"
                    }`}
                    onClick={() => toggleContact(contact.id)}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                      <AvatarFallback>
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{contact.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                    </div>
                    {selectedContacts.includes(contact.id) && <Check className="h-4 w-4 text-blue-600" />}
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground">No contacts found</div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="groups" className="m-0">
          <div className="relative mb-3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              className="pl-8"
              value={groupSearchTerm}
              onChange={(e) => setGroupSearchTerm(e.target.value)}
            />
          </div>

          {groupSearchTerm === "" && recentGroups.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-2">Recent Groups</h4>
              <div className="space-y-1">
                {recentGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                      selectedGroups.includes(group.id.toString()) ? "bg-green-100" : "hover:bg-muted"
                    }`}
                    onClick={() => toggleGroup(group.id.toString())}
                  >
                    <div className="h-8 w-8 mr-2 flex items-center justify-center bg-green-100 rounded-md text-lg">
                      {group.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{group.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{group.memberCount} members</p>
                    </div>
                    {selectedGroups.includes(group.id.toString()) && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          <ScrollArea className="h-[200px] pr-3">
            <div className="space-y-1">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                      selectedGroups.includes(group.id.toString()) ? "bg-green-100" : "hover:bg-muted"
                    }`}
                    onClick={() => toggleGroup(group.id.toString())}
                  >
                    <div className="h-8 w-8 mr-2 flex items-center justify-center bg-green-100 rounded-md text-lg">
                      {group.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{group.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {group.type} • {group.memberCount} members
                      </p>
                    </div>
                    {selectedGroups.includes(group.id.toString()) && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground">No groups found</div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="teams" className="m-0">
          <div className="relative mb-3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              className="pl-8"
              value={teamSearchTerm}
              onChange={(e) => setTeamSearchTerm(e.target.value)}
            />
          </div>

          {teamSearchTerm === "" && recentTeams.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-2">Recent Teams</h4>
              <div className="space-y-1">
                {recentTeams.map((team) => (
                  <div
                    key={team.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                      selectedTeams.includes(team.id.toString()) ? "bg-purple-100" : "hover:bg-muted"
                    }`}
                    onClick={() => toggleTeam(team.id.toString())}
                  >
                    <div className="h-8 w-8 mr-2 flex items-center justify-center bg-purple-100 rounded-md text-lg">
                      {team.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{team.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{team.memberCount} members</p>
                    </div>
                    {selectedTeams.includes(team.id.toString()) && <Check className="h-4 w-4 text-purple-600" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          <ScrollArea className="h-[200px] pr-3">
            <div className="space-y-1">
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                      selectedTeams.includes(team.id.toString()) ? "bg-purple-100" : "hover:bg-muted"
                    }`}
                    onClick={() => toggleTeam(team.id.toString())}
                  >
                    <div className="h-8 w-8 mr-2 flex items-center justify-center bg-purple-100 rounded-md text-lg">
                      {team.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{team.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {team.type} • {team.memberCount} members
                      </p>
                    </div>
                    {selectedTeams.includes(team.id.toString()) && <Check className="h-4 w-4 text-purple-600" />}
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground">No teams found</div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </div>

      <div className="flex items-center justify-between p-3 border-t">
        <div className="text-sm text-muted-foreground">{totalAssigneeCount} selected</div>
        <Button size="sm" onClick={onClose}>
          Done
        </Button>
      </div>
    </Tabs>
  )
}
