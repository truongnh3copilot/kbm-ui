'use client'

import Link from 'next/link'
import { MoreVertical, FileText, Clock, Edit2, Trash2, User, Shield, Heart } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Category, userGroups } from '@/data/mock'
import clsx from 'clsx'

interface Props {
  category: Category
  onEdit: (c: Category) => void
  onDelete: (id: string) => void
}

export default function CategoryCard({ category, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(() => {
    // stable seed from category id so server and client agree
    const seed = category.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return (seed * 7) % 20
  })
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const groups = userGroups.filter(g => category.permissionGroups.includes(g.id))

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative flex flex-col">
      {/* Top color strip */}
      <div className={clsx('h-1.5 rounded-t-xl', category.color.split(' ')[0])} />

      <div className="p-4 flex flex-col flex-1">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/knowledge/${category.id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
              {category.name}
            </h3>
          </Link>

          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <MoreVertical size={14} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 text-sm z-10">
                <button
                  onClick={() => { onEdit(category); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => { onDelete(category.id); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-gray-50"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 flex-1">{category.description}</p>

        {/* Created by */}
        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
          <User size={11} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">Created by <span className="font-medium text-gray-700">{category.createdBy}</span></span>
        </div>

        {/* Permission groups */}
        <div className="mt-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Shield size={11} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-400">Access groups</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {groups.length === 0 ? (
              <span className="text-xs text-gray-400 italic">No groups assigned</span>
            ) : groups.map(g => (
              <span
                key={g.id}
                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 font-medium border border-gray-200"
              >
                {g.name}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FileText size={11} />
              <span>{category.documentCount} docs</span>
            </div>
            <button
              onClick={e => { e.preventDefault(); setLiked(v => !v); setLikeCount(c => liked ? c - 1 : c + 1) }}
              className="flex items-center gap-1 text-xs transition-colors"
            >
              <Heart
                size={13}
                className={clsx('transition-colors', liked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400')}
              />
              <span className={clsx('font-medium', liked ? 'text-red-500' : 'text-gray-400')}>{likeCount}</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock size={11} />
            <span>{category.lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
