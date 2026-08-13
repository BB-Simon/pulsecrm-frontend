import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Users, HandCoins } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useGlobalSearch } from '@/features/search/hooks'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { SearchContactResult } from '@/types/search'

export function GlobalSearch() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const debouncedQuery = useDebouncedValue(query, 300)
  const searchQuery = useGlobalSearch(debouncedQuery)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectContact(contact: SearchContactResult) {
    navigate(`/contacts/${contact.id}`)
    setQuery('')
    setIsOpen(false)
  }

  function selectDeal() {
    // No deal detail route exists yet — the pipeline board is the closest
    // thing to a "deal page" this app has.
    navigate('/deals')
    setQuery('')
    setIsOpen(false)
  }

  const trimmed = debouncedQuery.trim()
  const hasResults =
    searchQuery.data &&
    (searchQuery.data.contacts.length > 0 || searchQuery.data.deals.length > 0)

  return (
    <div ref={containerRef} className="relative w-72">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink/40" />
      <Input
        className="pl-8"
        placeholder="Search contacts, deals…"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => {
          if (query) setIsOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setIsOpen(false)
            event.currentTarget.blur()
          }
        }}
      />

      {isOpen && trimmed.length > 0 && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-96 max-w-[80vw] overflow-hidden rounded-md border border-mist bg-popover shadow-md">
          {searchQuery.isPending && (
            <p className="px-3 py-4 text-sm text-ink/50">Searching…</p>
          )}

          {searchQuery.isError && (
            <p className="px-3 py-4 text-sm text-brick">
              Unable to search right now.
            </p>
          )}

          {searchQuery.data && !hasResults && (
            <p className="px-3 py-4 text-sm text-ink/50">
              No results for "{trimmed}"
            </p>
          )}

          {searchQuery.data && searchQuery.data.contacts.length > 0 && (
            <div className="py-1.5">
              <p className="flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] tracking-wider text-ink/40 uppercase">
                <Users className="size-3" />
                Contacts
              </p>
              {searchQuery.data.contacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => selectContact(contact)}
                  className="flex w-full flex-col px-3 py-1.5 text-left hover:bg-muted"
                >
                  <span className="text-sm text-ink">
                    {contact.firstName} {contact.lastName}
                  </span>
                  <span className="text-xs text-ink/50">
                    {[contact.email, contact.companyName]
                      .filter(Boolean)
                      .join(' · ') || '—'}
                  </span>
                </button>
              ))}
            </div>
          )}

          {searchQuery.data && searchQuery.data.deals.length > 0 && (
            <div
              className={cn(
                'py-1.5',
                searchQuery.data.contacts.length > 0 && 'border-t border-mist',
              )}
            >
              <p className="flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] tracking-wider text-ink/40 uppercase">
                <HandCoins className="size-3" />
                Deals
              </p>
              {searchQuery.data.deals.map((deal) => (
                <button
                  key={deal.id}
                  type="button"
                  onClick={selectDeal}
                  className="flex w-full items-start justify-between gap-2 px-3 py-1.5 text-left hover:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-ink">
                      {deal.title}
                    </span>
                    <span className="text-xs text-ink/50">
                      {deal.contactName}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-ink/60">
                    {formatCurrency(deal.value)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
