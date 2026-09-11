import { cn } from '@/utils'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'new'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-bg text-success border-success/20',
  warning: 'bg-warning-bg text-warning border-warning/20',
  danger: 'bg-danger-bg text-danger border-danger/20',
  info: 'bg-info-bg text-info border-info/20',
  neutral: 'bg-surface-tertiary text-text-secondary border-border',
  new: 'bg-blue-50 text-jic-blue border-jic-blue/20',
}

const dotStyles: Record<BadgeVariant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
  neutral: 'bg-text-tertiary',
  new: 'bg-jic-blue',
}

export function Badge({ children, variant = 'neutral', size = 'sm', dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotStyles[variant])} />}
      {children}
    </span>
  )
}

export function getStatusBadgeVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    active: 'success',
    new: 'new',
    inactive: 'neutral',
    terminated: 'danger',
    outgoing: 'warning',
    expiring: 'warning',
    expired: 'danger',
    present: 'success',
    absent: 'danger',
    late: 'warning',
    on_leave: 'info',
    pending: 'warning',
    processing: 'info',
    completed: 'success',
    paid: 'success',
    approved: 'success',
    rejected: 'danger',
    open: 'warning',
    investigating: 'info',
    resolved: 'success',
  }
  return map[status] || 'neutral'
}
