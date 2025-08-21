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
    name: "Ayşe Yılmaz",
    email: "ayse.yilmaz@teknosoft.com",
    phone: "+90 (532) 123-4567",
    company: "TeknoSoft A.Ş.",
    role: "Developer",
    status: "checked-in",
    checkInTime: "09:15",
    lastSeen: "2 dk önce",
    sessions: ["Açılış Konuşması", "Teknoloji Sunumu A"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Mehmet Can",
    email: "mehmet.can@tasarimci.com",
    phone: "+90 (533) 234-5678",
    company: "Tasarım Stüdyo",
    role: "Designer",
    status: "checked-in",
    checkInTime: "08:45",
    lastSeen: "5 dk önce",
    sessions: ["Atölye B", "Panel Tartışması"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Elif Demir",
    email: "elif.demir@girisim.io",
    phone: "+90 (535) 345-6789",
    company: "Girisim.io",
    role: "Product Manager",
    status: "checked-out",
    checkInTime: "10:30",
    lastSeen: "1 saat önce",
    sessions: ["Açılış Konuşması"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Ali Rıza",
    email: "ali.riza@universite.edu.tr",
    phone: "+90 (536) 456-7890",
    company: "Devlet Üniversitesi",
    role: "Student",
    status: "registered",
    sessions: [],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Deniz Kaya",
    email: "deniz.kaya@kurumsal.com",
    phone: "+90 (537) 567-8901",
    company: "Kurumsal Çözümler Ltd.",
    role: "Developer",
    status: "checked-in",
    checkInTime: "09:00",
    lastSeen: "10 dk önce",
    sessions: ["Teknoloji Sunumu A", "Atölye B", "Networking"],
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
              lastSeen: newStatus === "checked-in" ? "Şimdi" : user.lastSeen,
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
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Giriş Yapmış</Badge>
    case "checked-out":
      return <Badge variant="secondary">Çıkış Yapmış</Badge>
    case "registered":
      return <Badge variant="outline">Kayıtlı</Badge>
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

    <Card>
      <CardHeader>
        <div className="flex flex-col md:items-center items-start justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <CardTitle>Kullanıcı Yönetimi</CardTitle>
            <CardDescription className="text:xs md:text-sm">Konferans katılımcılarını ve durumlarını yönetin</CardDescription>
          </div>
          <div className="flex relative items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Dışa Aktar
            </Button>
            <Button size="sm" className="flex-1">
              <UserPlus className="h-4 w-4 mr-2" />
              Kullanıcı Ekle
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6 flex-col md:flex-row">
          <div className="relative flex-1 md:max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full flex flex-col justify-between items-center md:flex-row md:max-w-fit md:gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-[150px] w-full my-2 md:my-0">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="checked-in">Giriş Yapmış</SelectItem>
                <SelectItem value="checked-out">Çıkış Yapmış</SelectItem>
                <SelectItem value="registered">Kayıtlı</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="md:w-[150px] w-full my-2 md:my-0">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Roller</SelectItem>
                <SelectItem value="Developer">Geliştirici</SelectItem>
                <SelectItem value="Designer">Tasarımcı</SelectItem>
                <SelectItem value="Product Manager">Ürün Yöneticisi</SelectItem>
                <SelectItem value="Student">Öğrenci</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">{selectedUsers.length} kullanıcı seçildi</span>
            <Button variant="outline" size="sm">
              Tümünü Giriş Yaptır
            </Button>
            <Button variant="outline" size="sm">
              Tümünü Çıkış Yaptır
            </Button>
            <Button variant="outline" size="sm">
              E-posta Gönder
            </Button>
          </div>
        )}

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
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Şirket</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Giriş Zamanı</TableHead>
                <TableHead>Son Görülme</TableHead>
                <TableHead>Oturumlar</TableHead>
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
       <div 
    className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-md p-1 transition-colors"
    onClick={() => setSelectedUser(user)}
  >
    <Avatar>
      <AvatarImage src={user.avatar} />
      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
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
          {user.sessions.map((session) => (
            <Badge key={session} variant="secondary" className="text-xs">
              {session}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">İşlemler</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedUser(user)}>Detayları Görüntüle</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(user.id, "checked-in")}>
              Giriş Yaptır
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(user.id, "checked-out")}>
              Çıkış Yaptır
            </DropdownMenuItem>
            <DropdownMenuItem>E-posta Gönder</DropdownMenuItem>
            <DropdownMenuItem>Kullanıcıyı Düzenle</DropdownMenuItem>
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
