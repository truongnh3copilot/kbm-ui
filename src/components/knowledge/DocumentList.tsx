'use client'

import { useState, useRef } from 'react'
import { Upload, Trash2, Download, Search, FileText, Filter, AlertCircle } from 'lucide-react'
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

interface Props {
  categoryId: string
}

export default function DocumentList({ categoryId }: Props) {
  const [docs, setDocs] = useState<Document[]>(allDocs.filter(d => d.categoryId === categoryId))
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fileTypes = ['All', 'PDF', 'DOCX', 'TXT', 'XLSX', 'PPTX']

  const filtered = docs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || d.type === typeFilter
    return matchSearch && matchType
  })

  function handleDelete(id: string) {
    setDocs(prev => prev.filter(d => d.id !== id))
  }

  function handleUploadClick() {
    setUploadError(null)
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const errors: string[] = []
    const newDocs: Document[] = []

    for (const file of files) {
      const docType = ALLOWED_TYPES[file.type]
      if (!docType) {
        errors.push(`"${file.name}" — unsupported type. Allowed: PDF, DOCX, TXT, XLSX, PPTX.`)
        continue
      }
      const sizeKB = file.size / 1024
      const sizeStr = sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`
      newDocs.push({
        id: `d-${crypto.randomUUID()}`,
        categoryId,
        name: file.name,
        type: docType,
        size: sizeStr,
        uploadDate: new Date().toISOString().slice(0, 10),
        uploadedBy: 'Alice Johnson',
      })
    }

    if (errors.length) setUploadError(errors.join(' '))
    if (newDocs.length) setDocs(prev => [...newDocs, ...prev])
    e.target.value = ''
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
        onChange={handleFileChange}
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
          onClick={handleUploadClick}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex-shrink-0"
        >
          <Upload size={14} />
          Upload
        </button>
      </div>

      {/* Upload error */}
      {uploadError && (
        <div className="flex items-start gap-2 mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

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
                ? 'bg-blue-600 text-white border-blue-600'
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
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Size</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Uploaded</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">By</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                  No documents found
                </td>
              </tr>
            ) : filtered.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-gray-800 truncate max-w-[180px]">{doc.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', typeColors[doc.type] ?? 'bg-gray-100 text-gray-600')}>
                    {doc.type}
                  </span>
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
    </div>
  )
}
