"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/ui/stat-card"
import { BreathingDot } from "@/components/ui/breathing-dot"
import { UserProfileModal } from "@/components/ui/user-profile-modal"
import {
  Search,
  Download,
  RefreshCw,
  LogIn,
  LogOut,
  QrCode,
  Users,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
} from "lucide-react"


interface EventLog {
  id: string
  timestamp: string
  type: "checkin" | "checkout" | "qr_scan" | "session_join" | "session_leave" | "system" | "error" | "admin"
  user?: {
    name: string
    email: string
    avatar?: string
  }
  action: string
  details: string
  location?: string
  sessionId?: string
  severity: "low" | "medium" | "high" | "critical"
  metadata?: Record<string, any>
}
const translate = {
  types: {
    checkin: "Giriş",
    checkout: "Çıkış",
    qr_scan: "QR Tarama",
    session_join: "Oturum Katılımı",
    session_leave: "Oturum Ayrılması",
    system: "Sistem",
    error: "Hata",
    admin: "Yönetici"
  },
  severity: {
    low: "Düşük",
    medium: "Orta",
    high: "Yüksek",
    critical: "Kritik"
  }
} as const


const mockEventLogs: EventLog[] = [
  {
    id: "1",
    timestamp: "2024-01-20T14:32:15Z",
    type: "checkin",
    user: {
      name: "Ayşe Yılmaz",
      email: "ayse.yilmaz@teknosoft.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "Kullanıcı Girişi",
    details: "QR kod ile başarılı giriş yapıldı",
    location: "Ana Giriş",
    severity: "low",
  },
  {
    id: "2",
    timestamp: "2024-01-20T14:31:45Z",
    type: "qr_scan",
    user: {
      name: "Mehmet Can",
      email: "mehmet.can@tasarimci.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "QR Kod Tarama",
    details: "Teknoloji Sunumu A için oturum QR kodu tarandı",
    location: "Oda 101",
    sessionId: "tech-talk-a",
    severity: "low",
  },
  {
    id: "3",
    timestamp: "2024-01-20T14:30:22Z",
    type: "session_join",
    user: {
      name: "Elif Demir",
      email: "elif.demir@girisim.io",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "Oturuma Katılım",
    details: "Atölye B - İleri Seviye React Patterns oturumuna katıldı",
    location: "Oda 205",
    sessionId: "workshop-b",
    severity: "low",
  },
  {
    id: "4",
    timestamp: "2024-01-20T14:29:18Z",
    type: "error",
    user: {
      name: "Ali Rıza",
      email: "ali.riza@universite.edu.tr",
    },
    action: "Giriş Başarısız",
    details: "QR kod tarama hatası - geçersiz format",
    location: "Yan Giriş",
    severity: "medium",
  },
  {
    id: "5",
    timestamp: "2024-01-20T14:28:55Z",
    type: "system",
    action: "Oturum Kapasite Uyarısı",
    details: "Açılış konuşması %90 doluluk oranına ulaştı",
    location: "Ana Salon",
    sessionId: "keynote",
    severity: "medium",
  },
  {
    id: "6",
    timestamp: "2024-01-20T14:27:33Z",
    type: "admin",
    user: {
      name: "Yönetici",
      email: "admin@meeeto.com",
    },
    action: "Manuel Giriş",
    details: "QR kod sorunu nedeniyle kullanıcı manuel olarak giriş yaptırıldı",
    location: "Kayıt Masası",
    severity: "low",
  },
  {
    id: "7",
    timestamp: "2024-01-20T14:26:12Z",
    type: "checkout",
    user: {
      name: "Deniz Kaya",
      email: "deniz.kaya@kurumsal.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "Kullanıcı Çıkışı",
    details: "Konferanstan çıkış yapıldı",
    location: "Ana Çıkış",
    severity: "low",
  },
  {
    id: "8",
    timestamp: "2024-01-20T14:25:44Z",
    type: "session_leave",
    user: {
      name: "Zeynep Ak",
      email: "zeynep.ak@teknostart.com",
    },
    action: "Oturumdan Ayrılma",
    details: "Panel Tartışmasından erken ayrıldı",
    location: "Oda 301",
    sessionId: "panel-discussion",
    severity: "low",
  },
]

export function EventLogs() {
  const [logs, setLogs] = useState<EventLog[]>(mockEventLogs)
  const [filteredLogs, setFilteredLogs] = useState<EventLog[]>(mockEventLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedUser, setSelectedUser] = useState<EventLog["user"] | null>(null)

  useEffect(() => {
  if (!autoRefresh) return

  const interval = setInterval(() => {
    const newLog: EventLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: ["checkin", "checkout", "qr_scan", "session_join"][Math.floor(Math.random() * 4)] as EventLog["type"],
      user: {
        name: ["Ayşe Yılmaz", "Mehmet Can", "Elif Demir", "Ali Rıza"][Math.floor(Math.random() * 4)],
        email: "kullanici@ornek.com",
      },
      action: "Gerçek Zamanlı Olay",
      details: "Simüle edilmiş gerçek zamanlı olay kaydı",
      location: ["Ana Giriş", "Oda 101", "Oda 205"][Math.floor(Math.random() * 3)],
      severity: "low" as const,
    }

    setLogs((prev) => [newLog, ...prev.slice(0, 49)])
  }, 10000)

  return () => clearInterval(interval)
}, [autoRefresh])
  useEffect(() => {
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user?.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((log) => log.type === typeFilter)
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter((log) => log.severity === severityFilter)
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, typeFilter, severityFilter])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const getTypeIcon = (type: EventLog["type"]) => {
    switch (type) {
      case "checkin":
        return <LogIn className="h-4 w-4 text-green-500" />
      case "checkout":
        return <LogOut className="h-4 w-4 text-red-500" />
      case "qr_scan":
        return <QrCode className="h-4 w-4 text-blue-500" />
      case "session_join":
        return <Users className="h-4 w-4 text-purple-500" />
      case "session_leave":
        return <Users className="h-4 w-4 text-orange-500" />
      case "system":
        return <Info className="h-4 w-4 text-blue-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "admin":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeBadge = (type: EventLog["type"]) => {
  const variants = {
    checkin: "default",
    checkout: "secondary",
    qr_scan: "outline",
    session_join: "default",
    session_leave: "secondary",
    system: "outline",
    error: "destructive",
    admin: "default",
  } as const

  return (
    <Badge variant={variants[type] || "outline"} className="capitalize">
      {translate.types[type]}
    </Badge>
  )
}

// getSeverityBadge fonksiyonunu güncelle
const getSeverityBadge = (severity: EventLog["severity"]) => {
  const colors = {
    low: "bg-green-100 text-green-800 hover:bg-green-100",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    high: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    critical: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  return (
    <Badge className={colors[severity]} variant="secondary">
      {translate.severity[severity]}
    </Badge>
  )
}

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "  saniye önce"
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat önce`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Toplam Etkinlikler"
          value={logs.length.toString()}
          description="Son 24 saat"
          icon={Calendar}
          iconColor="text-slate-500"
        />
        <StatCard
          title="Giriş Yapanlar"
          value={logs.filter((l) => l.type === "checkin").length.toString()}
          description="Bugün"
          icon={LogIn}
          iconColor="text-green-500"
        />
        <StatCard
          title="QR Taramaları"
          value={logs.filter((l) => l.type === "qr_scan").length.toString()}
          description="Bugün"
          icon={QrCode}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Hatalar"
          value={logs.filter((l) => l.type === "error").length.toString()}
          description="Dikkat gerekiyor"
          icon={AlertTriangle}
          iconColor="text-red-500"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div>
              <CardTitle>Etkinlik Günlükleri</CardTitle>
              <CardDescription>Gerçek zamanlı sistem olayları ve kullanıcı aktiviteleri</CardDescription>
            </div>
            <div className="flex justify-between w-full md:w-auto mt-4 items-center gap-2 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" : ""}
              >
                {autoRefresh ? <BreathingDot className="mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                {autoRefresh ? "Canlı" : "Duraklatıldı"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Yenile
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Dışa Aktar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6 flex-col md:flex-row">
            <div className="relative  flex-1 md:max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Etkinlikleri ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full flex flex-col justify-between items-center md:flex-row md:max-w-fit md:gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="md:w-[150px] w-full my-2 md:my-0">
                <SelectValue placeholder="Etkinlik Türü" />
              </SelectTrigger>
            <SelectContent>
            <SelectItem value="all">Tüm Türler</SelectItem>
              {Object.entries(translate.types).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="md:w-[150px] w-full my-2 md:my-0">
                <SelectValue placeholder="Önem Derecesi" />
              </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Seviyeler</SelectItem>
                {Object.entries(translate.severity).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
              </SelectItem>
                ))}
            </SelectContent>
            </Select>
            </div>
          </div>

          <div className="rounded-md border w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zaman</TableHead>
                  <TableHead>Tür</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Eylem</TableHead>
                  <TableHead>Detaylar</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Önem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Filtrelerinizle eşleşen etkinlik bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{formatTimestamp(log.timestamp)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(log.type)}
                          {getTypeBadge(log.type)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.user ? (
                          <div
                            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded p-1 -m-1"
                            onClick={() => setSelectedUser(log.user)}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={log.user.avatar || "/placeholder.svg"} alt={log.user.name} />
                              <AvatarFallback className="text-xs">
                                {log.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{log.user.name}</div>
                              <div className="text-xs text-muted-foreground">{log.user.email}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Sistem</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell className="max-w-xs truncate" title={log.details}>
                        {log.details}
                      </TableCell>
                      <TableCell>{log.location || "-"}</TableCell>
                      <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UserProfileModal user={selectedUser} isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  )
}
