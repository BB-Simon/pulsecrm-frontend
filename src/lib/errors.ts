import { isAxiosError } from 'axios'

interface ApiErrorBody {
  message: string | string[]
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorBody>(error) && error.response?.data?.message) {
    const { message } = error.response.data
    return Array.isArray(message) ? message.join(', ') : message
  }
  return fallback
}
