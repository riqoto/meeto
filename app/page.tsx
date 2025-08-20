import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsOverview } from "@/components/analytics-overview"



export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AnalyticsOverview />
      </div>
    </DashboardLayout>
  )
}
