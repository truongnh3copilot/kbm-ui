'use client'

import { useState } from 'react'
import { Save, CheckCircle } from 'lucide-react'
import { categories, userGroups, permissions as initialPerms, Permission } from '@/data/mock'
import clsx from 'clsx'

type Level = 'none' | 'view' | 'edit'

const levelConfig: Record<Level, { label: string; style: string }> = {
  none: { label: 'No Access', style: 'bg-gray-100 text-gray-500' },
  view: { label: 'View Only', style: 'bg-blue-100 text-blue-700' },
  edit: { label: 'Edit', style: 'bg-green-100 text-green-700' },
}

export default function PermissionMatrix() {
  const [perms, setPerms] = useState<Permission[]>(initialPerms)
  const [saved, setSaved] = useState(false)

  function getLevel(groupId: string, categoryId: string): Level {
    return perms.find(p => p.groupId === groupId && p.categoryId === categoryId)?.level ?? 'none'
  }

  function cycleLevel(groupId: string, categoryId: string) {
    const order: Level[] = ['none', 'view', 'edit']
    const current = getLevel(groupId, categoryId)
    const next = order[(order.indexOf(current) + 1) % order.length]
    setPerms(prev => {
      const exists = prev.find(p => p.groupId === groupId && p.categoryId === categoryId)
      if (exists) return prev.map(p => p.groupId === groupId && p.categoryId === categoryId ? { ...p, level: next } : p)
      return [...prev, { groupId, categoryId, level: next }]
    })
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Permission Matrix</h3>
        <button
          onClick={handleSave}
          className={clsx(
            'flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
            saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          )}
        >
          {saved ? <><CheckCircle size={13} /> Saved!</> : <><Save size={13} /> Save Changes</>}
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="text-xs text-gray-400">Click cells to toggle permission:</span>
        {(Object.entries(levelConfig) as [Level, typeof levelConfig[Level]][]).map(([k, v]) => (
          <span key={k} className={clsx('px-2 py-0.5 text-xs rounded font-medium', v.style)}>{v.label}</span>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[160px]">Category</th>
              {userGroups.map(g => (
                <th key={g.id} className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[110px]">
                  {g.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-700 text-xs">{cat.name}</td>
                {userGroups.map(g => {
                  const level = getLevel(g.id, cat.id)
                  const { label, style } = levelConfig[level]
                  return (
                    <td key={g.id} className="px-4 py-3 text-center">
                      <button
                        onClick={() => cycleLevel(g.id, cat.id)}
                        className={clsx('px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80 hover:scale-105', style)}
                      >
                        {label}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
