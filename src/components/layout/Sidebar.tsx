import { NavLink, useLocation } from 'react-router-dom'
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
  ChevronLeft,
  ChevronRight,
  Briefcase,
  ClipboardList,
} from 'lucide-react'
import { useSidebarStore } from '@/stores'
import { cn } from '@/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  group: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, group: 'main' },
  { label: 'Employees', href: '/employees', icon: <Users className="h-5 w-5" />, group: 'main' },
  { label: 'Clients', href: '/clients', icon: <Building2 className="h-5 w-5" />, group: 'main' },
  { label: 'Sites', href: '/sites', icon: <MapPin className="h-5 w-5" />, group: 'main' },
  { label: 'Operations', href: '/operations', icon: <Shield className="h-5 w-5" />, group: 'operations' },
  { label: 'Attendance', href: '/attendance', icon: <Clock className="h-5 w-5" />, group: 'operations' },
  { label: 'Contracts', href: '/contracts', icon: <FileText className="h-5 w-5" />, group: 'financial' },
  { label: 'Payroll', href: '/payroll', icon: <DollarSign className="h-5 w-5" />, group: 'financial' },
  { label: 'Expenses', href: '/expenses', icon: <Briefcase className="h-5 w-5" />, group: 'financial' },
  { label: 'Reports', href: '/reports', icon: <BarChart3 className="h-5 w-5" />, group: 'reports' },
  { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" />, group: 'settings' },
]

const groupLabels: Record<string, string | null> = {
  main: null,
  operations: 'Operations',
  financial: 'Financial',
  reports: 'Reports',
  settings: 'System',
}

export function Sidebar() {
  const { isOpen, toggle } = useSidebarStore()
  const location = useLocation()

  const grouped = navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-30 bg-surface border-r border-border flex flex-col transition-all duration-200',
        isOpen ? 'w-60' : 'w-16',
        'max-lg:hidden'
      )}
    >
      <div className={cn('flex items-center h-14 border-b border-border', isOpen ? 'px-4' : 'px-2 justify-center')}>
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-jic-blue flex items-center justify-center">
              <span className="text-white text-xs font-bold">JIC</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary leading-tight">JEIMAX</p>
              <p className="text-[10px] text-text-tertiary leading-tight">HRMS</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-jic-blue flex items-center justify-center">
            <span className="text-white text-xs font-bold">JIC</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            {isOpen && groupLabels[group] && (
              <div className="px-4 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                  {groupLabels[group]}
                </span>
              </div>
            )}
            <div className="px-2 space-y-0.5">
              {items.map((item) => {
                const isActive =
                  location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md text-sm font-medium transition-colors',
                      isOpen ? 'px-3 py-2' : 'px-0 py-2 justify-center',
                      isActive
                        ? 'bg-jic-blue/5 text-jic-blue'
                        : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                    )}
                    title={!isOpen ? item.label : undefined}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {isOpen && <span>{item.label}</span>}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-2">
        <button
          onClick={toggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-text-tertiary hover:bg-surface-tertiary hover:text-text-primary transition-colors text-sm"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {isOpen && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
