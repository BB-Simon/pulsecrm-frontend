import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useContacts } from '@/features/contacts/hooks'
import { useCompanies } from '@/features/companies/hooks'
import { useOrgMembers } from '@/features/users/hooks'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useAuthStore } from '@/stores/auth-store'
import { getApiErrorMessage } from '@/lib/errors'
import { ContactFormDialog } from '@/components/contacts/contact-form-dialog'

const ALL_OWNERS = '__all__'

export function ContactsPage() {
  const role = useAuthStore((state) => state.user?.role)
  const canFilterByOwner = role === 'ADMIN' || role === 'MANAGER'

  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [tag, setTag] = useState('')
  const [ownerId, setOwnerId] = useState(ALL_OWNERS)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const search = useDebouncedValue(searchInput)
  const debouncedTag = useDebouncedValue(tag)

  const contactsQuery = useContacts({
    page,
    limit: 20,
    search: search || undefined,
    tag: debouncedTag || undefined,
    ownerId: ownerId === ALL_OWNERS ? undefined : ownerId,
  })
  const companiesQuery = useCompanies()
  const membersQuery = useOrgMembers()

  const companyNameById = useMemo(() => {
    const map = new Map<string, string>()
    companiesQuery.data?.forEach((company) => map.set(company.id, company.name))
    return map
  }, [companiesQuery.data])

  const memberNameById = useMemo(() => {
    const map = new Map<string, string>()
    membersQuery.data?.forEach((member) =>
      map.set(member.id, `${member.firstName} ${member.lastName}`),
    )
    return map
  }, [membersQuery.data])

  const meta = contactsQuery.data?.meta

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">Contacts</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-4" />
          New contact
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink/40" />
          <Input
            className="pl-8"
            placeholder="Search name or email…"
            value={searchInput}
            onChange={(event) => {
              setPage(1)
              setSearchInput(event.target.value)
            }}
          />
        </div>

        <Input
          className="w-40"
          placeholder="Filter by tag"
          value={tag}
          onChange={(event) => {
            setPage(1)
            setTag(event.target.value)
          }}
        />

        {canFilterByOwner && (
          <Select
            value={ownerId}
            onValueChange={(value) => {
              setPage(1)
              setOwnerId(value ?? ALL_OWNERS)
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All owners" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_OWNERS}>All owners</SelectItem>
              {membersQuery.data?.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.firstName} {member.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {contactsQuery.isError && (
        <p className="text-sm text-brick">
          {getApiErrorMessage(contactsQuery.error, 'Unable to load contacts.')}
        </p>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Tags</TableHead>
            {canFilterByOwner && <TableHead>Owner</TableHead>}
            <TableHead>Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contactsQuery.isPending &&
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={canFilterByOwner ? 7 : 6}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {contactsQuery.data?.data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={canFilterByOwner ? 7 : 6}
                className="py-10 text-center text-sm text-ink/50"
              >
                No contacts found.
              </TableCell>
            </TableRow>
          )}

          {contactsQuery.data?.data.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <Link
                  to={`/contacts/${contact.id}`}
                  className="font-medium text-ink hover:text-ledger hover:underline"
                >
                  {contact.firstName} {contact.lastName}
                </Link>
              </TableCell>
              <TableCell className="text-ink/70">
                {contact.companyId
                  ? (companyNameById.get(contact.companyId) ?? '—')
                  : '—'}
              </TableCell>
              <TableCell className="text-ink/70">
                {contact.email ?? '—'}
              </TableCell>
              <TableCell className="font-mono text-xs text-ink/70">
                {contact.phone ?? '—'}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              {canFilterByOwner && (
                <TableCell className="text-ink/70">
                  {memberNameById.get(contact.ownerId) ?? '—'}
                </TableCell>
              )}
              <TableCell className="font-mono text-xs text-ink/50">
                {new Date(contact.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink/50">
            Page <span className="font-mono">{meta.page}</span> of{' '}
            <span className="font-mono">{meta.totalPages}</span> ·{' '}
            <span className="font-mono">{meta.total}</span> contacts
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ContactFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  )
}
