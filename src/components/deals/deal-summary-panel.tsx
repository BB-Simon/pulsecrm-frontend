import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSummarizeDeal } from '@/features/deals/hooks'
import { getApiErrorMessage } from '@/lib/errors'

export function DealSummaryPanel({ dealId }: { dealId: string }) {
  const summaryMutation = useSummarizeDeal(dealId)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Catch me up</CardTitle>
        <Button
          variant="outline"
          size="sm"
          disabled={summaryMutation.isPending}
          onClick={() => summaryMutation.mutate()}
        >
          <Sparkles className="size-3.5" />
          {summaryMutation.isSuccess
            ? summaryMutation.isPending
              ? 'Regenerating…'
              : 'Regenerate'
            : summaryMutation.isPending
              ? 'Summarizing…'
              : 'Generate summary'}
        </Button>
      </CardHeader>
      <CardContent>
        {summaryMutation.isPending && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}

        {summaryMutation.isError && (
          <p className="text-sm text-brick">
            {getApiErrorMessage(
              summaryMutation.error,
              'Unable to summarize this deal right now.',
            )}
          </p>
        )}

        {summaryMutation.isSuccess && !summaryMutation.isPending && (
          <p className="text-sm text-ink/70">{summaryMutation.data.summary}</p>
        )}

        {summaryMutation.isIdle && (
          <p className="text-sm text-ink/40">
            Generate a quick catch-up on this deal's activity history.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
