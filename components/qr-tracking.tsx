"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { StatCard } from "@/components/ui/stat-card"
import { UserProfileModal } from "@/components/ui/user-profile-modal"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { BreathingDot } from "@/components/ui/breathing-dot"
import {
  QrCode,
  Plus,
  Download,
  Eye,
  Edit,
  Copy,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  BarChart3,
  Search,
} from "lucide-react"

interface QRCode {
  id: string
  name: string
  type: "checkin" | "session" | "feedback" | "networking" | "custom"
  description: string
  url: string
  isActive: boolean
  createdAt: string
  expiresAt?: string
  location: string
  scans: number
  uniqueScans: number
  lastScanned?: string
  metadata?: {
    sessionId?: string
    capacity?: number
    maxScansPerUser?: number
  }
}

interface QRScan {
  id: string
  qrCodeId: string
  userId: string
  userName: string
  userEmail: string
  timestamp: string
  location: string
  deviceInfo?: string
  ipAddress?: string
}

const mockQRCodes: QRCode[] = [
  {
    id: "1",
    name: "Ana Giriş Kaydı",
    type: "checkin",
    description: "Konferans katılımcıları için ana giriş noktası",
    url: "https://meeeto.app/checkin/main",
    isActive: true,
    createdAt: "2024-01-20T08:00:00Z",
    location: "Ana Giriş",
    scans: 1234,
    uniqueScans: 892,
    lastScanned: "2024-01-20T14:32:15Z",
  },
  {
    id: "2",
    name: "Açılış Konuşması",
    type: "session",
    description: "Ana konuşma için giriş QR kodu",
    url: "https://meeeto.app/session/keynote",
    isActive: true,
    createdAt: "2024-01-20T09:00:00Z",
    expiresAt: "2024-01-20T18:00:00Z",
    location: "Ana Salon",
    scans: 856,
    uniqueScans: 823,
    lastScanned: "2024-01-20T14:30:22Z",
    metadata: {
      sessionId: "keynote",
      capacity: 1000,
      maxScansPerUser: 1,
    },
  },
  {
    id: "3",
    name: "Teknoloji Sunumu A",
    type: "session",
    description: "İleri Seviye React Patterns çalıştayı",
    url: "https://meeeto.app/session/tech-talk-a",
    isActive: true,
    createdAt: "2024-01-20T10:00:00Z",
    expiresAt: "2024-01-20T16:00:00Z",
    location: "Oda 101",
    scans: 245,
    uniqueScans: 230,
    lastScanned: "2024-01-20T14:31:45Z",
    metadata: {
      sessionId: "tech-talk-a",
      capacity: 300,
      maxScansPerUser: 1,
    },
  },
  {
    id: "4",
    name: "Geri Bildirim Toplama",
    type: "feedback",
    description: "Oturum sonrası geri bildirim formu",
    url: "https://meeeto.app/feedback/general",
    isActive: true,
    createdAt: "2024-01-20T11:00:00Z",
    location: "Çeşitli Konumlar",
    scans: 456,
    uniqueScans: 398,
    lastScanned: "2024-01-20T14:25:33Z",
  },
  {
    id: "5",
    name: "Networking Salonu",
    type: "networking",
    description: "Networking alanı ve kartvizit değişimi için erişim",
    url: "https://meeeto.app/networking/lounge",
    isActive: false,
    createdAt: "2024-01-20T12:00:00Z",
    location: "Networking Salonu",
    scans: 123,
    uniqueScans: 98,
    lastScanned: "2024-01-20T13:45:12Z",
  },
]

const mockRecentScans: QRScan[] = [
  {
    id: "1",
    qrCodeId: "1",
    userId: "user1",
    userName: "Ayşe Yılmaz",
    userEmail: "ayse.yilmaz@teknosoft.com",
    timestamp: "2024-01-20T14:32:15Z",
    location: "Ana Giriş",
    deviceInfo: "iPhone 15 Pro",
    ipAddress: "192.168.1.100",
  },
  {
    id: "2",
    qrCodeId: "2",
    userId: "user2",
    userName: "Mehmet Can",
    userEmail: "mehmet.can@tasarimci.com",
    timestamp: "2024-01-20T14:31:45Z",
    location: "Ana Salon",
    deviceInfo: "Samsung Galaxy S24",
    ipAddress: "192.168.1.101",
  },
  {
    id: "3",
    qrCodeId: "3",
    userId: "user3",
    userName: "Elif Demir",
    userEmail: "elif.demir@girisim.io",
    timestamp: "2024-01-20T14:30:22Z",
    location: "Oda 101",
    deviceInfo: "MacBook Pro",
    ipAddress: "192.168.1.102",
  },
]

export function QRTracking() {
  const [qrCodes, setQRCodes] = useState<QRCode[]>(mockQRCodes)
  const [recentScans, setRecentScans] = useState<QRScan[]>(mockRecentScans)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newQRCode, setNewQRCode] = useState({
    name: "",
    type: "checkin" as QRCode["type"],
    description: "",
    location: "",
    expiresAt: "",
  })
  const [selectedScanUser, setSelectedScanUser] = useState<any>(null)

  // Simulate real-time scan updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new scan
      const randomQR = qrCodes[Math.floor(Math.random() * qrCodes.length)]
      if (randomQR && randomQR.isActive) {
        setQRCodes((prev) =>
          prev.map((qr) =>
            qr.id === randomQR.id
              ? {
                  ...qr,
                  scans: qr.scans + 1,
                  uniqueScans: qr.uniqueScans + (Math.random() > 0.3 ? 1 : 0),
                  lastScanned: new Date().toISOString(),
                }
              : qr,
          ),
        )

        // Add to recent scans
        const newScan: QRScan = {
          id: Date.now().toString(),
          qrCodeId: randomQR.id,
          userId: `user${Date.now()}`,
          userName: ["John Doe", "Jane Smith", "Bob Wilson", "Alice Brown"][Math.floor(Math.random() * 4)],
          userEmail: "user@example.com",
          timestamp: new Date().toISOString(),
          location: randomQR.location,
          deviceInfo: ["iPhone 15", "Samsung Galaxy S24", "MacBook Pro", "iPad Air"][Math.floor(Math.random() * 4)],
        }

        setRecentScans((prev) => [newScan, ...prev.slice(0, 9)]) // Keep only latest 10 scans
      }
    }, 8000) // Update every 8 seconds

    return () => clearInterval(interval)
  }, [qrCodes])

  const filteredQRCodes = qrCodes.filter((qr) => {
    const matchesSearch =
      qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qr.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qr.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || qr.type === typeFilter
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? qr.isActive : !qr.isActive)
    return matchesSearch && matchesType && matchesStatus
  })

  const handleCreateQR = () => {
    const newQR: QRCode = {
      id: Date.now().toString(),
      ...newQRCode,
      url: `https://meeeto.app/${newQRCode.type}/${newQRCode.name.toLowerCase().replace(/\s+/g, "-")}`,
      isActive: true,
      createdAt: new Date().toISOString(),
      scans: 0,
      uniqueScans: 0,
    }

    setQRCodes([...qrCodes, newQR])
    setIsCreateDialogOpen(false)
    setNewQRCode({
      name: "",
      type: "checkin",
      description: "",
      location: "",
      expiresAt: "",
    })
  }

  const toggleQRStatus = (id: string) => {
    setQRCodes(qrCodes.map((qr) => (qr.id === id ? { ...qr, isActive: !qr.isActive } : qr)))
  }

  const getTypeIcon = (type: QRCode["type"]) => {
    switch (type) {
      case "checkin":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "session":
        return <Users className="h-4 w-4 text-blue-500" />
      case "feedback":
        return <BarChart3 className="h-4 w-4 text-purple-500" />
      case "networking":
        return <Users className="h-4 w-4 text-orange-500" />
      case "custom":
        return <QrCode className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeBadge = (type: QRCode["type"]) => {
    const colors = {
      checkin: "bg-green-100 text-green-800 hover:bg-green-100",
      session: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      feedback: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      networking: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      custom: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    }

    return (
      <Badge className={colors[type]} variant="secondary">
        {type}
      </Badge>
    )
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scans, 0)
  const totalUniqueScans = qrCodes.reduce((sum, qr) => sum + qr.uniqueScans, 0)
  const activeQRCodes = qrCodes.filter((qr) => qr.isActive).length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Toplam QR Kodları"
          value={qrCodes.length.toString()}
          description={`${activeQRCodes} aktif`}
          icon={QrCode}
          iconColor="text-slate-500"
        />
        <StatCard
          title="Toplam Tarama"
          value={totalScans.toLocaleString()}
          description="Tüm zamanlar"
          icon={TrendingUp}
          iconColor="text-green-500"
        />
        <StatCard
          title="Benzersiz Kullanıcılar"
          value={totalUniqueScans.toLocaleString()}
          description="Benzersiz taramalar"
          icon={Users}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Tarama Oranı"
          value={`${((totalUniqueScans / totalScans) * 100).toFixed(1)}%`}
          description="Benzersiz vs toplam"
          icon={BarChart3}
          iconColor="text-purple-500"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Son Taramalar
          </CardTitle>
          <CardDescription>En son QR kod tarama aktivitesi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>QR Kod</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Cihaz</TableHead>
                  <TableHead>Zaman</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentScans.map((scan) => {
                  const qrCode = qrCodes.find((qr) => qr.id === scan.qrCodeId)
                  return (
                    <TableRow key={scan.id}>
                      <TableCell>
                        <div
                          className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-1 rounded"
                          onClick={() =>
                            setSelectedScanUser({
                              id: scan.userId,
                              name: scan.userName,
                              email: scan.userEmail,
                              avatar: `/placeholder.svg?height=40&width=40&query=${scan.userName}`,
                              lastSeen: formatTimestamp(scan.timestamp),
                              location: scan.location,
                            })
                          }
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32&query=${scan.userName}`}
                              alt={scan.userName}
                            />
                            <AvatarFallback>
                              {scan.userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{scan.userName}</div>
                            <div className="text-sm text-muted-foreground">{scan.userEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BreathingDot />
                          <span className="font-medium">{qrCode?.name || "Bilinmeyen QR"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{scan.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{scan.deviceInfo}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatTimestamp(scan.timestamp)}</span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <CardTitle>QR Kod Yönetimi</CardTitle>
              <CardDescription className="text-xs md:text-md">Farklı etkinlikler ve amaçlar için QR kodları oluşturun ve yönetin</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  QR Kod Oluştur
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Yeni QR Kod Oluştur</DialogTitle>
                  <DialogDescription>
                    Etkinlikleri ve aktiviteleri takip etmek için yeni bir QR kod oluşturun
                  </DialogDescription>
                </DialogHeader >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">İsim</Label>
                    <Input
                      id="name"
                      placeholder="örn., Atölye Kaydı"
                      value={newQRCode.name}
                      onChange={(e) => setNewQRCode({ ...newQRCode, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tür</Label>
                    <Select
                      value={newQRCode.type}
                      onValueChange={(value) => setNewQRCode({ ...newQRCode, type: value as QRCode["type"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkin">Giriş</SelectItem>
                        <SelectItem value="session">Oturum</SelectItem>
                        <SelectItem value="feedback">Geri Bildirim</SelectItem>
                        <SelectItem value="networking">Ağ Kurma</SelectItem>
                        <SelectItem value="custom">Özel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      placeholder="QR kod amacının kısa açıklaması"
                      value={newQRCode.description}
                      onChange={(e) => setNewQRCode({ ...newQRCode, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Konum</Label>
                    <Input
                      id="location"
                      placeholder="örn., Oda 101, Ana Giriş"
                      value={newQRCode.location}
                      onChange={(e) => setNewQRCode({ ...newQRCode, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expires">Bitiş Tarihi (İsteğe Bağlı)</Label>
                    <Input
                      id="expires"
                      type="datetime-local"
                      value={newQRCode.expiresAt}
                      onChange={(e) => setNewQRCode({ ...newQRCode, expiresAt: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateQR} className="flex-1">
                      QR Kod Oluştur
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      İptal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6 flex-col md:flex-row">
            <div className="relative  flex-1 md:max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="QR kodları ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="w-full flex flex-col justify-between items-center md:flex-row md:max-w-fit md:gap-4 ">
               <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="md:w-[150px] w-full my-2 md:my-0">
                <SelectValue placeholder="Tür" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                <SelectItem value="checkin">Giriş</SelectItem>
                <SelectItem value="session">Oturum</SelectItem>
                <SelectItem value="feedback">Geri Bildirim</SelectItem>
                <SelectItem value="networking">Ağ Kurma</SelectItem>
                <SelectItem value="custom">Özel</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-[150px] w-full my-2 md:my-0">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Pasif</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </div>

          <div className="rounded-md border w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İsim</TableHead>
                  <TableHead>Tür</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Taramalar</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQRCodes.map((qr) => (
                  <TableRow key={qr.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{qr.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">{qr.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(qr.type)}
                        {getTypeBadge(qr.type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{qr.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{qr.scans.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{qr.uniqueScans} benzersiz</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={qr.isActive} onCheckedChange={() => toggleQRStatus(qr.id)} />
                        <span className="text-sm">{qr.isActive ? "Aktif" : "Pasif"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedQR(qr)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQR} onOpenChange={() => setSelectedQR(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>QR Kod Detayları</DialogTitle>
            <DialogDescription>Seçilen QR kod için detaylı analitik ve bilgiler</DialogDescription>
          </DialogHeader>
          {selectedQR && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">İsim</Label>
                    <p className="text-lg font-semibold">{selectedQR.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Açıklama</Label>
                    <p className="text-sm text-muted-foreground">{selectedQR.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tür</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeIcon(selectedQR.type)}
                      {getTypeBadge(selectedQR.type)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Konum</Label>
                    <p className="text-sm">{selectedQR.location}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Toplam Tarama</Label>
                    <p className="text-2xl font-bold">{selectedQR.scans.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Benzersiz Tarama</Label>
                    <p className="text-2xl font-bold">{selectedQR.uniqueScans.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tarama Oranı</Label>
                    <div className="space-y-2">
                      <Progress value={(selectedQR.uniqueScans / selectedQR.scans) * 100} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {((selectedQR.uniqueScans / selectedQR.scans) * 100).toFixed(1)}% benzersiz
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Durum</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedQR.isActive ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aktif</Badge>
                      ) : (
                        <Badge variant="secondary">Pasif</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">QR Kod URL'si</Label>
                <div className="flex items-center gap-2">
                  <Input value={selectedQR.url} readOnly className="text-sm" />
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  QR İndir
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Düzenle
                </Button>
                <Button
                  variant={selectedQR.isActive ? "destructive" : "default"}
                  onClick={() => {
                    toggleQRStatus(selectedQR.id)
                    setSelectedQR({ ...selectedQR, isActive: !selectedQR.isActive })
                  }}
                >
                  {selectedQR.isActive ? "Devre Dışı Bırak" : "Etkinleştir"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <UserProfileModal user={selectedScanUser} isOpen={!!selectedScanUser} onClose={() => setSelectedScanUser(null)} />
    </div>
  )
}
