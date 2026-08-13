import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import { useUIStore } from '@/stores/ui-store'
import { getApiErrorMessage } from '@/lib/errors'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// Requests to these endpoints should never trigger the refresh/logout flow —
// a 401 from /auth/login means "wrong password", not "your session expired".
const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/signup',
  '/auth/refresh',
  '/auth/accept-invite',
]

function isAuthEndpoint(url?: string): boolean {
  return Boolean(url && AUTH_ENDPOINTS.some((path) => url.includes(path)))
}

function logout() {
  useAuthStore.getState().clearAuth()
  if (window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
}

// Shared across concurrent 401s so a burst of requests triggers one refresh
// call, not one per request.
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await axios.post<{
    accessToken: string
    refreshToken: string
  }>(`${import.meta.env.VITE_API_URL}/auth/refresh`, { refreshToken })

  useAuthStore
    .getState()
    .setTokens(response.data.accessToken, response.data.refreshToken)
  return response.data.accessToken
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 402) {
      useUIStore
        .getState()
        .openUpgradeModal(
          getApiErrorMessage(
            error,
            'You’ve hit a limit on your current plan. Upgrade to continue.',
          ),
        )
      return Promise.reject(error)
    }

    const originalRequest = error.config as RetryableConfig | undefined

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null
        })
        const newToken = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch {
        logout()
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)
