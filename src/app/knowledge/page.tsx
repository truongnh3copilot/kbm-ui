'use client'

import MainLayout from '@/components/layout/MainLayout'
import CategoryGrid from '@/components/knowledge/CategoryGrid'

export default function KnowledgePage() {
  return (
    <MainLayout title="Knowledge Base Store" hideSearch>
      <CategoryGrid />
    </MainLayout>
  )
}
