/**
 * @fileoverview Task Form Component
 * @module components/features/task-form
 */

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskPriority, TaskStatus } from '@/types';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/types';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const isEditing = !!task;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateTaskInput | UpdateTaskInput>({
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      priority: task?.priority ?? 'medium',
      ...(isEditing && { status: task.status }),
    },
  });

  const priorityLabels: Record<TaskPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  const statusLabels: Record<TaskStatus, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    completed: 'Completed',
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter task title"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter task description (optional)"
          {...register('description')}
        />
      </div>

      <div className="space-y-2">
        <Label>Priority</Label>
        <Select
          defaultValue={watch('priority') ?? 'medium'}
          onValueChange={(value) => setValue('priority', value as TaskPriority)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {TASK_PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priorityLabels[priority]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isEditing && (
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            defaultValue={task.status}
            onValueChange={(value) => setValue('status', value as TaskStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {TASK_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
