export interface PipelineStageValue {
  pipelineStageId: string
  stageName: string
  order: number
  dealCount: number
  totalValue: number
}

export interface DealsThisMonthBucket {
  count: number
  value: number
}

export interface DealsThisMonth {
  won: DealsThisMonthBucket
  lost: DealsThisMonthBucket
}

export interface RevenueTrendPoint {
  month: string
  revenue: number
}

export interface DashboardData {
  pipelineByStage: PipelineStageValue[]
  dealsThisMonth: DealsThisMonth
  revenueTrend: RevenueTrendPoint[]
}
