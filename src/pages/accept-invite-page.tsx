import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAcceptInvite } from '@/features/auth/hooks'
import {
  acceptInviteSchema,
  type AcceptInviteInput,
} from '@/features/auth/schemas'
import { getApiErrorMessage } from '@/lib/errors'

export function AcceptInvitePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const acceptInviteMutation = useAcceptInvite()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteInput>({ resolver: zodResolver(acceptInviteSchema) })

  const onSubmit = (input: AcceptInviteInput) => {
    if (!token) return
    acceptInviteMutation.mutate(
      { ...input, token },
      { onSuccess: () => navigate('/dashboard', { replace: true }) },
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-heading text-2xl text-ink">PulseCRM</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accept invite</CardTitle>
            <CardDescription>
              {token
                ? 'Set your name and password to join the team.'
                : 'This invite link is missing its token.'}
            </CardDescription>
          </CardHeader>
          {token ? (
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
                noValidate
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      autoComplete="given-name"
                      {...register('firstName')}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-brick">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      autoComplete="family-name"
                      {...register('lastName')}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-brick">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-xs text-brick">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {acceptInviteMutation.isError && (
                  <p className="text-xs text-brick">
                    {getApiErrorMessage(
                      acceptInviteMutation.error,
                      'This invite is invalid or has expired.',
                    )}
                  </p>
                )}

                <Button
                  type="submit"
                  className="mt-2 w-full"
                  disabled={acceptInviteMutation.isPending}
                >
                  {acceptInviteMutation.isPending
                    ? 'Joining…'
                    : 'Accept invite'}
                </Button>
              </form>
            </CardContent>
          ) : (
            <CardContent>
              <p className="text-sm text-brick">
                Ask whoever invited you to resend the invite link.
              </p>
            </CardContent>
          )}
        </Card>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{' '}
          <Link to="/login" className="text-ochre hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
