import MainLayout from '@/components/layout/MainLayout'
import AuditLogList from '@/components/audit/AuditLogList'

export default function AuditLogPage() {
  return (
    <MainLayout title="Audit Log">
      <AuditLogList />
    </MainLayout>
  )
}
