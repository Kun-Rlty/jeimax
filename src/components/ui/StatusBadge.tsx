import { cn } from '@/utils'

interface StatusBadgeProps {
  status: string
  label?: string
  className?: string
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  active: { bg: 'bg-success-bg', text: 'text-success', dot: 'bg-success', label: 'Active' },
  new: { bg: 'bg-blue-50', text: 'text-jic-blue', dot: 'bg-jic-blue', label: 'New' },
  inactive: { bg: 'bg-surface-tertiary', text: 'text-text-secondary', dot: 'bg-text-tertiary', label: 'Inactive' },
  terminated: { bg: 'bg-danger-bg', text: 'text-danger', dot: 'bg-danger', label: 'Terminated' },
  outgoing: { bg: 'bg-warning-bg', text: 'text-warning', dot: 'bg-warning', label: 'Out-going' },
  expiring: { bg: 'bg-warning-bg', text: 'text-warning', dot: 'bg-warning', label: 'Expiring' },
  expired: { bg: 'bg-danger-bg', text: 'text-danger', dot: 'bg-danger', label: 'Expired' },
  present: { bg: 'bg-success-bg', text: 'text-success', dot: 'bg-success', label: 'Present' },
  absent: { bg: 'bg-danger-bg', text: 'text-danger', dot: 'bg-danger', label: 'Absent' },
  late: { bg: 'bg-warning-bg', text: 'text-warning', dot: 'bg-warning', label: 'Late' },
  on_leave: { bg: 'bg-info-bg', text: 'text-info', dot: 'bg-info', label: 'On Leave' },
  pending: { bg: 'bg-warning-bg', text: 'text-warning', dot: 'bg-warning', label: 'Pending' },
  processing: { bg: 'bg-info-bg', text: 'text-info', dot: 'bg-info', label: 'Processing' },
  completed: { bg: 'bg-success-bg', text: 'text-success', dot: 'bg-success', label: 'Completed' },
  paid: { bg: 'bg-success-bg', text: 'text-success', dot: 'bg-success', label: 'Paid' },
  approved: { bg: 'bg-success-bg', text: 'text-success', dot: 'bg-success', label: 'Approved' },
  rejected: { bg: 'bg-danger-bg', text: 'text-danger', dot: 'bg-danger', label: 'Rejected' },
  open: { bg: 'bg-warning-bg', text: 'text-warning', dot: 'bg-warning', label: 'Open' },
  investigating: { bg: 'bg-info-bg', text: 'text-info', dot: 'bg-info', label: 'Investigating' },
  resolved: { bg: 'bg-success-bg', text: 'text-success', dot: 'bg-success', label: 'Resolved' },
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.inactive
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {label || config.label}
    </span>
  )
}
