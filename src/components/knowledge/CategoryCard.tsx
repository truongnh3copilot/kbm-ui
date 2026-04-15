'use client'

import Link from 'next/link'
import { MoreVertical, FileText, Clock, Edit2, User, Shield, Heart, ShieldCheck, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Category, userGroups, currentUser } from '@/data/mock'
import clsx from 'clsx'

const levelConfig = {
  view: { label: 'View Only', style: 'bg-blue-100 text-blue-700' },
  edit: { label: 'Edit',      style: 'bg-purple-100 text-purple-700' },
}

interface Props {
  category: Category
  onEdit: (c: Category) => void
}

export default function CategoryCard({ category, onEdit }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(() => {
    const seed = category.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return (seed * 7) % 20
  })
  const [showAccessModal, setShowAccessModal] = useState(false)
  const [form, setForm] = useState({ groupId: '', levels: [] as ('view' | 'edit')[] })
  const [submitted, setSubmitted] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const groups = userGroups.filter(g => category.permissionGroups.includes(g.id))

  function toggleLevel(level: 'view' | 'edit') {
    setForm(f => ({
      ...f,
      levels: f.levels.includes(level) ? f.levels.filter(l => l !== level) : [...f.levels, level],
    }))
  }

  function handleSubmit() {
    if (!form.groupId || form.levels.length === 0) return
    setSubmitted(true)
    setTimeout(() => {
      setShowAccessModal(false)
      setSubmitted(false)
      setForm({ groupId: '', levels: [] })
    }, 1500)
  }

  function openAccessModal() {
    setMenuOpen(false)
    setForm({ groupId: '', levels: [] })
    setSubmitted(false)
    setShowAccessModal(true)
  }

  return (
    <>
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
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 text-sm z-10">
                  <button
                    onClick={() => { onEdit(category); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={openAccessModal}
                    className="w-full flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50"
                  >
                    <ShieldCheck size={13} /> Access Request
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
                <span key={g.id} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 font-medium border border-gray-200">
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
                <Heart size={13} className={clsx('transition-colors', liked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400')} />
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

      {/* Access Request Modal */}
      {showAccessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-600" />
                <h2 className="font-semibold text-gray-800">Access Request</h2>
              </div>
              <button onClick={() => setShowAccessModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            {submitted ? (
              <div className="px-5 py-10 flex flex-col items-center gap-3 text-center">
                <ShieldCheck size={36} className="text-green-500" />
                <p className="font-medium text-gray-800">Request submitted!</p>
                <p className="text-sm text-gray-400">Your access request is pending approval.</p>
              </div>
            ) : (
              <>
                <div className="px-5 py-4 space-y-4">
                  {/* Category — pre-filled, read-only */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className={clsx('px-2 py-0.5 rounded text-xs font-semibold', category.color)}>{category.name}</span>
                    </div>
                  </div>

                  {/* Requester — current user, read-only */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requester</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                      {currentUser.name}
                    </div>
                  </div>

                  {/* Group */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                    <select
                      value={form.groupId}
                      onChange={e => setForm(f => ({ ...f, groupId: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select group...</option>
                      {userGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>

                  {/* Access Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                    <div className="flex gap-2">
                      {(['view', 'edit'] as const).map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => toggleLevel(level)}
                          className={clsx(
                            'flex-1 py-2 rounded-lg text-sm font-medium border transition-colors',
                            form.levels.includes(level)
                              ? levelConfig[level].style + ' border-transparent'
                              : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                          )}
                        >
                          {levelConfig[level].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
                  <button onClick={() => setShowAccessModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                  <button
                    onClick={handleSubmit}
                    disabled={!form.groupId || form.levels.length === 0}
                    className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
