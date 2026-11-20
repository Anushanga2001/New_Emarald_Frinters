import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/** Loading placeholder shaped like the dashboards: heading, stat cards, then a list card. */
export function DashboardSkeleton({ statCount = 4 }: { statCount?: number }) {
  return (
    <div className="container mx-auto px-4 py-8" aria-busy="true" aria-label="Loading dashboard">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ${statCount === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
        {Array.from({ length: statCount }).map((_, i) => (
          <Card key={i} className="p-5 flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-11 w-11 rounded-xl" />
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
