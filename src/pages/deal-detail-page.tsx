import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDeal, usePipelineStages } from '@/features/deals/hooks'
import { useContact } from '@/features/contacts/hooks'
import { useCompanies } from '@/features/companies/hooks'
import { useOrgMembers } from '@/features/users/hooks'
import { FollowUpDraftDialog } from '@/components/deals/follow-up-draft-dialog'
import { DealSummaryPanel } from '@/components/deals/deal-summary-panel'
import { getApiErrorMessage } from '@/lib/errors'
import { formatCurrency, formatDate } from '@/lib/format'
import type { DealStatus } from '@/types/deal'

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-mist py-2.5 text-sm last:border-0">
      <span className="text-ink/50">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}

const STATUS_STYLE: Record<DealStatus, string> = {
  OPEN: 'bg-mist text-ink/60',
  WON: 'bg-ledger/10 text-ledger',
  LOST: 'bg-brick/10 text-brick',
}

export function DealDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dealQuery = useDeal(id)
  const deal = dealQuery.data

  const contactQuery = useContact(deal?.contactId)
  const companiesQuery = useCompanies()
  const membersQuery = useOrgMembers()
  const stagesQuery = usePipelineStages()

  const [isDraftOpen, setIsDraftOpen] = useState(false)

  const company = companiesQuery.data?.find((c) => c.id === deal?.companyId)
  const owner = membersQuery.data?.find((m) => m.id === deal?.ownerId)
  const stage = stagesQuery.data?.find((s) => s.id === deal?.pipelineStageId)

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Link
        to="/deals"
        className="flex w-fit items-center gap-1.5 text-sm text-ink/50 hover:text-ink"
      >
        <ArrowLeft className="size-3.5" />
        Pipeline
      </Link>

      {dealQuery.isPending && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {dealQuery.isError && (
        <p className="text-sm text-brick">
          {getApiErrorMessage(dealQuery.error, 'Unable to load deal.')}
        </p>
      )}

      {deal && (
        <>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-2xl text-ink">{deal.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={`border-0 ${STATUS_STYLE[deal.status]}`}
                >
                  {deal.status}
                </Badge>
                <span className="font-mono text-sm text-ink/60">
                  {formatCurrency(deal.value)}
                </span>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsDraftOpen(true)}>
              <Sparkles className="size-4" />
              Draft follow-up
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <InfoRow
                label="Contact"
                value={
                  contactQuery.data ? (
                    <Link
                      to={`/contacts/${contactQuery.data.id}`}
                      className="text-ledger hover:underline"
                    >
                      {contactQuery.data.firstName} {contactQuery.data.lastName}
                    </Link>
                  ) : (
                    '—'
                  )
                }
              />
              <InfoRow label="Company" value={company?.name ?? '—'} />
              <InfoRow label="Stage" value={stage?.name ?? '—'} />
              <InfoRow
                label="Owner"
                value={owner ? `${owner.firstName} ${owner.lastName}` : '—'}
              />
              <InfoRow
                label="Expected close"
                value={
                  <span className="font-mono">
                    {deal.expectedCloseDate
                      ? formatDate(deal.expectedCloseDate)
                      : '—'}
                  </span>
                }
              />
              {deal.closedAt && (
                <InfoRow
                  label="Closed"
                  value={
                    <span className="font-mono">
                      {formatDate(deal.closedAt)}
                    </span>
                  }
                />
              )}
              <InfoRow
                label="Created"
                value={
                  <span className="font-mono">
                    {formatDate(deal.createdAt)}
                  </span>
                }
              />
            </CardContent>
          </Card>

          <DealSummaryPanel dealId={deal.id} />

          {contactQuery.data && (
            <FollowUpDraftDialog
              open={isDraftOpen}
              onOpenChange={setIsDraftOpen}
              dealId={deal.id}
              contactId={contactQuery.data.id}
            />
          )}
        </>
      )}
    </div>
  )
}
