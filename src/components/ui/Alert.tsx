import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/utils'

type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

interface AlertProps {
  children: React.ReactNode
  variant?: AlertVariant
  title?: string
  className?: string
}

const variantConfig: Record<AlertVariant, { icon: React.ReactNode; styles: string }> = {
  info: { icon: <Info className="h-4 w-4" />, styles: 'bg-info-bg border-info/20 text-info' },
  success: { icon: <CheckCircle className="h-4 w-4" />, styles: 'bg-success-bg border-success/20 text-success' },
  warning: { icon: <AlertTriangle className="h-4 w-4" />, styles: 'bg-warning-bg border-warning/20 text-warning' },
  danger: { icon: <XCircle className="h-4 w-4" />, styles: 'bg-danger-bg border-danger/20 text-danger' },
}

export function Alert({ children, variant = 'info', title, className }: AlertProps) {
  const config = variantConfig[variant]
  return (
    <div className={cn('rounded-lg border p-4', config.styles, className)}>
      <div className="flex gap-3">
        <div className="shrink-0 mt-0.5">{config.icon}</div>
        <div>
          {title && <h4 className="text-sm font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}
