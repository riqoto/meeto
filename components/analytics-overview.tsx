"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltip } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Users, Clock, MapPin, Zap, CheckCircle, QrCode } from "lucide-react"
import { Area, AreaChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { StatCard } from "@/components/ui/stat-card"

const attendanceData = [
  { time: "09:00", attendees: 120 },
  { time: "10:00", attendees: 280 },
  { time: "11:00", attendees: 450 },
  { time: "12:00", attendees: 680 },
  { time: "13:00", attendees: 520 },
  { time: "14:00", attendees: 750 },
  { time: "15:00", attendees: 890 },
  { time: "16:00", attendees: 920 },
  { time: "17:00", attendees: 850 },
]

const sessionData = [
  { session: "Ana Konuşma", attendees: 892, capacity: 1000 },
  { session: "Teknoloji Sunumu A", attendees: 245, capacity: 300 },
  { session: "Atölye B", attendees: 180, capacity: 200 },
  { session: "Panel Tartışması", attendees: 320, capacity: 400 },
  { session: "Networking", attendees: 450, capacity: 500 },
]

const demographicData = [
  { name: "Geliştiriciler", value: 45, color: "#3b82f6" },
  { name: "Tasarımcılar", value: 25, color: "#10b981" },
  { name: "Ürün Müdürleri", value: 15, color: "#f59e0b" },
  { name: "Öğrenciler", value: 10, color: "#ef4444" },
  { name: "Diğerleri", value: 5, color: "#8b5cf6" },
]

const engagementData = [
  { metric: "QR Taramaları", current: 2847, previous: 2410, change: 18.1 },
  { metric: "Oturum Katılımları", current: 1234, previous: 1180, change: 4.6 },
  { metric: "Uygulama İndirmeleri", current: 892, previous: 756, change: 18.0 },
  { metric: "Gönderilen Geri Bildirimler", current: 456, previous: 523, change: -12.8 },
]

export function AnalyticsOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Toplam Katılımcılar"
          value="1,234"
          icon={Users}
          iconColor="text-blue-500"
          trend={{ value: 12, label: "geçen etkinlikten" }}
        />
        <StatCard
          title="Şu Anda Mevcut"
          value="892"
          description="72% katılım oranı"
          icon={CheckCircle}
          iconColor="text-green-500"
        />
        <StatCard
          title="Bugün QR Taramaları"
          value="2,847"
          icon={QrCode}
          iconColor="text-purple-500"
          trend={{ value: 18, label: "dünden" }}
        />
        <StatCard
          title="Aktif Oturumlar"
          value="24"
          description="8 oturum devam ediyor"
          icon={Clock}
          iconColor="text-orange-500"
        />
      </div>

      {/* Real-time Attendance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Gerçek Zamanlı Katılım
          </CardTitle>
          <CardDescription>Gün boyunca canlı katılımcı sayısı</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttendees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "currentColor" }}
                  className="text-muted-foreground"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "currentColor" }}
                  className="text-muted-foreground"
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Saat</span>
                              <span className="font-bold text-muted-foreground">{label}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Katılımcılar</span>
                              <span className="font-bold">{payload[0].value}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attendees"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAttendees)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Session Capacity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Oturum Kapasitesi
            </CardTitle>
            <CardDescription>Oturumlara göre mevcut katılım vs kapasite</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessionData.map((session) => {
                const percentage = (session.attendees / session.capacity) * 100
                return (
                  <div key={session.session} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{session.session}</span>
                      <span className="text-muted-foreground">
                        {session.attendees}/{session.capacity}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>%{percentage.toFixed(1)} dolu</span>
                      <Badge variant={percentage > 90 ? "destructive" : percentage > 70 ? "secondary" : "outline"}>
                        {percentage > 90 ? "Dolu" : percentage > 70 ? "Yoğun" : "Müsait"}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Attendee Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Katılımcı Demografikleri
            </CardTitle>
            <CardDescription>Meslek rolüne göre dağılım</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographicData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {demographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Rol</span>
                                <span className="font-bold text-muted-foreground">{data.name}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Yüzde</span>
                                <span className="font-bold">%{data.value}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demographicData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium ml-auto">%{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Etkileşim Metrikleri
          </CardTitle>
          <CardDescription>Önceki etkinlikle karşılaştırılan temel performans göstergeleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {engagementData.map((metric) => (
              <div key={metric.metric} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.metric}</span>
                  <div className="flex items-center gap-1">
                    {metric.change > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${metric.change > 0 ? "text-green-500" : "text-red-500"}`}>
                      {metric.change > 0 ? "+" : ""}%{metric.change.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold">{metric.current.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Önceki: {metric.previous.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Canlı Aktivite Akışı
          </CardTitle>
          <CardDescription>Son kullanıcı etkileşimleri ve sistem olayları</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "2 dk önce", event: "Yeni katılımcı giriş yaptı", user: "Sarah Johnson", type: "giriş" },
              { time: "3 dk önce", event: "QR kod tarandı", user: "Mike Chen", type: "tarama" },
              {
                time: "5 dk önce",
                event: "Oturum geri bildirimi gönderildi",
                user: "Alex Rivera",
                type: "geri bildirim",
              },
              { time: "7 dk önce", event: "Atölye kapasitesine ulaşıldı", user: "Sistem", type: "uyarı" },
              { time: "8 dk önce", event: "Yeni katılımcı kaydoldu", user: "Emma Davis", type: "kayıt" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{activity.event}</span>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.user}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
