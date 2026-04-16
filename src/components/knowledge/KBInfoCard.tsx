'use client'

import { useState } from 'react'
import { User, Users, FileStack, Clock, Heart, MessageCircle, X, CheckCircle, Code2, Copy, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react'
import { Category, UserGroup } from '@/data/mock'
import clsx from 'clsx'

interface Props {
  category: Category
  groups: UserGroup[]
  initialLikes?: number
}

function generateKey() {
  return 'kbm_' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

export default function KBInfoCard({ category, groups, initialLikes = 0 }: Props) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikes)
  const [showFeedback, setShowFeedback] = useState(false)
  const [sent, setSent] = useState(false)
  const [feedback, setFeedback] = useState({ subject: '', message: '' })

  // API modal state
  const [showApi, setShowApi] = useState(false)
  const [apiEnabled, setApiEnabled] = useState(false)
  const [apiKey, setApiKey] = useState(() => generateKey())
  const [copied, setCopied] = useState<string | null>(null)

  function toggleLike() {
    setLiked(v => !v)
    setLikeCount(c => liked ? c - 1 : c + 1)
  }

  function handleSend() {
    if (!feedback.subject.trim() || !feedback.message.trim()) return
    setSent(true)
    setTimeout(() => {
      setShowFeedback(false)
      setSent(false)
      setFeedback({ subject: '', message: '' })
    }, 1500)
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${category.color}`}>{category.name}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowApi(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Code2 size={13} />
              Expose API
            </button>
            <button
              onClick={() => setShowFeedback(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <MessageCircle size={13} />
              Send Feedback
            </button>
            <button
              onClick={toggleLike}
              className="flex items-center gap-1.5 text-sm transition-colors group"
            >
              <Heart
                size={18}
                className={clsx(
                  'transition-all',
                  liked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-300 group-hover:text-red-400'
                )}
              />
              <span className={clsx('font-medium text-sm', liked ? 'text-red-500' : 'text-gray-400')}>
                {likeCount}
              </span>
            </button>
          </div>
        </div>

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

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-800">Send Feedback</h2>
                <p className="text-xs text-gray-400 mt-0.5">To: <span className="font-medium text-gray-600">{category.createdBy}</span></p>
              </div>
              <button onClick={() => setShowFeedback(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {sent ? (
              <div className="px-5 py-10 flex flex-col items-center gap-3 text-center">
                <CheckCircle size={36} className="text-green-500" />
                <p className="font-medium text-gray-800">Feedback sent!</p>
                <p className="text-sm text-gray-400">Your message has been sent to {category.createdBy}.</p>
              </div>
            ) : (
              <>
                <div className="px-5 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      autoFocus
                      value={feedback.subject}
                      onChange={e => setFeedback(f => ({ ...f, subject: e.target.value }))}
                      placeholder={`Feedback on "${category.name}"`}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      value={feedback.message}
                      onChange={e => setFeedback(f => ({ ...f, message: e.target.value }))}
                      placeholder="Write your feedback here..."
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
                  <button onClick={() => setShowFeedback(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!feedback.subject.trim() || !feedback.message.trim()}
                    className="px-4 py-2 text-sm bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
