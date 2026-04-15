import MainLayout from '@/components/layout/MainLayout'
import AccessRequestList from '@/components/access-control/AccessRequestList'

export default function AccessControlPage() {
  return (
    <MainLayout title="Access Request">
      <AccessRequestList />
    </MainLayout>
  )
}
