"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, Phone, Clock, MapPin, Calendar, User, Building } from "lucide-react"

interface UserProfileModalProps {
  user: {
    id: string
    name: string
    email: string
    phone?: string
    company?: string
    role?: string
    status?: string
    checkInTime?: string
    lastSeen?: string
    sessions?: string[]
    avatar?: string
    location?: string
    registrationDate?: string
  } | null
  isOpen: boolean
  onClose: () => void
  onStatusChange?: (userId: string, status: string) => void
}

export function UserProfileModal({ user, isOpen, onClose, onStatusChange }: UserProfileModalProps) {
  if (!user) return null

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "checked-in":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Giriş Yaptı</Badge>
      case "checked-out":
        return <Badge variant="secondary">Çıkış Yaptı</Badge>
      case "registered":
        return <Badge variant="outline">Kayıtlı</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-2xl w-[90%] ">
        <DialogHeader>
          <DialogTitle>Kullanıcı Profili</DialogTitle>
          <DialogDescription>Seçilen kullanıcı hakkında detaylı bilgiler</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={user.avatar || `/placeholder.svg?height=64&width=64&query=${user.name}`}
                alt={user.name}
              />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              {user.role && user.company && (
                <p className="text-muted-foreground">
                  {user.role} - {user.company}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">{user.status && getStatusBadge(user.status)}</div>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-posta
              </Label>
              <p className="text-sm">{user.email}</p>
            </div>

            {user.phone && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefon
                </Label>
                <p className="text-sm">{user.phone}</p>
              </div>
            )}

            {user.company && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Şirket
                </Label>
                <p className="text-sm">{user.company}</p>
              </div>
            )}

            {user.role && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Rol
                </Label>
                <p className="text-sm">{user.role}</p>
              </div>
            )}

            {user.checkInTime && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Giriş Saati
                </Label>
                <p className="text-sm">{user.checkInTime}</p>
              </div>
            )}

            {user.lastSeen && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Son Görülme
                </Label>
                <p className="text-sm">{user.lastSeen}</p>
              </div>
            )}

            {user.location && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Konum
                </Label>
                <p className="text-sm">{user.location}</p>
              </div>
            )}

            {user.registrationDate && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Kayıt Tarihi
                </Label>
                <p className="text-sm">{user.registrationDate}</p>
              </div>
            )}
          </div>

          {/* Sessions */}
          {user.sessions && user.sessions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Kayıtlı Oturumlar</Label>
              <div className="flex flex-wrap gap-2">
                {user.sessions.map((session) => (
                  <Badge key={session} variant="secondary">
                    {session}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {onStatusChange && user.status !== "checked-in" && (
              <Button onClick={() => onStatusChange(user.id, "checked-in")} className="bg-green-600 hover:bg-green-700">
                Giriş Yap
              </Button>
            )}
            {onStatusChange && user.status !== "checked-out" && (
              <Button
                variant="outline"
                onClick={() => onStatusChange(user.id, "checked-out")}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Çıkış Yap
              </Button>
            )}
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              E-posta Gönder
            </Button>
            <Button variant="outline">Düzenle</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
