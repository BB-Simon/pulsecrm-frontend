import { Link } from 'react-router-dom'
import { CreditCard, ChevronRight, Webhook } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const settingsSections = [
  {
    label: 'Billing',
    description: 'Plan, usage, and payment details',
    to: '/settings/billing',
    icon: CreditCard,
  },
  {
    label: 'Webhooks',
    description: 'Outbound event notifications and delivery log',
    to: '/settings/webhooks',
    icon: Webhook,
  },
]

export function SettingsPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-2xl text-ink">Settings</h1>

      <Card>
        <CardContent className="flex flex-col divide-y divide-mist p-0">
          {settingsSections.map(({ label, description, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-muted/50"
            >
              <Icon className="size-4 text-ink/50" strokeWidth={1.75} />
              <div className="flex-1">
                <div className="text-ink">{label}</div>
                <div className="text-xs text-ink/50">{description}</div>
              </div>
              <ChevronRight className="size-4 text-ink/30" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
