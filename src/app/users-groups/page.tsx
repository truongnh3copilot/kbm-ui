import MainLayout from '@/components/layout/MainLayout'
import UsersGroupsList from '@/components/users-groups/UsersGroupsList'

export default function UsersGroupsPage() {
  return (
    <MainLayout title="Users & Groups">
      <UsersGroupsList />
    </MainLayout>
  )
}
