import { useLocation } from 'react-router-dom'
import { navItems } from '@/components/layout/nav-items'

export function Topbar() {
  const { pathname } = useLocation()
  const current = navItems.find((item) => pathname.startsWith(item.to))

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
      <span className="font-mono text-xs tracking-wide text-ink/50 uppercase">
        {current?.label ?? 'PulseCRM'}
      </span>

      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-full border border-mist bg-card font-mono text-xs text-ink/70">
          --
        </div>
      </div>
    </header>
  )
}
