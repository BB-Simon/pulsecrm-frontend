import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useContact, useDeleteContact } from '@/features/contacts/hooks'
import { useCompanies } from '@/features/companies/hooks'
import { useOrgMembers } from '@/features/users/hooks'
import { ContactFormDialog } from '@/components/contacts/contact-form-dialog'
import { getApiErrorMessage } from '@/lib/errors'
import { formatDate } from '@/lib/format'

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-mist py-2.5 text-sm last:border-0">
      <span className="text-ink/50">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}

export function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const contactQuery = useContact(id)
  const companiesQuery = useCompanies()
  const membersQuery = useOrgMembers()
  const deleteMutation = useDeleteContact()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const contact = contactQuery.data
  const company = companiesQuery.data?.find((c) => c.id === contact?.companyId)
  const owner = membersQuery.data?.find((m) => m.id === contact?.ownerId)

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Link
        to="/contacts"
        className="flex w-fit items-center gap-1.5 text-sm text-ink/50 hover:text-ink"
      >
        <ArrowLeft className="size-3.5" />
        Contacts
      </Link>

      {contactQuery.isPending && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {contactQuery.isError && (
        <p className="text-sm text-brick">
          {getApiErrorMessage(contactQuery.error, 'Unable to load contact.')}
        </p>
      )}

      {contact && (
        <>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-2xl text-ink">
                {contact.firstName} {contact.lastName}
              </h1>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {contact.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                {contact.leadScore !== null && (
                  <Badge
                    variant="outline"
                    className="border-0 bg-ochre/15 text-ochre"
                  >
                    Lead score {contact.leadScore}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(true)}>
                <Pencil className="size-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="text-brick hover:bg-brick/10 hover:text-brick"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <InfoRow label="Email" value={contact.email ?? '—'} />
              <InfoRow
                label="Phone"
                value={
                  <span className="font-mono">{contact.phone ?? '—'}</span>
                }
              />
              <InfoRow label="Company" value={company?.name ?? '—'} />
              <InfoRow
                label="Owner"
                value={owner ? `${owner.firstName} ${owner.lastName}` : '—'}
              />
              <InfoRow
                label="Added"
                value={
                  <span className="font-mono">
                    {formatDate(contact.createdAt)}
                  </span>
                }
              />
              <InfoRow
                label="Last updated"
                value={
                  <span className="font-mono">
                    {formatDate(contact.updatedAt)}
                  </span>
                }
              />
            </CardContent>
          </Card>

          {contact.leadScoreRationale && (
            <Card>
              <CardHeader>
                <CardTitle>Lead score rationale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-ink/70">
                  {contact.leadScoreRationale}
                </p>
              </CardContent>
            </Card>
          )}

          <ContactFormDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            contact={contact}
          />

          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete contact</DialogTitle>
                <DialogDescription>
                  Delete {contact.firstName} {contact.lastName}? This can’t be
                  undone.
                </DialogDescription>
              </DialogHeader>
              {deleteMutation.isError && (
                <p className="text-xs text-brick">
                  {getApiErrorMessage(
                    deleteMutation.error,
                    'Unable to delete contact.',
                  )}
                </p>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-brick text-paper hover:bg-brick/90"
                  disabled={deleteMutation.isPending}
                  onClick={() =>
                    deleteMutation.mutate(contact.id, {
                      onSuccess: () => navigate('/contacts', { replace: true }),
                    })
                  }
                >
                  {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
