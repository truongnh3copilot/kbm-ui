'use client'

import { Search, Bell } from 'lucide-react'
import { useRef, useEffect } from 'react'

interface HeaderProps {
  title: string
  searchAutoFocus?: boolean
  search?: string
  onSearchChange?: (value: string) => void
  hideSearch?: boolean
}

export default function Header({ title, searchAutoFocus, search, onSearchChange, hideSearch }: HeaderProps) {
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchAutoFocus) searchRef.current?.focus()
  }, [searchAutoFocus])

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        {!hideSearch && (
          <div className="relative hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={search ?? ''}
              onChange={e => onSearchChange?.(e.target.value)}
              placeholder="Search knowledge base..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-64 transition-all"
            />
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
