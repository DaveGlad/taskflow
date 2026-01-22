/**
 * @fileoverview Task Store
 * @module stores/task
 */

import { create } from 'zustand';
import type { Task, TaskFilters } from '@/types';

interface TaskState {
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  isCreateDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
  selectedTask: null,
  setSelectedTask: (task) => set({ selectedTask: task }),
  isCreateDialogOpen: false,
  setCreateDialogOpen: (open) => set({ isCreateDialogOpen: open }),
  isEditDialogOpen: false,
  setEditDialogOpen: (open) => set({ isEditDialogOpen: open }),
  isDeleteDialogOpen: false,
  setDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
}));
