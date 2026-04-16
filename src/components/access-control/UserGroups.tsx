'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Users, X } from 'lucide-react'
import { UserGroup, userGroups as initialGroups } from '@/data/mock'

export default function UserGroups() {
  const [groups, setGroups] = useState<UserGroup[]>(initialGroups)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<UserGroup | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })

  function openAdd() {
    setEditing(null)
    setForm({ name: '', description: '' })
    setShowModal(true)
  }

  function openEdit(g: UserGroup) {
    setEditing(g)
    setForm({ name: g.name, description: g.description })
    setShowModal(true)
  }

  function handleDelete(id: string) {
    setGroups(prev => prev.filter(g => g.id !== id))
  }

  function handleSubmit() {
    if (!form.name.trim()) return
    if (editing) {
      setGroups(prev => prev.map(g => g.id === editing.id ? { ...g, ...form } : g))
    } else {
      setGroups(prev => [...prev, { id: `g-${crypto.randomUUID()}`, memberCount: 0, ...form }])
    }
    setShowModal(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">User Groups</h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={13} /> Add Group
        </button>
      </div>

      <div className="space-y-2">
        {groups.map(g => (
          <div key={g.id} className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow group">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Users size={16} className="text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{g.name}</p>
              <p className="text-xs text-gray-400">{g.memberCount} members · {g.description}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(g)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                <Edit2 size={13} />
              </button>
              <button onClick={() => handleDelete(g.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">{editing ? 'Edit Group' : 'Add Group'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Engineering" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-black text-white font-medium rounded-lg hover:bg-gray-800">{editing ? 'Save' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
