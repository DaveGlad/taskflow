/**
 * @fileoverview Tasks Page
 * @module pages/tasks-page
 */

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskCard } from '@/components/features/task-card';
import { TaskForm } from '@/components/features/task-form';
import { TaskFilters } from '@/components/features/task-filters';
import { useTaskStore } from '@/stores';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useMarkTaskAsCompleted,
  useMarkTaskAsInProgress,
} from '@/hooks/use-tasks';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types';

export function TasksPage() {
  const {
    filters,
    setFilters,
    selectedTask,
    setSelectedTask,
    isCreateDialogOpen,
    setCreateDialogOpen,
    isEditDialogOpen,
    setEditDialogOpen,
    isDeleteDialogOpen,
    setDeleteDialogOpen,
  } = useTaskStore();

  const { data: tasks, isLoading, error } = useTasks(filters);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const markAsCompleted = useMarkTaskAsCompleted();
  const markAsInProgress = useMarkTaskAsInProgress();

  const handleCreateTask = (data: CreateTaskInput) => {
    createTask.mutate(data, { onSuccess: () => setCreateDialogOpen(false) });
  };

  const handleUpdateTask = (data: UpdateTaskInput) => {
    if (!selectedTask) return;
    updateTask.mutate({ id: selectedTask.id, data }, {
      onSuccess: () => {
        setEditDialogOpen(false);
        setSelectedTask(null);
      },
    });
  };

  const handleDeleteTask = () => {
    if (!selectedTask) return;
    deleteTask.mutate(selectedTask.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedTask(null);
      },
    });
  };

  const handleStatusChange = (task: Task) => {
    if (task.status === 'todo') {
      markAsInProgress.mutate(task.id);
    } else if (task.status === 'in_progress') {
      markAsCompleted.mutate(task.id);
    }
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (task: Task) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-destructive">Error loading tasks: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>Create Task</Button>
      </div>

      <div className="mb-6">
        <TaskFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : tasks?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No tasks found. Create your first task to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setCreateDialogOpen(false)}
            isLoading={createTask.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <TaskForm
              task={selectedTask}
              onSubmit={handleUpdateTask}
              onCancel={() => { setEditDialogOpen(false); setSelectedTask(null); }}
              isLoading={updateTask.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setSelectedTask(null); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask} disabled={deleteTask.isPending}>
              {deleteTask.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
