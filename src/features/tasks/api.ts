import { apiClient } from '@/lib/api-client'
import type { Task, TaskInput } from '@/types/task'
import type { PaginatedResponse } from '@/types/pagination'

export function getMyTasks() {
  return apiClient
    .get<PaginatedResponse<Task>>('/tasks/my', {
      params: { completed: false, limit: 100 },
    })
    .then((res) => res.data)
}

export function createTask(input: TaskInput) {
  return apiClient.post<Task>('/tasks', input).then((res) => res.data)
}

export function setTaskCompleted(taskId: string, completed: boolean) {
  return apiClient
    .patch<Task>(`/tasks/${taskId}`, { completed })
    .then((res) => res.data)
}
