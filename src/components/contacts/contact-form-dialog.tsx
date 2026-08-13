import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCompanies } from '@/features/companies/hooks'
import { useOrgMembers } from '@/features/users/hooks'
import { useCreateContact, useUpdateContact } from '@/features/contacts/hooks'
import {
  contactFormSchema,
  type ContactFormInput,
} from '@/features/contacts/schemas'
import { useAuthStore } from '@/stores/auth-store'
import { getApiErrorMessage } from '@/lib/errors'
import type { Contact } from '@/types/contact'

const NO_COMPANY = '__none__'

function contactToFormValues(contact?: Contact): ContactFormInput {
  return {
    firstName: contact?.firstName ?? '',
    lastName: contact?.lastName ?? '',
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    companyId: contact?.companyId ?? NO_COMPANY,
    tags: contact?.tags.join(', ') ?? '',
    ownerId: contact?.ownerId,
  }
}

export function ContactFormDialog({
  open,
  onOpenChange,
  contact,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact?: Contact
  onSaved?: (contact: Contact) => void
}) {
  const isEdit = Boolean(contact)
  const role = useAuthStore((state) => state.user?.role)
  const canAssignOwner = role === 'ADMIN' || role === 'MANAGER'

  const companiesQuery = useCompanies()
  const membersQuery = useOrgMembers()
  const createMutation = useCreateContact()
  const updateMutation = useUpdateContact(contact?.id ?? '')
  const mutation = isEdit ? updateMutation : createMutation

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    values: contactToFormValues(contact),
  })

  useEffect(() => {
    if (open) {
      reset(contactToFormValues(contact))
      mutation.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, contact])

  const onSubmit = (input: ContactFormInput) => {
    const payload = {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email || undefined,
      phone: input.phone || undefined,
      companyId: input.companyId === NO_COMPANY ? undefined : input.companyId,
      tags: input.tags
        ? input.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      ...(canAssignOwner ? { ownerId: input.ownerId } : {}),
    }

    mutation.mutate(payload, {
      onSuccess: (savedContact) => {
        onOpenChange(false)
        onSaved?.(savedContact)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit contact' : 'New contact'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update this contact’s details.'
              : 'Add a new contact to your organization.'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-xs text-brick">{errors.firstName.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-xs text-brick">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-xs text-brick">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="companyId">Company</Label>
            <Controller
              control={control}
              name="companyId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="companyId" className="w-full">
                    <SelectValue placeholder="No company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_COMPANY}>No company</SelectItem>
                    {companiesQuery.data?.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {canAssignOwner && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ownerId">Owner</Label>
              <Controller
                control={control}
                name="ownerId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="ownerId" className="w-full">
                      <SelectValue placeholder="Assign to…" />
                    </SelectTrigger>
                    <SelectContent>
                      {membersQuery.data?.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.firstName} {member.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="vip, newsletter"
              {...register('tags')}
            />
            <p className="text-xs text-ink/40">Comma-separated</p>
          </div>

          {mutation.isError && (
            <p className="text-xs text-brick">
              {getApiErrorMessage(mutation.error, 'Unable to save contact.')}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? 'Saving…'
                : isEdit
                  ? 'Save changes'
                  : 'Create contact'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
