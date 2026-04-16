'use client'

import { useState } from 'react'
import { User, Users, FileStack, Clock, X, CheckCircle, Code2, Copy, RefreshCw, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Category, UserGroup } from '@/data/mock'

interface Props {
  category: Category
  groups: UserGroup[]
}

function generateKey() {
  return 'kbm_' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

export default function KBInfoCard({ category, groups }: Props) {
  const [infoOpen, setInfoOpen] = useState(false)
  // API modal state
  const [showApi, setShowApi] = useState(false)
  const [apiEnabled, setApiEnabled] = useState(false)
  const [apiKey, setApiKey] = useState(() => generateKey())
  const [copied, setCopied] = useState<string | null>(null)

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <>
      <div
        className="bg-white border border-gray-200 rounded-xl p-4 mb-5 cursor-pointer select-none"
        onClick={() => setInfoOpen(v => !v)}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {infoOpen
              ? <ChevronUp size={15} className="text-gray-400" />
              : <ChevronDown size={15} className="text-gray-400" />
            }
            <span className="text-sm font-semibold text-gray-800">{category.name}</span>
          </div>
          <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowApi(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Code2 size={13} />
              Expose API
            </button>
          </div>
        </div>

        <div className={`grid transition-all duration-300 ease-in-out ${infoOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <p className="text-sm text-gray-500 mb-4">{category.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <User size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Created by</p>
                  <p className="font-medium text-gray-700">{category.createdBy}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Last updated</p>
                  <p className="font-medium text-gray-700">{category.lastUpdated}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileStack size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Documents</p>
                  <p className="font-medium text-gray-700">{category.documentCount}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Permission groups</p>
                  {groups.length === 0 ? (
                    <p className="text-gray-400 text-xs">No groups</p>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {groups.map(g => (
                        <span key={g.id} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-medium">
                          {g.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Modal */}
      {showApi && (() => {
        const endpoint = `https://api.kbm.io/v1/kb/${category.id}/query`
        const curlSnippet = `curl -X POST "${endpoint}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "your question here"}'`
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Code2 size={16} className="text-blue-600" />
                  <h2 className="font-semibold text-gray-800">API Access</h2>
                </div>
                <button onClick={() => setShowApi(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>

              <div className="px-5 py-4 space-y-5">
                {/* Enable toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">API Access</p>
                    <p className="text-xs text-gray-400 mt-0.5">{apiEnabled ? 'This KB is accessible via API' : 'Enable to allow API queries on this KB'}</p>
                  </div>
                  <button onClick={() => setApiEnabled(v => !v)} className="flex-shrink-0">
                    {apiEnabled
                      ? <ToggleRight size={28} className="text-blue-600" />
                      : <ToggleLeft size={28} className="text-gray-300" />
                    }
                  </button>
                </div>

                {/* Endpoint */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Endpoint</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 font-mono truncate">
                      {endpoint}
                    </code>
                    <button
                      onClick={() => copyToClipboard(endpoint, 'endpoint')}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                      title="Copy"
                    >
                      {copied === 'endpoint' ? <CheckCircle size={15} className="text-green-500" /> : <Copy size={15} />}
                    </button>
                  </div>
                </div>

                {/* API Key */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">API Key</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 font-mono truncate">
                      {apiEnabled ? apiKey : '••••••••••••••••••••••••••••••••'}
                    </code>
                    {apiEnabled && (
                      <>
                        <button
                          onClick={() => copyToClipboard(apiKey, 'key')}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                          title="Copy key"
                        >
                          {copied === 'key' ? <CheckCircle size={15} className="text-green-500" /> : <Copy size={15} />}
                        </button>
                        <button
                          onClick={() => setApiKey(generateKey())}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors flex-shrink-0"
                          title="Regenerate key"
                        >
                          <RefreshCw size={15} />
                        </button>
                      </>
                    )}
                  </div>
                  {!apiEnabled && <p className="text-xs text-gray-400 mt-1">Enable API access to reveal the key.</p>}
                </div>

                {/* cURL example */}
                {apiEnabled && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Example (cURL)</label>
                      <button
                        onClick={() => copyToClipboard(curlSnippet, 'curl')}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {copied === 'curl' ? <><CheckCircle size={12} className="text-green-500" /> Copied</> : <><Copy size={12} /> Copy</>}
                      </button>
                    </div>
                    <pre className="bg-gray-900 text-green-400 text-xs rounded-lg p-3 overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap break-all">
                      {curlSnippet}
                    </pre>
                  </div>
                )}
              </div>

              <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
                <button onClick={() => setShowApi(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </>
  )
}
