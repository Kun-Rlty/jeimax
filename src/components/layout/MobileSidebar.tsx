import { NavLink, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  Settings,
  Shield,
  Clock,
  FileText,
  DollarSign,
  BarChart3,
  Briefcase,
} from 'lucide-react'
import { useAuthStore, useSidebarStore } from '@/stores'
import { cn } from '@/utils'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles?: UserRole[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Employees', href: '/employees', icon: <Users className="h-5 w-5" />, roles: ['it_chief', 'hr_compliance'] },
  { label: 'Clients', href: '/clients', icon: <Building2 className="h-5 w-5" />, roles: ['it_chief', 'accountant'] },
  { label: 'Sites', href: '/sites', icon: <MapPin className="h-5 w-5" />, roles: ['it_chief', 'operations_field'] },
  { label: 'Operations', href: '/operations', icon: <Shield className="h-5 w-5" />, roles: ['it_chief', 'operations_field'] },
  { label: 'Attendance', href: '/attendance', icon: <Clock className="h-5 w-5" />, roles: ['it_chief', 'operations_field', 'hr_compliance'] },
  { label: 'Contracts', href: '/contracts', icon: <FileText className="h-5 w-5" />, roles: ['it_chief', 'hr_compliance', 'accountant'] },
  { label: 'Payroll', href: '/payroll', icon: <DollarSign className="h-5 w-5" />, roles: ['it_chief', 'accountant'] },
  { label: 'Expenses', href: '/expenses', icon: <Briefcase className="h-5 w-5" />, roles: ['it_chief', 'accountant'] },
  { label: 'Reports', href: '/reports', icon: <BarChart3 className="h-5 w-5" />, roles: ['it_chief'] },
  { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" />, roles: ['it_chief'] },
]

export function MobileSidebar() {
  const { isMobileOpen, closeMobile } = useSidebarStore()
  const { user } = useAuthStore()
  const location = useLocation()

  const filteredItems = navItems.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role))
  )

  if (!isMobileOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/40" onClick={closeMobile} />
      <div className="fixed inset-y-0 left-0 w-72 bg-surface shadow-lg flex flex-col">
        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-jic-blue flex items-center justify-center">
              <span className="text-white text-xs font-bold">JIC</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary leading-tight">JEIMAX</p>
              <p className="text-[10px] text-text-tertiary leading-tight">HRMS</p>
            </div>
          </div>
          <button
            onClick={closeMobile}
            className="p-2 rounded-md text-text-tertiary hover:bg-surface-tertiary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {filteredItems.map((item) => {
            const isActive =
              location.pathname === item.href || location.pathname.startsWith(item.href + '/')
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={closeMobile}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-jic-blue/5 text-jic-blue'
                    : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                )}
              >
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
