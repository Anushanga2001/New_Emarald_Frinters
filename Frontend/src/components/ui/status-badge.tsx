import { CheckCircle2, Circle, Clock, Loader2, XCircle, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * One colour convention for every status in the app:
 *   success (green) = approved / delivered / active
 *   warning (amber) = pending / needs attention
 *   danger  (red)   = rejected / failed / delayed
 *   info    (blue)  = in progress
 *   neutral (grey)  = inactive / unknown
 */
export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const toneStyles: Record<StatusTone, string> = {
  success: 'bg-success/10 text-success border-success/25',
  warning: 'bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-400',
  danger: 'bg-destructive/10 text-destructive border-destructive/25',
  info: 'bg-primary/10 text-primary border-primary/25',
  neutral: 'bg-secondary text-muted-foreground border-border',
}

const STATUS_MAP: Record<string, { tone: StatusTone; icon: LucideIcon }> = {
  approved: { tone: 'success', icon: CheckCircle2 },
  delivered: { tone: 'success', icon: CheckCircle2 },
  active: { tone: 'success', icon: CheckCircle2 },
  pending: { tone: 'warning', icon: Clock },
  customs: { tone: 'warning', icon: Clock },
  'customs clearance': { tone: 'warning', icon: Clock },
  rejected: { tone: 'danger', icon: XCircle },
  failed: { tone: 'danger', icon: XCircle },
  delayed: { tone: 'danger', icon: XCircle },
  booked: { tone: 'info', icon: Loader2 },
  'picked up': { tone: 'info', icon: Loader2 },
  'in transit': { tone: 'info', icon: Loader2 },
  'at port': { tone: 'info', icon: Loader2 },
  'out for delivery': { tone: 'info', icon: Loader2 },
  inactive: { tone: 'neutral', icon: Circle },
}

interface StatusBadgeProps {
  status: string
  /** Override the label (defaults to the status text) */
  label?: string
  /** Hide the leading icon, e.g. in dense tables */
  hideIcon?: boolean
  className?: string
}

export function StatusBadge({ status, label, hideIcon = false, className }: StatusBadgeProps) {
  const entry = STATUS_MAP[status.trim().toLowerCase()] ?? { tone: 'neutral' as StatusTone, icon: Circle }
  const Icon = entry.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        toneStyles[entry.tone],
        className,
      )}
    >
      {!hideIcon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {label ?? status}
    </span>
  )
}
