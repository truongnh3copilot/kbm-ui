'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, ShieldCheck, ChevronDown, Store, ScrollText } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

const navGroups = [
  {
    label: 'Knowledge Base Management',
    href: '/dashboard',
    icon: BookOpen,
    children: [
      { href: '/knowledge',       label: 'Store',          icon: Store },
      { href: '/access-control',  label: 'Access Request', icon: ShieldCheck },
      { href: '/audit-log',       label: 'Audit Log',      icon: ScrollText },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState<Record<string, boolean>>({ 'Knowledge Base Management': true })

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">KBM System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navGroups.map(({ label, href: groupHref, icon: Icon, children }) => {
          const isOpen = !!open[label]
          const groupActive = pathname === groupHref || children.some(c => pathname === c.href || pathname.startsWith(c.href + '/'))

          return (
            <div key={label}>
              {/* Level 1 */}
              <button
                onClick={() => { router.push(groupHref); setOpen(o => ({ ...o, [label]: true })) }}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                  groupActive ? 'text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <Icon size={18} />
                <span className="flex-1 text-left">{label}</span>
                <ChevronDown
                  size={14}
                  onClick={e => { e.stopPropagation(); setOpen(o => ({ ...o, [label]: !o[label] })) }}
                  className={clsx('transition-transform text-gray-400 hover:text-white', isOpen && 'rotate-180')}
                />
              </button>

              {/* Level 2 */}
              {isOpen && (
                <div className="mt-1 ml-4 pl-3 border-l border-gray-700 space-y-0.5">
                  {children.map(({ href, label: childLabel, icon: ChildIcon }) => {
                    const active = pathname === href || pathname.startsWith(href + '/')
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={clsx(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          active
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        )}
                      >
                        <ChildIcon size={15} />
                        <span className="flex-1">{childLabel}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Nguyễn Thị Lan</p>
            <p className="text-xs text-gray-400 truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
