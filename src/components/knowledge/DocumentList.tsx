'use client'

import { useState, useRef } from 'react'
import { Upload, Trash2, Download, Search, FileText, Filter, AlertCircle, X, Link2, Loader2, CheckSquare, Square } from 'lucide-react'
import { Document, documents as allDocs } from '@/data/mock'
import clsx from 'clsx'

const ALLOWED_TYPES: Record<string, Document['type']> = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'text/plain': 'TXT',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
}
const ALLOWED_EXTENSIONS = '.pdf,.docx,.txt,.xlsx,.pptx'

const typeColors: Record<string, string> = {
  PDF: 'bg-red-100 text-red-700',
  DOCX: 'bg-blue-100 text-blue-700',
  TXT: 'bg-gray-100 text-gray-600',
  XLSX: 'bg-green-100 text-green-700',
  PPTX: 'bg-orange-100 text-orange-700',
}

function FileTypeIcon({ type }: { type: string }) {
  if (type === 'DOCX') return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="flex-shrink-0">
      <rect width="36" height="36" rx="7" fill="#2B579A"/>
      <path d="M7 10h14l4 4v12H7V10z" fill="#fff" fillOpacity=".15"/>
      <path d="M21 10v4h4" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="1"/>
      <text x="18" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial,sans-serif">W</text>
    </svg>
  )
  if (type === 'XLSX') return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="flex-shrink-0">
      <rect width="36" height="36" rx="7" fill="#217346"/>
      <path d="M7 10h14l4 4v12H7V10z" fill="#fff" fillOpacity=".1"/>
      <text x="18" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial,sans-serif">X</text>
    </svg>
  )
  if (type === 'PPTX') return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="flex-shrink-0">
      <rect width="36" height="36" rx="7" fill="#D24726"/>
      <path d="M7 10h14l4 4v12H7V10z" fill="#fff" fillOpacity=".1"/>
      <text x="18" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial,sans-serif">P</text>
    </svg>
  )
  if (type === 'PDF') return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="flex-shrink-0">
      <rect width="36" height="36" rx="7" fill="#E8392A"/>
      <rect x="8" y="8" width="14" height="18" rx="2" fill="white" fillOpacity=".2"/>
      <path d="M8 8h10l6 6v12a2 2 0 01-2 2H10a2 2 0 01-2-2V8z" fill="white" fillOpacity=".15"/>
      <path d="M18 8v6h6" stroke="white" strokeOpacity=".5" strokeWidth="1"/>
      <text x="18" y="27" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial,sans-serif">PDF</text>
    </svg>
  )
  if (type === 'TXT') return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="flex-shrink-0">
      <rect width="36" height="36" rx="7" fill="#6B7280"/>
      <rect x="9" y="11" width="18" height="2" rx="1" fill="white" fillOpacity=".8"/>
      <rect x="9" y="16" width="14" height="2" rx="1" fill="white" fillOpacity=".6"/>
      <rect x="9" y="21" width="16" height="2" rx="1" fill="white" fillOpacity=".6"/>
    </svg>
  )
  // fallback
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="flex-shrink-0">
      <rect width="36" height="36" rx="7" fill="#9CA3AF"/>
      <text x="18" y="23" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial,sans-serif">{type}</text>
    </svg>
  )
}

// Mock Confluence attachments returned after "Load Content"
const MOCK_CONFLUENCE_FILES = [
  { id: 'cf-1', name: 'Architecture_Overview.pdf',    type: 'PDF',  size: '1.8 MB' },
  { id: 'cf-2', name: 'API_Reference_v3.docx',         type: 'DOCX', size: '540 KB' },
  { id: 'cf-3', name: 'Deployment_Runbook.txt',        type: 'TXT',  size: '32 KB'  },
  { id: 'cf-4', name: 'Sprint_Metrics_Q1.xlsx',        type: 'XLSX', size: '210 KB' },
  { id: 'cf-5', name: 'Product_Roadmap_2026.pptx',     type: 'PPTX', size: '3.2 MB' },
]

interface ConfluenceFile { id: string; name: string; type: string; size: string }

interface Props {
  categoryId: string
}

export default function DocumentList({ categoryId }: Props) {
  const [docs, setDocs] = useState<Document[]>(allDocs.filter(d => d.categoryId === categoryId))
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Upload modal
  const [showModal, setShowModal] = useState(false)
  const [modalTab, setModalTab] = useState<'file' | 'confluence'>('file')

  // File tab state
  const [dragOver, setDragOver] = useState(false)
  const [stagedFiles, setStagedFiles] = useState<File[]>([])

  // Confluence tab state
  const [confluenceUrl, setConfluenceUrl] = useState('')
  const [confluenceLoading, setConfluenceLoading] = useState(false)
  const [confluenceFiles, setConfluenceFiles] = useState<ConfluenceFile[]>([])
  const [selectedConfluence, setSelectedConfluence] = useState<Set<string>>(new Set())

  const fileTypes = ['All', 'PDF', 'DOCX', 'TXT', 'XLSX', 'PPTX']

  const filtered = docs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || d.type === typeFilter
    return matchSearch && matchType
  })

  function handleDelete(id: string) {
    setDocs(prev => prev.filter(d => d.id !== id))
  }

  function openModal() {
    setShowModal(true)
    setModalTab('file')
    setStagedFiles([])
    setUploadError(null)
    setConfluenceUrl('')
    setConfluenceFiles([])
    setSelectedConfluence(new Set())
  }

  function closeModal() {
    setShowModal(false)
  }

  // --- File tab ---
  function stageFiles(files: File[]) {
    const errors: string[] = []
    const valid: File[] = []
    for (const f of files) {
      if (!ALLOWED_TYPES[f.type]) {
        errors.push(`"${f.name}" — unsupported type.`)
      } else {
        valid.push(f)
      }
    }
    if (errors.length) setUploadError(errors.join(' '))
    else setUploadError(null)
    setStagedFiles(prev => {
      const names = new Set(prev.map(p => p.name))
      return [...prev, ...valid.filter(f => !names.has(f.name))]
    })
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    stageFiles(Array.from(e.target.files ?? []))
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    stageFiles(Array.from(e.dataTransfer.files))
  }

  function removeStagedFile(name: string) {
    setStagedFiles(prev => prev.filter(f => f.name !== name))
  }

  function commitFileUpload() {
    const newDocs: Document[] = stagedFiles.map(file => {
      const sizeKB = file.size / 1024
      const sizeStr = sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`
      return {
        id: `d-${crypto.randomUUID()}`,
        categoryId,
        name: file.name,
        type: ALLOWED_TYPES[file.type],
        size: sizeStr,
        uploadDate: new Date().toISOString().slice(0, 10),
        uploadedBy: 'Nguyễn Thị Lan',
      }
    })
    setDocs(prev => [...newDocs, ...prev])
    closeModal()
  }

  // --- Confluence tab ---
  function handleLoadConfluence() {
    if (!confluenceUrl.trim()) return
    setConfluenceLoading(true)
    setConfluenceFiles([])
    setSelectedConfluence(new Set())
    setTimeout(() => {
      setConfluenceFiles(MOCK_CONFLUENCE_FILES)
      setConfluenceLoading(false)
    }, 1200)
  }

  function toggleConfluenceFile(id: string) {
    setSelectedConfluence(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selectedConfluence.size === confluenceFiles.length) {
      setSelectedConfluence(new Set())
    } else {
      setSelectedConfluence(new Set(confluenceFiles.map(f => f.id)))
    }
  }

  function commitConfluenceImport() {
    const toImport = confluenceFiles.filter(f => selectedConfluence.has(f.id))
    const newDocs: Document[] = toImport.map(f => ({
      id: `d-${crypto.randomUUID()}`,
      categoryId,
      name: f.name,
      type: f.type as Document['type'],
      size: f.size,
      uploadDate: new Date().toISOString().slice(0, 10),
      uploadedBy: 'Nguyễn Thị Lan',
    }))
    setDocs(prev => [...newDocs, ...prev])
    closeModal()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS}
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex-shrink-0"
        >
          <Upload size={14} />
          Upload
        </button>
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Filter size={13} className="text-gray-400" />
        {fileTypes.map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={clsx(
              'px-3 py-1 text-xs rounded-full border transition-colors',
              typeFilter === t
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">File Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Size</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Uploaded</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">By</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                  No documents found
                </td>
              </tr>
            ) : filtered.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileTypeIcon type={doc.type} />
                    <span className="font-medium text-gray-800 truncate max-w-[200px]">{doc.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{doc.size}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{doc.uploadDate}</td>
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{doc.uploadedBy}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Download size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-2">{filtered.length} of {docs.length} documents</p>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col" style={{ maxHeight: '90vh' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Upload Documents</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-5">
              <button
                onClick={() => { setModalTab('file'); setUploadError(null) }}
                className={clsx(
                  'flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
                  modalTab === 'file'
                    ? 'bg-blue-100 text-purple-700 border-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                <Upload size={14} />
                Upload File
              </button>
              <button
                onClick={() => { setModalTab('confluence'); setUploadError(null) }}
                className={clsx(
                  'flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ml-1',
                  modalTab === 'confluence'
                    ? 'bg-blue-100 text-purple-700 border-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                <Link2 size={14} />
                Confluence
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {/* ── Upload File tab ── */}
              {modalTab === 'file' && (
                <>
                  {/* Drag & drop zone */}
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={clsx(
                      'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-10 cursor-pointer transition-colors',
                      dragOver ? 'border-purple-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    )}
                  >
                    <Upload size={28} className={clsx('transition-colors', dragOver ? 'text-purple-500' : 'text-gray-400')} />
                    <p className="text-sm font-medium text-gray-700">Drag & drop files here</p>
                    <p className="text-xs text-gray-400">or <span className="text-purple-600 underline">browse</span> to choose files</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOCX, TXT, XLSX, PPTX</p>
                  </div>

                  {/* Error */}
                  {uploadError && (
                    <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Staged files */}
                  {stagedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stagedFiles.length} file{stagedFiles.length > 1 ? 's' : ''} ready</p>
                      {stagedFiles.map(f => (
                        <div key={f.name} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                          <FileText size={14} className="text-gray-400 flex-shrink-0" />
                          <span className="flex-1 text-sm text-gray-700 truncate">{f.name}</span>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {f.size >= 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`}
                          </span>
                          <button onClick={() => removeStagedFile(f.name)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── Confluence tab ── */}
              {modalTab === 'confluence' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confluence Page URL</label>
                    <div className="flex gap-2">
                      <input
                        value={confluenceUrl}
                        onChange={e => setConfluenceUrl(e.target.value)}
                        placeholder="https://your-domain.atlassian.net/wiki/spaces/..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <button
                        onClick={handleLoadConfluence}
                        disabled={!confluenceUrl.trim() || confluenceLoading}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        {confluenceLoading
                          ? <Loader2 size={14} className="animate-spin" />
                          : <Link2 size={14} />}
                        {confluenceLoading ? 'Loading…' : 'Load Content'}
                      </button>
                    </div>
                  </div>

                  {/* Attachment list */}
                  {confluenceFiles.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Attachments ({confluenceFiles.length})
                        </p>
                        <button
                          onClick={toggleSelectAll}
                          className="text-xs text-purple-600 hover:underline"
                        >
                          {selectedConfluence.size === confluenceFiles.length ? 'Deselect all' : 'Select all'}
                        </button>
                      </div>
                      <div className="space-y-2">
                        {confluenceFiles.map(f => {
                          const checked = selectedConfluence.has(f.id)
                          return (
                            <div
                              key={f.id}
                              onClick={() => toggleConfluenceFile(f.id)}
                              className={clsx(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors',
                                checked ? 'bg-blue-50 border-purple-300' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                              )}
                            >
                              {checked
                                ? <CheckSquare size={16} className="text-purple-600 flex-shrink-0" />
                                : <Square size={16} className="text-gray-400 flex-shrink-0" />}
                              <FileTypeIcon type={f.type} />
                              <span className="flex-1 text-sm text-gray-700 truncate">{f.name}</span>
                              <span className="text-xs text-gray-400 flex-shrink-0">{f.size}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
              {modalTab === 'file' ? (
                <button
                  onClick={commitFileUpload}
                  disabled={stagedFiles.length === 0}
                  className="px-4 py-2 text-sm bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Upload {stagedFiles.length > 0 ? `(${stagedFiles.length})` : ''}
                </button>
              ) : (
                <button
                  onClick={commitConfluenceImport}
                  disabled={selectedConfluence.size === 0}
                  className="px-4 py-2 text-sm bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Import {selectedConfluence.size > 0 ? `(${selectedConfluence.size})` : ''}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
