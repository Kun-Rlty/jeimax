import { cn } from '@/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; label: string }
  variant?: 'default' | 'blue' | 'orange' | 'success'
  className?: string
}

const variantStyles = {
  default: 'bg-surface border-border',
  blue: 'bg-surface border-border',
  orange: 'bg-surface border-border',
  success: 'bg-surface border-border',
}

const iconStyles = {
  default: 'bg-surface-tertiary text-text-secondary',
  blue: 'bg-info-bg text-jic-blue',
  orange: 'bg-orange-50 text-jic-orange',
  success: 'bg-success-bg text-success',
}

export function StatCard({ title, value, subtitle, icon, variant = 'default', className }: StatCardProps) {
  return (
    <div className={cn('rounded-lg border p-5 shadow-sm', variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
          {subtitle && <p className="text-xs text-text-tertiary mt-1">{subtitle}</p>}
        </div>
        <div className={cn('p-2.5 rounded-lg', iconStyles[variant])}>{icon}</div>
      </div>
    </div>
  )
}
