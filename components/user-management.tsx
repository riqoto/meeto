"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StatCard } from "@/components/ui/stat-card"
import { UserProfileModal } from "@/components/ui/user-profile-modal"
import { Search, MoreHorizontal, UserPlus, Download, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { UserIcon } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  status: "checked-in" | "checked-out" | "registered"
  checkInTime?: string
  lastSeen?: string
  sessions: string[]
  avatar?: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc.",
    role: "Developer",
    status: "checked-in",
    checkInTime: "09:15 AM",
    lastSeen: "2 min ago",
    sessions: ["Keynote", "Tech Talk A"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@designstudio.com",
    phone: "+1 (555) 234-5678",
    company: "Design Studio",
    role: "Designer",
    status: "checked-in",
    checkInTime: "08:45 AM",
    lastSeen: "5 min ago",
    sessions: ["Workshop B", "Panel Discussion"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma.davis@startup.io",
    phone: "+1 (555) 345-6789",
    company: "Startup.io",
    role: "Product Manager",
    status: "checked-out",
    checkInTime: "10:30 AM",
    lastSeen: "1 hour ago",
    sessions: ["Keynote"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Alex Rivera",
    email: "alex.rivera@university.edu",
    phone: "+1 (555) 456-7890",
    company: "State University",
    role: "Student",
    status: "registered",
    sessions: [],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@enterprise.com",
    phone: "+1 (555) 567-8901",
    company: "Enterprise Solutions",
    role: "Developer",
    status: "checked-in",
    checkInTime: "09:00 AM",
    lastSeen: "10 min ago",
    sessions: ["Tech Talk A", "Workshop B", "Networking"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const handleStatusChange = (userId: string, newStatus: User["status"]) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: newStatus,
              checkInTime:
                newStatus === "checked-in"
                  ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : user.checkInTime,
              lastSeen: newStatus === "checked-in" ? "Just now" : user.lastSeen,
            }
          : user,
      ),
    )
  }

  const getStatusIcon = (status: User["status"]) => {
    switch (status) {
      case "checked-in":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "checked-out":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "registered":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "checked-in":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Checked In</Badge>
      case "checked-out":
        return <Badge variant="secondary">Checked Out</Badge>
      case "registered":
        return <Badge variant="outline">Registered</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Toplam Kullanıcılar" value={users.length} icon={UserIcon} iconColor="text-blue-500" />
        <StatCard
          title="Giriş Yapmış"
          value={users.filter((u) => u.status === "checked-in").length}
          icon={CheckCircle}
          iconColor="text-green-500"
        />
        <StatCard
          title="Çıkış Yapmış"
          value={users.filter((u) => u.status === "checked-out").length}
          icon={XCircle}
          iconColor="text-red-500"
        />
        <StatCard
          title="Sadece Kayıtlı"
          value={users.filter((u) => u.status === "registered").length}
          icon={AlertCircle}
          iconColor="text-yellow-500"
        />
      </div>

      {/* User Management Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:items-center items-start  justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <CardTitle>User Management</CardTitle>
              <CardDescription className="text:xs md:text-sm">Manage conference attendees and their status</CardDescription>
            </div>
            <div className="flex relative items-center gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="flex-1">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6 flex-col md:flex-row">
            <div className="relative  flex-1 md:max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full flex flex-col justify-between items-center md:flex-row md:max-w-fit md:gap-4">
               <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-[150px] w-full my-2 md:my-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="checked-out">Checked Out</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="md:w-[150px] w-full my-2 md:my-0">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">{selectedUsers.length} users selected</span>
              <Button variant="outline" size="sm">
                Check In All
              </Button>
              <Button variant="outline" size="sm">
                Check Out All
              </Button>
              <Button variant="outline" size="sm">
                Send Email
              </Button>
            </div>
          )}

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-in Time</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.company}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.status)}
                        {getStatusBadge(user.status)}
                      </div>
                    </TableCell>
                    <TableCell>{user.checkInTime || "-"}</TableCell>
                    <TableCell>{user.lastSeen || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.sessions.slice(0, 2).map((session) => (
                          <Badge key={session} variant="outline" className="text-xs">
                            {session}
                          </Badge>
                        ))}
                        {user.sessions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.sessions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedUser(user)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "checked-in")}>
                            Check In
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "checked-out")}>
                            Check Out
                          </DropdownMenuItem>
                          <DropdownMenuItem>Send Email</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UserProfileModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
