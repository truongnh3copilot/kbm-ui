'use client'

import { useState } from 'react'
import { Plus, X, Search } from 'lucide-react'
import CategoryCard from './CategoryCard'
import { Category, categories as initialCategories } from '@/data/mock'

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', description: '', embeddingModel: '' })

  const embeddingModels = [
    { value: 'text-embedding-3-small', label: 'OpenAI — text-embedding-3-small' },
    { value: 'text-embedding-3-large', label: 'OpenAI — text-embedding-3-large' },
    { value: 'text-embedding-ada-002', label: 'OpenAI — text-embedding-ada-002' },
    { value: 'embed-english-v3.0', label: 'Cohere — embed-english-v3.0' },
    { value: 'embed-multilingual-v3.0', label: 'Cohere — embed-multilingual-v3.0' },
    { value: 'voyage-3', label: 'Voyage AI — voyage-3' },
    { value: 'voyage-3-lite', label: 'Voyage AI — voyage-3-lite' },
    { value: 'bge-m3', label: 'BAAI — bge-m3 (local)' },
    { value: 'bge-large-en-v1.5', label: 'BAAI — bge-large-en-v1.5 (local)' },
  ]

  const filteredCategories = categories
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))

  function openAdd() {
    setEditing(null)
    setForm({ name: '', description: '', embeddingModel: '' })
    setShowModal(true)
  }

  function openEdit(c: Category) {
    setEditing(c)
    setForm({ name: c.name, description: c.description, embeddingModel: c.embeddingModel ?? '' })
    setShowModal(true)
  }

  function handleSubmit() {
    if (!form.name.trim()) return
    if (editing) {
      setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c))
    } else {
      const newCat: Category = {
        id: `c-${crypto.randomUUID()}`,
        name: form.name,
        description: form.description,
        embeddingModel: form.embeddingModel || undefined,
        documentCount: 0,
        lastUpdated: new Date().toISOString().slice(0, 10),
        color: 'bg-blue-100 text-blue-700',
        createdBy: 'Alice Johnson',
        permissionGroups: [],
      }
      setCategories(prev => [newCat, ...prev])
    }
    setShowModal(false)
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 gap-3">
        <p className="text-sm text-gray-500 flex-shrink-0">{filteredCategories.length} categories</p>
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white w-56 transition-all"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            <Plus size={15} />
            Add Category
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.map(cat => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onEdit={openEdit}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">{editing ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Engineering Wiki"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Short description..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Embedding Model</label>
                <select
                  value={form.embeddingModel}
                  onChange={e => setForm(f => ({ ...f, embeddingModel: e.target.value }))}
                  disabled={!!editing}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="">— Select a model —</option>
                  {embeddingModels.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                {editing ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
