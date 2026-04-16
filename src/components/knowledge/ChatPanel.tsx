'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, FileText } from 'lucide-react'
import { ChatMessage, chatMessages } from '@/data/mock'
import clsx from 'clsx'

const mockResponses = [
  'Based on the documents in this category, I found relevant information. The key points are outlined in the referenced files.',
  'According to the knowledge base, there are several approaches to this topic. Let me summarize the most important ones from the available documents.',
  'I searched through the category documents and found matching content. Here is a concise answer based on the available knowledge.',
]

let msgCounter = 0
function nextId(prefix: string) {
  return `${prefix}-${++msgCounter}`
}

interface Props {
  categoryId: string
  categoryName: string
}

export default function ChatPanel({ categoryId, categoryName }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    chatMessages[categoryId] ?? [
      {
        id: nextId('init'),
        role: 'assistant',
        content: `Hello! I can answer questions about **${categoryName}**. What would you like to know?`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    ]
  )
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Clean up pending response on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    }
  }, [])

  function send() {
    const text = input.trim()
    if (!text) return
    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    const userMsg: ChatMessage = { id: nextId('u'), role: 'user', content: text, timestamp: ts }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Simulate assistant response
    timeoutRef.current = setTimeout(() => {
      const reply: ChatMessage = {
        id: nextId('a'),
        role: 'assistant',
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        sources: ['Sample_Document.pdf'],
      }
      setMessages(prev => [...prev, reply])
    }, 800)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <Bot size={16} className="text-blue-600" />
        <span className="text-sm font-semibold text-gray-700">Knowledge Chat</span>
        <span className="text-xs text-gray-400 ml-1">— {categoryName}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={clsx('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : '')}>
            <div className={clsx(
              'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
              msg.role === 'assistant' ? 'bg-blue-100' : 'bg-gray-200'
            )}>
              {msg.role === 'assistant'
                ? <Bot size={13} className="text-blue-600" />
                : <User size={13} className="text-gray-600" />}
            </div>
            <div className={clsx('max-w-[85%]', msg.role === 'user' ? 'items-end' : '')}>
              <div className={clsx(
                'px-3.5 py-2.5 rounded-xl text-sm leading-relaxed',
                msg.role === 'assistant'
                  ? 'bg-gray-100 text-gray-800 rounded-tl-none'
                  : 'bg-black text-white rounded-tr-none'
              )}>
                {msg.content}
              </div>
              {msg.sources && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {msg.sources.map(src => (
                    <span key={src} className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded border border-blue-100">
                      <FileText size={10} />
                      {src}
                    </span>
                  ))}
                </div>
              )}
              <span className="text-xs text-gray-400 mt-1 block">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask a question about this knowledge base..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none max-h-24"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="p-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
