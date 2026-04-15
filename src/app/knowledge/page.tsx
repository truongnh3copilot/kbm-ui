'use client'

import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import CategoryGrid from '@/components/knowledge/CategoryGrid'

export default function KnowledgePage() {
  const [search, setSearch] = useState('')

  return (
    <MainLayout title="Knowledge Base Store" searchAutoFocus search={search} onSearchChange={setSearch}>
      <CategoryGrid search={search} />
    </MainLayout>
  )
}
