import { Upload, Trash2, Eye, FolderPlus } from 'lucide-react'
import { activities } from '@/data/mock'
import clsx from 'clsx'

const iconMap = {
  upload: { icon: Upload, bg: 'bg-blue-50', color: 'text-blue-600' },
  delete: { icon: Trash2, bg: 'bg-red-50', color: 'text-red-500' },
  access: { icon: Eye, bg: 'bg-gray-100', color: 'text-gray-500' },
  create: { icon: FolderPlus, bg: 'bg-green-50', color: 'text-green-600' },
}

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Recent Activity</h3>
      </div>
      <ul className="divide-y divide-gray-50">
        {activities.map((a) => {
          const { icon: Icon, bg, color } = iconMap[a.type]
          return (
            <li key={a.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', bg)}>
                <Icon size={14} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">
                  <span className="font-medium">{a.user}</span> {a.action.toLowerCase()}{' '}
                  <span className="font-medium text-blue-600 truncate">{a.target}</span>
                </p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{a.time}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
