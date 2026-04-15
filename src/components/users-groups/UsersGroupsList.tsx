'use client'

import { useState } from 'react'
import { Search, Plus, X, Edit2, Trash2, Users, User, ChevronDown } from 'lucide-react'
import { User as UserType, UserGroup, users as initialUsers, userGroups as initialGroups } from '@/data/mock'
import clsx from 'clsx'

const ROLES = ['Admin', 'Engineer', 'Product Manager', 'Sales Manager', 'Sales Rep', 'HR Manager', 'Legal Counsel', 'Compliance Officer']

const groupColors: Record<string, string> = {
  g1: 'bg-purple-100 text-purple-700 border-purple-200',
  g2: 'bg-blue-100 text-blue-700 border-blue-200',
  g3: 'bg-orange-100 text-orange-700 border-orange-200',
  g4: 'bg-green-100 text-green-700 border-green-200',
  g5: 'bg-red-100 text-red-700 border-red-200',
}

function GroupBadge({ group }: { group: UserGroup }) {
  return (
    <span className={clsx('px-2 py-0.5 text-xs rounded-full border font-medium', groupColors[group.id] ?? 'bg-gray-100 text-gray-600 border-gray-200')}>
      {group.name}
    </span>
  )
}

// ── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab({ groups }: { groups: UserGroup[] }) {
  const [users, setUsers] = useState<UserType[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<UserType | null>(null)
  const [form, setForm] = useState({ name: '', email: '', role: '', groupIds: [] as string[] })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    setEditing(null)
    setForm({ name: '', email: '', role: '', groupIds: [] })
    setShowModal(true)
  }

  function openEdit(u: UserType) {
    setEditing(u)
    setForm({ name: u.name, email: u.email, role: u.role, groupIds: [...u.groupIds] })
    setShowModal(true)
  }

  function toggleGroup(gid: string) {
    setForm(f => ({
      ...f,
      groupIds: f.groupIds.includes(gid) ? f.groupIds.filter(x => x !== gid) : [...f.groupIds, gid],
    }))
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.email.trim() || !form.role) return
    if (editing) {
      setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, ...form } : u))
    } else {
      setUsers(prev => [...prev, { id: `u-${crypto.randomUUID()}`, ...form }])
    }
    setShowModal(false)
  }

  function handleDelete(id: string) {
    setUsers(prev => prev.filter(u => u.id !== id))
    setDeleteConfirm(null)
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Groups</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">No users found</td></tr>
            ) : filtered.map(u => {
              const memberGroups = groups.filter(g => u.groupIds.includes(g.id))
              return (
                <tr key={u.id} className="hover:bg-gray-50 group transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {memberGroups.length === 0
                        ? <span className="text-xs text-gray-400 italic">No groups</span>
                        : memberGroups.map(g => <GroupBadge key={g.id} group={g} />)
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(u.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
      <p className="text-xs text-gray-400 mt-2">{filtered.length} of {users.length} users</p>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <User size={16} className="text-blue-600" />
                <h2 className="font-semibold text-gray-800">{editing ? 'Edit User' : 'Add User'}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  autoFocus
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nguyễn Văn A"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="example@company.vn"
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select role...</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Groups <span className="text-gray-400 font-normal">(select one or more)</span></label>
                <div className="flex flex-wrap gap-2">
                  {groups.map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGroup(g.id)}
                      className={clsx(
                        'px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors',
                        form.groupIds.includes(g.id)
                          ? groupColors[g.id] ?? 'bg-blue-100 text-blue-700 border-blue-200'
                          : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                      )}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!form.name.trim() || !form.email.trim() || !form.role}
                className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editing ? 'Save Changes' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
            <Trash2 size={32} className="text-red-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-800 mb-1">Remove this user?</p>
            <p className="text-sm text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">Remove</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Groups Tab ───────────────────────────────────────────────────────────────

function GroupsTab({ users }: { users: UserType[] }) {
  const [groups, setGroups] = useState<UserGroup[]>(initialGroups)
  const [allUsers, setAllUsers] = useState<UserType[]>(users)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<UserGroup | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase())
  )

  function getMembersOf(gid: string) {
    return allUsers.filter(u => u.groupIds.includes(gid))
  }

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

  function handleSubmit() {
    if (!form.name.trim()) return
    if (editing) {
      setGroups(prev => prev.map(g => g.id === editing.id ? { ...g, ...form } : g))
    } else {
      setGroups(prev => [...prev, { id: `g-${crypto.randomUUID()}`, ...form, memberCount: 0 }])
    }
    setShowModal(false)
  }

  function handleDelete(id: string) {
    setGroups(prev => prev.filter(g => g.id !== id))
    // Remove this group from all users
    setAllUsers(prev => prev.map(u => ({ ...u, groupIds: u.groupIds.filter(gid => gid !== id) })))
    setDeleteConfirm(null)
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search groups..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
        >
          <Plus size={14} /> Add Group
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm">No groups found</p>
        ) : filtered.map(g => {
          const members = getMembersOf(g.id)
          const isExpanded = expandedGroup === g.id
          return (
            <div key={g.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', groupColors[g.id]?.split(' ')[0] ?? 'bg-gray-100')}>
                  <Users size={15} className={clsx(groupColors[g.id]?.split(' ')[1] ?? 'text-gray-600')} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{g.name}</p>
                  <p className="text-xs text-gray-400 truncate">{g.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={clsx('px-2.5 py-1 text-xs rounded-full font-medium border', groupColors[g.id] ?? 'bg-gray-100 text-gray-600 border-gray-200')}>
                    {members.length} {members.length === 1 ? 'member' : 'members'}
                  </span>
                  <button
                    onClick={() => openEdit(g)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(g.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                  <button
                    onClick={() => setExpandedGroup(isExpanded ? null : g.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ChevronDown size={14} className={clsx('transition-transform', isExpanded && 'rotate-180')} />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                  {members.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No members in this group</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {members.map(u => (
                        <div key={u.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                            {u.name.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-700 font-medium">{u.name}</span>
                          <span className="text-xs text-gray-400">· {u.role}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-xs text-gray-400 mt-3">{filtered.length} of {groups.length} groups</p>

      {/* Add / Edit Group Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                <h2 className="font-semibold text-gray-800">{editing ? 'Edit Group' : 'Add Group'}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input
                  autoFocus
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Engineering"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Short description of this group..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!form.name.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editing ? 'Save Changes' : 'Add Group'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
            <Trash2 size={32} className="text-red-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-800 mb-1">Delete this group?</p>
            <p className="text-sm text-gray-400 mb-5">Members will be unassigned from this group.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function UsersGroupsList() {
  const [tab, setTab] = useState<'users' | 'groups'>('users')

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab('users')}
          className={clsx(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
            tab === 'users'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          <User size={15} />
          Users
          <span className={clsx('px-1.5 py-0.5 text-xs rounded-full font-semibold', tab === 'users' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500')}>
            {initialUsers.length}
          </span>
        </button>
        <button
          onClick={() => setTab('groups')}
          className={clsx(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
            tab === 'groups'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          <Users size={15} />
          Groups
          <span className={clsx('px-1.5 py-0.5 text-xs rounded-full font-semibold', tab === 'groups' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500')}>
            {initialGroups.length}
          </span>
        </button>
      </div>

      {tab === 'users'
        ? <UsersTab groups={initialGroups} />
        : <GroupsTab users={initialUsers} />
      }
    </div>
  )
}
