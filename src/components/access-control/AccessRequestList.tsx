'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, MoreVertical, CheckCircle, XCircle, X, MessageSquare } from 'lucide-react'
import { AccessRequest, accessRequests as initialRequests, categories, userGroups } from '@/data/mock'
import clsx from 'clsx'

const statusConfig = {
  pending:  { label: 'Pending',  style: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Approved', style: 'bg-green-100 text-green-700'  },
  rejected: { label: 'Rejected', style: 'bg-red-100 text-red-700'      },
}

const levelConfig = {
  view: { label: 'View Only', style: 'bg-blue-100 text-blue-700'   },
  edit: { label: 'Edit',      style: 'bg-purple-100 text-purple-700' },
}

const CURRENT_USER = 'Alice Johnson'

function ActionMenu({ onApprove, onReject }: { onApprove: () => void; onReject: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 text-sm">
          <button
            onClick={() => { onApprove(); setOpen(false) }}
            className="flex items-center gap-2 w-full px-3 py-2 text-green-700 hover:bg-green-50 transition-colors"
          >
            <CheckCircle size={14} /> Approve
          </button>
          <button
            onClick={() => { onReject(); setOpen(false) }}
            className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
          >
            <XCircle size={14} /> Reject
          </button>
        </div>
      )}
    </div>
  )
}

export default function AccessRequestList() {
  const [requests, setRequests] = useState<AccessRequest[]>(initialRequests)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState({ groupId: '', categoryId: '', levels: [] as ('view' | 'edit')[] })

  // Confirm modal state
  const [confirm, setConfirm] = useState<{ id: string; action: 'approved' | 'rejected'; comment: string } | null>(null)

  const visibleRequests = statusFilter === 'all' ? requests : requests.filter(r => r.status === statusFilter)

  function openConfirm(id: string, action: 'approved' | 'rejected') {
    setConfirm({ id, action, comment: '' })
  }

  function handleConfirm() {
    if (!confirm) return
    setRequests(prev => prev.map(r =>
      r.id === confirm.id
        ? { ...r, status: confirm.action, comment: confirm.comment.trim() || undefined, reviewedBy: CURRENT_USER }
        : r
    ))
    setConfirm(null)
  }

  function toggleLevel(level: 'view' | 'edit') {
    setForm(f => ({
      ...f,
      levels: f.levels.includes(level) ? f.levels.filter(l => l !== level) : [...f.levels, level],
    }))
  }

  function handleSubmit() {
    if (!form.groupId || !form.categoryId || form.levels.length === 0) return
    const req: AccessRequest = {
      id: `r-${crypto.randomUUID()}`,
      requester: CURRENT_USER,
      groupId: form.groupId,
      categoryId: form.categoryId,
      levels: form.levels,
      status: 'pending',
      requestedAt: new Date().toISOString().slice(0, 10),
    }
    setRequests(prev => [req, ...prev])
    setShowAddModal(false)
    setForm({ groupId: '', categoryId: '', levels: [] })
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize',
                statusFilter === s
                  ? s === 'all'      ? 'bg-gray-800 text-white border-gray-800'
                  : s === 'pending'  ? 'bg-yellow-500 text-white border-yellow-500'
                  : s === 'approved' ? 'bg-green-600 text-white border-green-600'
                                     : 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              )}
            >
              {s === 'all' ? `All (${requests.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${requests.filter(r => r.status === s).length})`}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={15} /> Add Permission
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Requester</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Group</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Access Level</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Comment</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {visibleRequests.map(r => {
              const group = userGroups.find(g => g.id === r.groupId)
              const category = categories.find(c => c.id === r.categoryId)
              return (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{r.requester}</td>
                  <td className="px-4 py-3 text-gray-600">{group?.name ?? r.groupId}</td>
                  <td className="px-4 py-3 text-gray-600">{category?.name ?? r.categoryId}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.levels.map(level => (
                        <span key={level} className={clsx('px-2 py-0.5 rounded text-xs font-medium', levelConfig[level].style)}>
                          {levelConfig[level].label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', statusConfig[r.status].style)}>
                      {statusConfig[r.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{r.requestedAt}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {r.comment ? (
                      <div className="flex items-start gap-1.5 max-w-[200px]">
                        <MessageSquare size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-500 truncate" title={r.comment}>{r.comment}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {r.status === 'pending' && (
                      <ActionMenu
                        onApprove={() => openConfirm(r.id, 'approved')}
                        onReject={() => openConfirm(r.id, 'rejected')}
                      />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Confirm Approve/Reject Modal */}
      {confirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {confirm.action === 'approved'
                  ? <CheckCircle size={18} className="text-green-600" />
                  : <XCircle size={18} className="text-red-500" />
                }
                <h2 className="font-semibold text-gray-800">
                  {confirm.action === 'approved' ? 'Approve Request' : 'Reject Request'}
                </h2>
              </div>
              <button onClick={() => setConfirm(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to{' '}
                <span className={confirm.action === 'approved' ? 'text-green-700 font-medium' : 'text-red-600 font-medium'}>
                  {confirm.action}
                </span>{' '}
                this request?
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                autoFocus
                value={confirm.comment}
                onChange={e => setConfirm(c => c ? { ...c, comment: e.target.value } : c)}
                placeholder="Add a note..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={clsx(
                  'px-4 py-2 text-sm text-white font-medium rounded-lg transition-colors',
                  confirm.action === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
                )}
              >
                {confirm.action === 'approved' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Permission Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Add Permission Request</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.categoryId}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
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
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
