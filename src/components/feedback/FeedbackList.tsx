'use client'

import { useState } from 'react'
import { Search, X, Trash2, CheckCheck, BookOpen, Mail, MailOpen, MessageSquare } from 'lucide-react'
import { Feedback, feedbacks as initialFeedbacks, categories } from '@/data/mock'
import clsx from 'clsx'

const STATUS_CONFIG = {
  unread:   { label: 'Unread',   style: 'bg-blue-100 text-blue-700 border-blue-200',   dot: 'bg-blue-500' },
  read:     { label: 'Read',     style: 'bg-gray-100 text-gray-600 border-gray-200',   dot: 'bg-gray-400' },
  resolved: { label: 'Resolved', style: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
}

const FILTERS = ['All', 'Unread', 'Read', 'Resolved'] as const
type Filter = typeof FILTERS[number]

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Filter>('All')
  const [selected, setSelected] = useState<Feedback | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const counts: Record<Filter, number> = {
    All:      feedbacks.length,
    Unread:   feedbacks.filter(f => f.status === 'unread').length,
    Read:     feedbacks.filter(f => f.status === 'read').length,
    Resolved: feedbacks.filter(f => f.status === 'resolved').length,
  }

  const filtered = feedbacks.filter(f => {
    const matchStatus = statusFilter === 'All' || f.status === statusFilter.toLowerCase()
    const matchSearch = f.subject.toLowerCase().includes(search.toLowerCase()) ||
      f.fromUser.toLowerCase().includes(search.toLowerCase()) ||
      f.toUser.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  function getCategoryName(id: string) {
    return categories.find(c => c.id === id)?.name ?? id
  }

  function getCategoryColor(id: string) {
    return categories.find(c => c.id === id)?.color ?? 'bg-gray-100 text-gray-600'
  }

  function markAs(id: string, status: Feedback['status']) {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status } : f))
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
  }

  function handleDelete(id: string) {
    setFeedbacks(prev => prev.filter(f => f.id !== id))
    setDeleteConfirm(null)
    if (selected?.id === id) setSelected(null)
  }

  function openDetail(f: Feedback) {
    setSelected(f)
    // Auto-mark unread → read when opened
    if (f.status === 'unread') markAs(f.id, 'read')
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by subject, sender or recipient..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors',
              statusFilter === f
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            )}
          >
            {f}
            <span className={clsx(
              'px-1.5 py-0.5 rounded-full text-xs font-semibold',
              statusFilter === f ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            )}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">From</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">To</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">KB Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Sent</th>
              <th className="px-4 py-3 w-16" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">No feedback found</td>
              </tr>
            ) : filtered.map(f => {
              const cfg = STATUS_CONFIG[f.status]
              const isUnread = f.status === 'unread'
              return (
                <tr
                  key={f.id}
                  onClick={() => openDetail(f)}
                  className={clsx(
                    'hover:bg-blue-50/40 cursor-pointer transition-colors group',
                    isUnread && 'bg-blue-50/30'
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', isUnread ? 'bg-blue-500' : 'bg-transparent')} />
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {f.fromUser.charAt(0)}
                      </div>
                      <span className={clsx('truncate max-w-[120px]', isUnread ? 'font-semibold text-gray-900' : 'text-gray-700')}>{f.fromUser}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    <span className="truncate max-w-[120px] block">{f.toUser}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={clsx('px-2 py-0.5 text-xs rounded font-medium', getCategoryColor(f.categoryId))}>
                      {getCategoryName(f.categoryId)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className={clsx('truncate max-w-[200px]', isUnread ? 'font-semibold text-gray-900' : 'text-gray-700')}>{f.subject}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px] mt-0.5">{f.message.split('\n')[0]}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={clsx('px-2 py-0.5 text-xs rounded-full border font-medium', cfg.style)}>{cfg.label}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell whitespace-nowrap">{f.sentAt.slice(0, 10)}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {f.status === 'unread' && (
                        <button
                          onClick={() => markAs(f.id, 'read')}
                          title="Mark as Read"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <MailOpen size={13} />
                        </button>
                      )}
                      {f.status !== 'resolved' && (
                        <button
                          onClick={() => markAs(f.id, 'resolved')}
                          title="Resolve"
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          <CheckCheck size={13} />
                        </button>
                      )}
                      {f.status === 'resolved' && (
                        <button
                          onClick={() => markAs(f.id, 'read')}
                          title="Reopen"
                          className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors"
                        >
                          <Mail size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(f.id)}
                        title="Delete"
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2">{filtered.length} of {feedbacks.length} feedbacks</p>

      {/* Detail Modal */}
      {selected && (() => {
        const cfg = STATUS_CONFIG[selected.status]
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-blue-600 flex-shrink-0" />
                  <h2 className="font-semibold text-gray-800 leading-snug">{selected.subject}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 ml-3 flex-shrink-0">
                  <X size={18} />
                </button>
              </div>

              {/* Meta */}
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-xs text-gray-400 block">From</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      {selected.fromUser.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-700">{selected.fromUser}</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">To</span>
                  <span className="font-medium text-gray-700">{selected.toUser}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">KB Category</span>
                  <span className={clsx('px-2 py-0.5 text-xs rounded font-medium', getCategoryColor(selected.categoryId))}>
                    {getCategoryName(selected.categoryId)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Sent at</span>
                  <span className="text-gray-600 text-xs">{selected.sentAt}</span>
                </div>
              </div>

              {/* Message */}
              <div className="px-5 py-4 flex-1 overflow-y-auto">
                <div className="flex items-center gap-1.5 mb-3">
                  <BookOpen size={13} className="text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Message</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selected.message}</p>
              </div>

              {/* Footer actions */}
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <span className={clsx('px-2.5 py-1 text-xs rounded-full border font-medium', cfg.style)}>
                  {cfg.label}
                </span>
                <div className="flex items-center gap-2">
                  {selected.status !== 'read' && selected.status !== 'resolved' && (
                    <button
                      onClick={() => markAs(selected.id, 'read')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MailOpen size={13} /> Mark as Read
                    </button>
                  )}
                  {selected.status !== 'resolved' && (
                    <button
                      onClick={() => markAs(selected.id, 'resolved')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 border border-green-300 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <CheckCheck size={13} /> Resolve
                    </button>
                  )}
                  <button
                    onClick={() => { setDeleteConfirm(selected.id) }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
            <Trash2 size={32} className="text-red-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-800 mb-1">Delete this feedback?</p>
            <p className="text-sm text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
