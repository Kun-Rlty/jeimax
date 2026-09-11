import { Bell, Menu, Search, LogOut, User } from 'lucide-react'
import { useAuthStore, useSidebarStore } from '@/stores'
import { getInitials } from '@/utils'
import { useState } from 'react'

export function TopBar() {
  const { user } = useAuthStore()
  const { toggleMobile } = useSidebarStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobile}
          className="lg:hidden p-2 rounded-md text-text-secondary hover:bg-surface-tertiary transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-surface-secondary rounded-md px-3 py-1.5 w-64">
          <Search className="h-4 w-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search employees, sites..."
            className="bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-md text-text-secondary hover:bg-surface-tertiary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-md hover:bg-surface-tertiary transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-jic-blue flex items-center justify-center">
              <span className="text-white text-[10px] font-semibold">
                {user ? getInitials(user.firstName, user.lastName) : 'AU'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-text-primary leading-tight">
                {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
              </p>
              <p className="text-[10px] text-text-tertiary leading-tight">IT & System Chief</p>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface rounded-lg border border-border shadow-lg py-1 z-50">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium text-text-primary">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-text-tertiary">{user?.email}</p>
                </div>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-tertiary transition-colors">
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger-bg transition-colors">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
