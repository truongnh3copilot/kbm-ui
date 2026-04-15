import { FolderOpen, FileText, Users, Activity } from 'lucide-react'

const cards = [
  { label: 'Total Categories', value: '6', icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-50', change: '+2 this month' },
  { label: 'Total Documents', value: '137', icon: FileText, color: 'text-green-600', bg: 'bg-green-50', change: '+14 this week' },
  { label: 'Total Users', value: '34', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', change: '+3 this month' },
  { label: 'Recent Activities', value: '28', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50', change: 'Last 7 days' },
]

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map(({ label, value, icon: Icon, color, bg, change }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={22} className={color} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{change}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
