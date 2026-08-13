import { Link, useNavigate } from 'react-router-dom'
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
import { useSignup } from '@/features/auth/hooks'
import { signupSchema, type SignupInput } from '@/features/auth/schemas'
import { getApiErrorMessage } from '@/lib/errors'

export function SignupPage() {
  const navigate = useNavigate()
  const signupMutation = useSignup()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) })

  const onSubmit = (input: SignupInput) => {
    signupMutation.mutate(input, {
      onSuccess: () => navigate('/dashboard', { replace: true }),
    })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-heading text-2xl text-ink">PulseCRM</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create your organization</CardTitle>
            <CardDescription>
              Start your free trial — no card required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
              noValidate
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="organizationName">Organization name</Label>
                <Input
                  id="organizationName"
                  autoComplete="organization"
                  {...register('organizationName')}
                />
                {errors.organizationName && (
                  <p className="text-xs text-brick">
                    {errors.organizationName.message}
                  </p>
                )}
              </div>

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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-brick">{errors.email.message}</p>
                )}
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

              {signupMutation.isError && (
                <p className="text-xs text-brick">
                  {getApiErrorMessage(
                    signupMutation.error,
                    'Unable to create your organization. Please try again.',
                  )}
                </p>
              )}

              <Button
                type="submit"
                className="mt-2 w-full"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? 'Creating account…' : 'Sign up'}
              </Button>
            </form>
          </CardContent>
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
