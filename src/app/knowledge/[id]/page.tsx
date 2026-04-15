import MainLayout from '@/components/layout/MainLayout'
import DocumentList from '@/components/knowledge/DocumentList'
import ChatPanel from '@/components/knowledge/ChatPanel'
import KBInfoCard from '@/components/knowledge/KBInfoCard'
import { categories, userGroups } from '@/data/mock'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Props {
  params: { id: string }
}

export default function CategoryDetailPage({ params }: Props) {
  const category = categories.find(c => c.id === params.id)

  if (!category) {
    return (
      <MainLayout title="Not Found">
        <p className="text-gray-500">Category not found.</p>
      </MainLayout>
    )
  }

  const groups = userGroups.filter(g => category.permissionGroups.includes(g.id))

  return (
    <MainLayout title={category.name}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/knowledge" className="hover:text-blue-600 transition-colors">Knowledge Base</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium">{category.name}</span>
      </div>

      <KBInfoCard category={category} groups={groups} initialLikes={12} />

      {/* Split layout */}
      <div className="flex gap-5 h-[calc(100vh-320px)] min-h-[420px]">
        {/* Left: Documents */}
        <div className="flex-1 min-w-0">
          <DocumentList categoryId={category.id} />
        </div>

        {/* Right: Chat */}
        <div className="w-[380px] flex-shrink-0 hidden lg:block">
          <ChatPanel categoryId={category.id} categoryName={category.name} />
        </div>
      </div>
    </MainLayout>
  )
}
