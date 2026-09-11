import { cn } from '@/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-surface-tertiary rounded', className)} />
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className={cn('h-4', j === 0 ? 'w-20' : j === 1 ? 'w-32' : 'w-24')} />
          ))}
        </div>
      ))}
    </div>
  )
}
