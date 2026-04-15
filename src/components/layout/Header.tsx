'use client'

import { Search, Bell, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface HeaderProps {
  title: string
  searchAutoFocus?: boolean
  search?: string
  onSearchChange?: (value: string) => void
}

export default function Header({ title, searchAutoFocus, search, onSearchChange }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchAutoFocus) searchRef.current?.focus()
  }, [searchAutoFocus])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showDropdown) return
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
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

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(prev => !prev)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
              A
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">Alice Johnson</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 text-sm z-20">
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Profile</a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Settings</a>
              <hr className="my-1 border-gray-100" />
              <a href="#" className="block px-4 py-2 text-red-600 hover:bg-gray-50">Sign out</a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
