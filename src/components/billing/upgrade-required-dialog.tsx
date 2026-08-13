import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/ui-store'

export function UpgradeRequiredDialog() {
  const navigate = useNavigate()
  const isOpen = useUIStore((state) => state.isOpen)
  const message = useUIStore((state) => state.message)
  const closeUpgradeModal = useUIStore((state) => state.closeUpgradeModal)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeUpgradeModal()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade required</DialogTitle>
          <DialogDescription>
            {message ??
              'You’ve hit a limit on your current plan. Upgrade to continue.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeUpgradeModal}>
            Not now
          </Button>
          <Button
            onClick={() => {
              closeUpgradeModal()
              navigate('/settings/billing')
            }}
          >
            View plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
