import { DashboardLayout } from "@/components/dashboard-layout"
import { EventLogs } from "@/components/event-logs"

export default function LogsPage() {
  return (
    <DashboardLayout>
      <EventLogs />
    </DashboardLayout>
  )
}
