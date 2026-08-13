import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { navItems } from '@/components/layout/nav-items'

export function Sidebar() {
  return (
    <aside className="relative flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Ledger margin rule */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-8 w-px bg-mist" />

      <div className="px-6 pt-6 pb-5">
        <span className="font-heading text-xl tracking-tight text-ink">
          PulseCRM
        </span>
      </div>

      <nav className="flex flex-col gap-0.5 px-4">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-md py-2 pr-3 pl-4 text-sm transition-colors',
                isActive
                  ? 'font-medium text-ledger'
                  : 'text-ink/60 hover:text-ink',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute top-1/2 left-0 h-4 w-[3px] -translate-y-1/2 rounded-full bg-ochre transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
