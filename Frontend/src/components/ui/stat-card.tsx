import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatTone = 'primary' | 'success' | 'warning' | 'neutral'

const toneStyles: Record<StatTone, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  neutral: 'bg-secondary text-foreground',
}

interface StatCardProps {
  title: string
  value: React.ReactNode
  hint?: string
  icon: LucideIcon
  tone?: StatTone
  className?: string
}

export function StatCard({ title, value, hint, icon: Icon, tone = 'primary', className }: StatCardProps) {
  return (
    <Card className={cn('p-5 flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-1 font-heading text-3xl font-extrabold tracking-tight truncate">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', toneStyles[tone])}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
    </Card>
  )
}
