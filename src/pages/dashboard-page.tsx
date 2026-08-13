import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { useDashboard } from '@/features/dashboard/hooks'
import { usePipelineStages } from '@/features/deals/hooks'
import { DealsSummaryCards } from '@/components/dashboard/deals-summary-cards'
import {
  PipelineValueChart,
  type PipelineChartDatum,
} from '@/components/dashboard/pipeline-value-chart'
import { RevenueTrendChart } from '@/components/dashboard/revenue-trend-chart'
import { getApiErrorMessage } from '@/lib/errors'

export function DashboardPage() {
  const dashboardQuery = useDashboard()
  const stagesQuery = usePipelineStages()

  const pipelineChartData = useMemo<PipelineChartDatum[]>(() => {
    if (!dashboardQuery.data) return []
    const stageFlagsById = new Map(
      stagesQuery.data?.map((stage) => [stage.id, stage]) ?? [],
    )

    return [...dashboardQuery.data.pipelineByStage]
      .sort((a, b) => a.order - b.order)
      .map((stage) => ({
        stageName: stage.stageName,
        dealCount: stage.dealCount,
        totalValue: stage.totalValue,
        isWon: stageFlagsById.get(stage.pipelineStageId)?.isWon ?? false,
        isLost: stageFlagsById.get(stage.pipelineStageId)?.isLost ?? false,
      }))
  }, [dashboardQuery.data, stagesQuery.data])

  const isPending = dashboardQuery.isPending || stagesQuery.isPending

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl text-ink">Dashboard</h1>

      {(dashboardQuery.isError || stagesQuery.isError) && (
        <p className="text-sm text-brick">
          {getApiErrorMessage(
            dashboardQuery.error ?? stagesQuery.error,
            'Unable to load dashboard data.',
          )}
        </p>
      )}

      {isPending && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      )}

      {dashboardQuery.data && !isPending && (
        <>
          <DealsSummaryCards data={dashboardQuery.data.dealsThisMonth} />

          <Card>
            <CardContent>
              <PipelineValueChart data={pipelineChartData} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <RevenueTrendChart data={dashboardQuery.data.revenueTrend} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
