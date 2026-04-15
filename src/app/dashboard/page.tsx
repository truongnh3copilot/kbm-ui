import MainLayout from '@/components/layout/MainLayout'
import SummaryCards from '@/components/dashboard/SummaryCards'
import Charts from '@/components/dashboard/Charts'

export default function DashboardPage() {
  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        <SummaryCards />
        <Charts />
      </div>
    </MainLayout>
  )
}
