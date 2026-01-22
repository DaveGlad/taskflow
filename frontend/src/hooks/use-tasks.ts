/**
 * @fileoverview Task Hooks
 * @module hooks/use-tasks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services';
import type { TaskFilters, CreateTaskInput, UpdateTaskInput } from '@/types';

const QUERY_KEYS = {
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
};

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.tasks, filters],
    queryFn: () => apiService.getTasks(filters),
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.task(id),
    queryFn: () => apiService.getTaskById(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => apiService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      apiService.updateTask(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.task(id) });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });
}

export function useMarkTaskAsCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.markTaskAsCompleted(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.task(id) });
    },
  });
}

export function useMarkTaskAsInProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.markTaskAsInProgress(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.task(id) });
    },
  });
}
