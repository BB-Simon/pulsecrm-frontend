import { useMutation } from '@tanstack/react-query'
import { acceptInvite, login, signup } from '@/features/auth/api'
import { useAuthStore } from '@/stores/auth-store'

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
    },
  })
}

export function useSignup() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
    },
  })
}

export function useAcceptInvite() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: acceptInvite,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
    },
  })
}
