import Sidebar from './Sidebar'
import Header from './Header'

interface MainLayoutProps {
  children: React.ReactNode
  title: string
  searchAutoFocus?: boolean
  search?: string
  onSearchChange?: (value: string) => void
}

export default function MainLayout({ children, title, searchAutoFocus, search, onSearchChange }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} searchAutoFocus={searchAutoFocus} search={search} onSearchChange={onSearchChange} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
