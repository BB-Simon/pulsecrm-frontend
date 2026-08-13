import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  usePipelineStages,
  useDeals,
  useMoveDealStage,
} from '@/features/deals/hooks'
import { useContacts } from '@/features/contacts/hooks'
import { PipelineColumn } from '@/components/deals/pipeline-column'
import { DealCard } from '@/components/deals/deal-card'
import { DealFormDialog } from '@/components/deals/deal-form-dialog'
import { getApiErrorMessage } from '@/lib/errors'
import type { Deal } from '@/types/deal'

export function DealsPage() {
  const stagesQuery = usePipelineStages()
  const dealsQuery = useDeals()
  const contactsQuery = useContacts({ limit: 100 })
  const moveMutation = useMoveDealStage()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [activeDealId, setActiveDealId] = useState<string | null>(null)
  const [justWonDealId, setJustWonDealId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const contactNameById = useMemo(() => {
    const map = new Map<string, string>()
    contactsQuery.data?.data.forEach((contact) =>
      map.set(contact.id, `${contact.firstName} ${contact.lastName}`),
    )
    return map
  }, [contactsQuery.data])

  const dealsByStage = useMemo(() => {
    const map = new Map<string, Deal[]>()
    dealsQuery.data?.data.forEach((deal) => {
      const list = map.get(deal.pipelineStageId) ?? []
      list.push(deal)
      map.set(deal.pipelineStageId, list)
    })
    return map
  }, [dealsQuery.data])

  const activeDeal = dealsQuery.data?.data.find((d) => d.id === activeDealId)
  const activeStage = stagesQuery.data?.find(
    (s) => s.id === activeDeal?.pipelineStageId,
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveDealId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDealId(null)
    const overId = event.over?.id
    if (!overId) return

    const dealId = String(event.active.id)
    const targetStageId = String(overId)
    const deal = dealsQuery.data?.data.find((d) => d.id === dealId)
    if (!deal || deal.pipelineStageId === targetStageId) return

    moveMutation.mutate({ dealId, pipelineStageId: targetStageId })

    const targetStage = stagesQuery.data?.find((s) => s.id === targetStageId)
    if (targetStage?.isWon) {
      setJustWonDealId(dealId)
      window.setTimeout(() => setJustWonDealId(null), 700)
    }
  }

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">Pipeline</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-4" />
          New deal
        </Button>
      </div>

      {(stagesQuery.isError || dealsQuery.isError) && (
        <p className="text-sm text-brick">
          {getApiErrorMessage(
            stagesQuery.error ?? dealsQuery.error,
            'Unable to load the pipeline.',
          )}
        </p>
      )}

      {(stagesQuery.isPending || dealsQuery.isPending) && (
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-96 w-72 shrink-0" />
          ))}
        </div>
      )}

      {stagesQuery.data && dealsQuery.data && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
            {stagesQuery.data.map((stage) => (
              <PipelineColumn
                key={stage.id}
                stage={stage}
                deals={dealsByStage.get(stage.id) ?? []}
                contactNameById={contactNameById}
                justWonDealId={justWonDealId}
              />
            ))}
          </div>

          <DragOverlay>
            {activeDeal && (
              <DealCard
                deal={activeDeal}
                stage={activeStage}
                contactName={
                  contactNameById.get(activeDeal.contactId) ?? 'Unknown contact'
                }
              />
            )}
          </DragOverlay>
        </DndContext>
      )}

      <DealFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        stages={stagesQuery.data ?? []}
      />
    </div>
  )
}
