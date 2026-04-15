'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { auditLogs, AuditLog } from '@/data/mock'
import clsx from 'clsx'

const actionConfig: Record<AuditLog['action'], { label: string; style: string }> = {
  create:  { label: 'Create',  style: 'bg-green-100 text-green-700'  },
  update:  { label: 'Update',  style: 'bg-blue-100 text-blue-700'    },
  delete:  { label: 'Delete',  style: 'bg-red-100 text-red-700'      },
  upload:  { label: 'Upload',  style: 'bg-purple-100 text-purple-700'},
  approve: { label: 'Approve', style: 'bg-teal-100 text-teal-700'    },
  reject:  { label: 'Reject',  style: 'bg-orange-100 text-orange-700'},
  access:  { label: 'Access',  style: 'bg-gray-100 text-gray-600'    },
}

const moduleStyle: Record<AuditLog['module'], string> = {
  'KB Store':       'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Access Request': 'bg-yellow-50 text-yellow-700 border-yellow-100',
  'Document':       'bg-sky-50 text-sky-700 border-sky-100',
  'User':           'bg-pink-50 text-pink-700 border-pink-100',
}

const ALL_ACTIONS = ['all', 'create', 'update', 'delete', 'upload', 'approve', 'reject', 'access'] as const
const ALL_MODULES = ['all', 'KB Store', 'Access Request', 'Document', 'User'] as const

export default function AuditLogList() {
  const [logs] = useState<AuditLog[]>(auditLogs)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [moduleFilter, setModuleFilter] = useState<string>('all')

  const filtered = logs.filter(l => {
    const matchSearch =
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.detail.toLowerCase().includes(search.toLowerCase())
    const matchAction = actionFilter === 'all' || l.action === actionFilter
    const matchModule = moduleFilter === 'all' || l.module === moduleFilter
    return matchSearch && matchAction && matchModule
  })

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by user, target or detail..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>
        <select
          value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {ALL_MODULES.map(m => (
            <option key={m} value={m}>{m === 'all' ? 'All Modules' : m}</option>
          ))}
        </select>
      </div>

      {/* Action filter pills */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter size={13} className="text-gray-400" />
        {ALL_ACTIONS.map(a => (
          <button
            key={a}
            onClick={() => setActionFilter(a)}
            className={clsx(
              'px-3 py-1 text-xs font-medium rounded-full border transition-colors capitalize',
              actionFilter === a
                ? a === 'all'
                  ? 'bg-gray-800 text-white border-gray-800'
                  : actionConfig[a as AuditLog['action']].style + ' border-transparent'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            )}
          >
            {a === 'all' ? `All (${logs.length})` : `${actionConfig[a as AuditLog['action']].label} (${logs.filter(l => l.action === a).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Timestamp</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Module</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Target</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No audit logs found</td>
              </tr>
            ) : filtered.map(log => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap font-mono">{log.timestamp}</td>
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{log.user}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={clsx('px-2 py-0.5 rounded text-xs font-medium border', moduleStyle[log.module])}>
                    {log.module}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', actionConfig[log.action].style)}>
                    {actionConfig[log.action].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate" title={log.target}>{log.target}</td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell max-w-[240px] truncate" title={log.detail}>{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-2">{filtered.length} of {logs.length} entries</p>
    </div>
  )
}
