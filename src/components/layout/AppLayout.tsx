import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MobileSidebar } from './MobileSidebar'
import { useSidebarStore } from '@/stores'
import { cn } from '@/utils'

export function AppLayout() {
  const { isOpen } = useSidebarStore()

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar />
      <MobileSidebar />
      <div
        className={cn(
          'transition-all duration-200',
          isOpen ? 'lg:ml-60' : 'lg:ml-16'
        )}
      >
        <TopBar />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
