import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTask, getMyTasks, setTaskCompleted } from '@/features/tasks/api'
import type { Task, TaskInput } from '@/types/task'
import type { PaginatedResponse } from '@/types/pagination'

const MY_TASKS_KEY = ['tasks', 'my']

export function useMyTasks() {
  return useQuery({
    queryKey: MY_TASKS_KEY,
    queryFn: getMyTasks,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TaskInput) => createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_TASKS_KEY })
    },
  })
}

export function useCompleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => setTaskCompleted(taskId, true),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: MY_TASKS_KEY })
      const previous =
        queryClient.getQueryData<PaginatedResponse<Task>>(MY_TASKS_KEY)

      if (previous) {
        queryClient.setQueryData<PaginatedResponse<Task>>(MY_TASKS_KEY, {
          ...previous,
          data: previous.data.filter((task) => task.id !== taskId),
          meta: { ...previous.meta, total: previous.meta.total - 1 },
        })
      }

      return { previous }
    },
    onError: (_error, _taskId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(MY_TASKS_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MY_TASKS_KEY })
    },
  })
}
